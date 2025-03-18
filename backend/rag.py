from typing import List, Dict, Any, Optional, Tuple
import os
import json
import time
from dotenv import load_dotenv
import faiss
import numpy as np
from sqlalchemy.orm import Session
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document as LangchainDocument
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

from .models import Document, DocumentChunk, User, UserProfile
from .database import get_db

load_dotenv()

# Initialize OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Vector database path
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vector_db")

# Ensure vector DB directory exists
os.makedirs(VECTOR_DB_PATH, exist_ok=True)

# Initialize embeddings model
embeddings_model = OpenAIEmbeddings()

# Initialize FAISS index
index_dimension = 1536  # OpenAI embedding dimension
index = None
document_lookup = {}

def initialize_vector_store():
    """Initialize or load the FAISS vector store."""
    global index, document_lookup
    index_path = os.path.join(VECTOR_DB_PATH, "index.faiss")
    lookup_path = os.path.join(VECTOR_DB_PATH, "document_lookup.json")
    
    if os.path.exists(index_path) and os.path.exists(lookup_path):
        # Load existing index and lookup
        index = faiss.read_index(index_path)
        with open(lookup_path, 'r') as f:
            document_lookup = json.load(f)
    else:
        # Create new index
        index = faiss.IndexFlatL2(index_dimension)
        document_lookup = {}

def save_vector_store():
    """Save the FAISS index and document lookup to disk."""
    global index, document_lookup
    index_path = os.path.join(VECTOR_DB_PATH, "index.faiss")
    lookup_path = os.path.join(VECTOR_DB_PATH, "document_lookup.json")
    
    faiss.write_index(index, index_path)
    with open(lookup_path, 'w') as f:
        json.dump(document_lookup, f)

def process_document(db: Session, document_id: int) -> bool:
    """Process a document for RAG by splitting it into chunks and creating embeddings."""
    # Get document from database
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        return False
    
    try:
        # Update document status
        document.status = "processing"
        document.embedding_status = "pending"
        db.commit()
        
        # Split document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_text(document.content)
        
        # Create document chunks in database
        db_chunks = []
        for i, chunk_text in enumerate(chunks):
            chunk = DocumentChunk(
                document_id=document.id,
                content=chunk_text,
                chunk_index=i,
            )
            db.add(chunk)
            db_chunks.append(chunk)
        
        db.commit()
        
        # Create embeddings for each chunk
        for chunk in db_chunks:
            # Create embedding
            embedding = embeddings_model.embed_query(chunk.content)
            
            # Add to FAISS index
            embedding_id = f"doc_{document.id}_chunk_{chunk.id}"
            chunk.embedding_id = embedding_id
            
            # Add to index
            index.add(np.array([embedding], dtype=np.float32))
            
            # Add to lookup
            document_lookup[embedding_id] = {
                "document_id": document.id,
                "chunk_id": chunk.id,
                "document_name": document.name,
                "content": chunk.content,
                "context_notes": document.context_notes,
                "document_type": document.document_type
            }
        
        # Update document status
        document.status = "completed"
        document.embedding_status = "completed"
        document.chunk_count = len(chunks)
        db.commit()
        
        # Save vector store
        save_vector_store()
        
        return True
    except Exception as e:
        # Update document status on error
        document.status = "failed"
        document.embedding_status = "failed"
        db.commit()
        print(f"Error processing document: {str(e)}")
        return False

def retrieve_relevant_chunks(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """Retrieve the most relevant document chunks for a query."""
    if index is None or index.ntotal == 0:
        return []
    
    # Create query embedding
    query_embedding = embeddings_model.embed_query(query)
    
    # Search index
    distances, indices = index.search(np.array([query_embedding], dtype=np.float32), top_k)
    
    # Get document chunks
    results = []
    for i, idx in enumerate(indices[0]):
        if idx != -1 and idx < index.ntotal:  # Valid index
            # Find the document ID for this index
            embedding_ids = list(document_lookup.keys())
            if idx < len(embedding_ids):
                embedding_id = embedding_ids[idx]
                chunk_info = document_lookup[embedding_id]
                chunk_info["relevance_score"] = float(1.0 / (1.0 + distances[0][i]))  # Convert distance to relevance score
                results.append(chunk_info)
    
    return results

def create_personalized_system_prompt(db: Session, user_id: int) -> str:
    """Create a personalized system prompt based on user profile and history."""
    # Get user and profile
    user = db.query(User).filter(User.id == user_id).first()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    base_prompt = """You are an AI mental health support assistant designed to provide empathetic, 
    helpful guidance. Your responses should be supportive, non-judgmental, and focused on the user's wellbeing. 
    You are not a replacement for professional mental health care, and you should suggest seeking professional 
    help when appropriate."""
    
    if not profile:
        return base_prompt
    
    # Add personalization based on profile
    personalized_prompt = base_prompt + "\n\n"
    
    if profile.communication_style:
        personalized_prompt += f"The user prefers a {profile.communication_style} communication style. "
    
    if profile.therapy_goals:
        personalized_prompt += f"Their therapy goals include: {profile.therapy_goals}. "
    
    if profile.mental_health_history:
        personalized_prompt += f"Consider their mental health history: {profile.mental_health_history}. "
    
    return personalized_prompt

def query_documents(db: Session, query: str, user_id: Optional[int] = None) -> Tuple[str, Dict[str, Any]]:
    """Query the document store using RAG and return a response with metadata."""
    start_time = time.time()
    
    # Initialize vector store if needed
    if index is None:
        initialize_vector_store()
    
    # Retrieve relevant chunks
    relevant_chunks = retrieve_relevant_chunks(query)
    
    # Create context from chunks
    context = "\n\n".join([chunk["content"] for chunk in relevant_chunks])
    
    # Create system prompt
    system_prompt = "You are a helpful AI mental health assistant."
    if user_id:
        system_prompt = create_personalized_system_prompt(db, user_id)
    
    # Create chat template
    template = ChatPromptTemplate.from_messages([
        ("system", system_prompt + "\n\nUse the following context to answer the user's question: {context}"),
        ("user", "{question}")
    ])
    
    # Create LLM
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
    
    # Create RAG chain
    rag_chain = (
        {"context": lambda x: context, "question": lambda x: x}
        | template
        | llm
        | StrOutputParser()
    )
    
    # Generate response
    response = rag_chain.invoke(query)
    
    # Calculate processing time
    processing_time = time.time() - start_time
    
    # Create metadata
    metadata = {
        "references": [{
            "document_name": chunk["document_name"],
            "relevance_score": chunk["relevance_score"],
            "document_type": chunk.get("document_type")
        } for chunk in relevant_chunks],
        "processing_time": processing_time,
        "chunks_retrieved": len(relevant_chunks),
        "personalized": user_id is not None
    }
    
    return response, metadata

def analyze_sentiment(text: str) -> str:
    """Analyze the sentiment of a text using OpenAI."""
    prompt = f"Analyze the sentiment of the following text and respond with a single word (positive, negative, or neutral): {text}"
    
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    response = llm.invoke(prompt)
    
    # Extract sentiment from response
    sentiment = response.content.strip().lower()
    if "positive" in sentiment:
        return "positive"
    elif "negative" in sentiment:
        return "negative"
    else:
        return "neutral"

def detect_intent(text: str) -> str:
    """Detect the intent of a user message using OpenAI."""
    prompt = f"""Identify the primary intent of the following message from a mental health support chat. 
    Respond with a single word or short phrase (e.g., 'seeking_advice', 'expressing_gratitude', 'reporting_crisis', 
    'sharing_experience', 'asking_question', etc.): {text}"""
    
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    response = llm.invoke(prompt)
    
    # Extract intent from response
    intent = response.content.strip().lower()
    return intent

def generate_conversation_summary(messages: List[Dict[str, Any]]) -> str:
    """Generate a summary of a conversation based on messages."""
    if not messages:
        return ""
    
    # Format messages for the prompt
    formatted_messages = "\n".join([f"{msg['sender']}: {msg['content']}" for msg in messages])
    
    prompt = f"""Summarize the following mental health support conversation in 2-3 sentences, 
    focusing on the main topics discussed and any key insights or recommendations:
    
    {formatted_messages}"""
    
    llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.3)
    response = llm.invoke(prompt)
    
    return response.content.strip()
