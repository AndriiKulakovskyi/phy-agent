from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import json

# Import your modules
from .database import get_db, engine
from .models import Base, User, Conversation, Message, Document, UserProfile
from .schemas import (
    UserCreate, UserResponse, ConversationCreate, ConversationUpdate, 
    MessageCreate, DocumentCreate, UserProfileCreate, UserProfileResponse,
    ChatCompletionRequest, ChatCompletionResponse, ChatMessage
)
from .auth import create_access_token, get_password_hash, verify_password, get_current_user
from .rag import (
    query_documents, process_document, initialize_vector_store, 
    analyze_sentiment, detect_intent, generate_conversation_summary
)
from .memory import get_conversation_history, get_user_conversation_summaries
from .personalization import (
    get_or_create_user_profile, update_user_profile, 
    create_personalized_prompt, analyze_conversation_for_insights
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize vector store
initialize_vector_store()

app = FastAPI(title="Mental Health Support API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        role="patient"  # Default role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default user profile
    profile = UserProfile(user_id=db_user.id)
    db.add(profile)
    db.commit()
    
    # Generate token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "role": db_user.role,
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/api/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "access_token": access_token,
        "token_type": "bearer",
        "preferences": user.preferences
    }

# User profile routes
@app.get("/api/users/me/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_or_create_user_profile(db, current_user.id)
    return profile

@app.put("/api/users/me/profile", response_model=UserProfileResponse)
async def update_user_profile_endpoint(profile: UserProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_profile = update_user_profile(db, current_user.id, profile.dict())
    return updated_profile

@app.put("/api/users/me/preferences")
async def update_user_preferences(preferences: Dict[str, Any], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user.id).first()
    user.preferences = preferences
    db.commit()
    db.refresh(user)
    return {"status": "success", "preferences": user.preferences}

# Conversation routes
@app.post("/api/conversations", response_model=Dict[str, Any])
async def create_conversation(conversation: ConversationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_conversation = Conversation(
        title=conversation.title,
        user_id=current_user.id
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    return {"id": db_conversation.id, "title": db_conversation.title}

@app.get("/api/conversations", response_model=List[Dict[str, Any]])
async def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversations = db.query(Conversation).filter(Conversation.user_id == current_user.id).all()
    return [{
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "message_count": len(conv.messages),
        "summary": conv.summary,
        "sentiment": conv.sentiment
    } for conv in conversations]

@app.get("/api/conversations/{conversation_id}", response_model=Dict[str, Any])
async def get_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "message_count": len(conversation.messages),
        "summary": conversation.summary,
        "sentiment": conversation.sentiment
    }

@app.put("/api/conversations/{conversation_id}", response_model=Dict[str, Any])
async def update_conversation(conversation_id: int, conversation: ConversationUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not db_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Update fields
    if conversation.title is not None:
        db_conversation.title = conversation.title
    if conversation.summary is not None:
        db_conversation.summary = conversation.summary
    
    db.commit()
    db.refresh(db_conversation)
    
    return {
        "id": db_conversation.id,
        "title": db_conversation.title,
        "created_at": db_conversation.created_at,
        "updated_at": db_conversation.updated_at,
        "summary": db_conversation.summary,
        "sentiment": db_conversation.sentiment
    }

@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not db_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete all messages in the conversation
    db.query(Message).filter(Message.conversation_id == conversation_id).delete()
    
    # Delete the conversation
    db.delete(db_conversation)
    db.commit()
    
    return {"status": "success"}

# Message routes
@app.post("/api/conversations/{conversation_id}/messages", response_model=Dict[str, Any])
async def create_message(conversation_id: int, message: MessageCreate, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify conversation exists and belongs to user
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Analyze user message sentiment and intent
    sentiment = analyze_sentiment(message.content)
    intent = detect_intent(message.content)
    
    # Create user message
    db_message = Message(
        content=message.content,
        sender="user",
        conversation_id=conversation_id,
        sentiment=sentiment,
        intent=intent
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Generate AI response using RAG if needed
    ai_response = ""
    metadata = {}
    
    if message.use_rag:
        # Query documents using RAG with personalization
        ai_response, metadata = query_documents(db, message.content, current_user.id)
    else:
        # Create personalized prompt
        system_prompt = create_personalized_prompt(db, current_user.id, conversation_id)
        
        # Format messages for OpenAI
        chat_messages = [
            ChatMessage(role="system", content=system_prompt)
        ]
        
        # Add recent conversation history (last 5 messages)
        history = get_conversation_history(db, conversation_id, limit=5)
        for hist_msg in history:
            role = "assistant" if hist_msg["sender"] == "ai" else "user"
            chat_messages.append(ChatMessage(role=role, content=hist_msg["content"]))
        
        # Add current message
        chat_messages.append(ChatMessage(role="user", content=message.content))
        
        # Create request
        request = ChatCompletionRequest(
            messages=chat_messages,
            user_id=current_user.id,
            conversation_id=conversation_id
        )
        
        # Get response from OpenAI
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
        response = llm.invoke(request.messages[-1].content)
        ai_response = response.content
        
        # Create metadata
        metadata = {
            "model": "gpt-4o",
            "personalized": True,
            "processing_time": 0.0  # Would be calculated in a real implementation
        }
    
    # Create AI message
    ai_message = Message(
        content=ai_response,
        sender="ai",
        conversation_id=conversation_id,
        metadata=metadata
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    # Update conversation in background
    background_tasks.add_task(update_conversation_metadata, db, conversation_id)
    
    return {
        "user_message": {
            "id": db_message.id,
            "content": db_message.content,
            "sender": db_message.sender,
            "created_at": db_message.created_at,
            "sentiment": db_message.sentiment,
            "intent": db_message.intent
        },
        "ai_message": {
            "id": ai_message.id,
            "content": ai_message.content,
            "sender": ai_message.sender,
            "created_at": ai_message.created_at,
            "metadata": ai_message.metadata
        }
    }

@app.get("/api/conversations/{conversation_id}/messages", response_model=List[Dict[str, Any]])
async def get_messages(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify conversation exists and belongs to user
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return [{
        "id": msg.id,
        "content": msg.content,
        "sender": msg.sender,
        "created_at": msg.created_at,
        "sentiment": msg.sentiment,
        "intent": msg.intent,
        "metadata": msg.metadata
    } for msg in messages]

# Document routes (for RAG)
@app.post("/api/documents", response_model=Dict[str, Any])
async def upload_document(document: DocumentCreate, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to upload documents")
    
    db_document = Document(
        name=document.name,
        content=document.content,
        context_notes=document.context_notes,
        document_type=document.document_type,
        status="processing",  # Initial status
        embedding_status="pending"
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Process document in background
    background_tasks.add_task(process_document, db, db_document.id)
    
    return {
        "id": db_document.id,
        "name": db_document.name,
        "status": db_document.status
    }

@app.post("/api/documents/upload", response_model=Dict[str, Any])
async def upload_document_file(
    file: UploadFile = File(...),
    document_type: Optional[str] = None,
    context_notes: Optional[str] = None,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to upload documents")
    
    # Read file content
    content = await file.read()
    content_text = content.decode("utf-8")
    
    # Create document
    db_document = Document(
        name=file.filename,
        content=content_text,
        context_notes=context_notes,
        document_type=document_type,
        status="processing",  # Initial status
        embedding_status="pending"
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Process document in background
    background_tasks.add_task(process_document, db, db_document.id)
    
    return {
        "id": db_document.id,
        "name": db_document.name,
        "status": db_document.status
    }

@app.get("/api/documents", response_model=List[Dict[str, Any]])
async def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view documents")
    
    documents = db.query(Document).all()
    return [{
        "id": doc.id,
        "name": doc.name,
        "status": doc.status,
        "created_at": doc.created_at,
        "context_notes": doc.context_notes,
        "document_type": doc.document_type,
        "embedding_status": doc.embedding_status,
        "chunk_count": doc.chunk_count
    } for doc in documents]

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete documents")
    
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete document chunks
    db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).delete()
    
    # Delete document
    db.delete(document)
    db.commit()
    
    # Note: In a real implementation, you would also remove the document from the vector store
    
    return {"status": "success"}

# Analytics routes
@app.get("/api/analytics/user/{user_id}", response_model=Dict[str, Any])
async def get_user_analytics(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify user is admin or the user themselves
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's analytics")
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get conversation summaries
    conversation_summaries = get_user_conversation_summaries(db, user_id)
    
    # Get message patterns
    from .memory import get_user_message_patterns
    message_patterns = get_user_message_patterns(db, user_id)
    
    return {
        "user_id": user_id,
        "conversation_count": len(conversation_summaries),
        "message_patterns": message_patterns,
        "recent_conversations": conversation_summaries
    }

@app.get("/api/analytics/conversation/{conversation_id}", response_model=Dict[str, Any])
async def get_conversation_analytics(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify conversation exists and user has access
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if current_user.role != "admin" and conversation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    
    # Get conversation insights
    insights = analyze_conversation_for_insights(db, conversation_id)
    
    # Get messages
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    
    # Calculate statistics
    user_message_count = len([msg for msg in messages if msg.sender == "user"])
    ai_message_count = len([msg for msg in messages if msg.sender == "ai"])
    
    # Calculate average message length
    user_message_lengths = [len(msg.content) for msg in messages if msg.sender == "user"]
    avg_user_message_length = sum(user_message_lengths) / len(user_message_lengths) if user_message_lengths else 0
    
    return {
        "conversation_id": conversation_id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "user_id": conversation.user_id,
        "message_count": len(messages),
        "user_message_count": user_message_count,
        "ai_message_count": ai_message_count,
        "avg_user_message_length": avg_user_message_length,
        "summary": conversation.summary,
        "sentiment": conversation.sentiment,
        "insights": insights
    }

# Helper functions
async def update_conversation_metadata(db: Session, conversation_id: int):
    """Update conversation metadata like summary and sentiment."""
    # Create a new session since this runs in a background task
    from .database import SessionLocal
    db = SessionLocal()
    
    try:
        # Get conversation
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conversation:
            return
        
        # Get messages
        messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
        if not messages:
            return
        
        # Format messages for summary generation
        formatted_messages = [{
            "content": msg.content,
            "sender": msg.sender,
            "created_at": msg.created_at
        } for msg in messages]
        
        # Generate summary
        summary = generate_conversation_summary(formatted_messages)
        
        # Determine overall sentiment
        user_messages = [msg for msg in messages if msg.sender == "user"]
        sentiments = [msg.sentiment for msg in user_messages if msg.sentiment]
        
        overall_sentiment = "neutral"
        if sentiments:
            positive_count = sentiments.count("positive")
            negative_count = sentiments.count("negative")
            neutral_count = sentiments.count("neutral")
            
            if positive_count > negative_count and positive_count > neutral_count:
                overall_sentiment = "positive"
            elif negative_count > positive_count and negative_count > neutral_count:
                overall_sentiment = "negative"
            else:
                overall_sentiment = "neutral"
        
        # Update conversation
        conversation.summary = summary
        conversation.sentiment = overall_sentiment
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
