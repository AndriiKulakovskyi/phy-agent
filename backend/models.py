from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String)  # "patient" or "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    preferences = Column(JSON, nullable=True)  # Store user preferences as JSON

    # Relationships
    conversations = relationship("Conversation", back_populates="user")
    user_profile = relationship("UserProfile", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    mental_health_history = Column(Text, nullable=True)
    therapy_goals = Column(Text, nullable=True)
    communication_style = Column(String, nullable=True)  # e.g., "direct", "empathetic", "analytical"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_profile")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    summary = Column(Text, nullable=True)  # AI-generated summary of the conversation
    sentiment = Column(String, nullable=True)  # Overall sentiment of the conversation

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    sender = Column(String)  # "user" or "ai"
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sentiment = Column(String, nullable=True)  # Sentiment analysis of the message
    intent = Column(String, nullable=True)  # Detected intent of the message
    message_metadata = Column(JSON, nullable=True)  # Additional metadata about the message

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    content = Column(Text)  # This could be the text content or a file path
    context_notes = Column(Text, nullable=True)  # Admin notes about the document
    status = Column(String)  # "processing", "completed", "failed"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    document_type = Column(String, nullable=True)  # e.g., "therapy_guide", "mental_health_resource"
    embedding_status = Column(String, nullable=True)  # "pending", "completed", "failed"
    chunk_count = Column(Integer, nullable=True)  # Number of chunks this document was split into

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    content = Column(Text)
    chunk_index = Column(Integer)
    embedding_id = Column(String, nullable=True)  # ID to reference in the vector store
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    document = relationship("Document")
