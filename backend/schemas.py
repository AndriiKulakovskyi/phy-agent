from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserPreferences(BaseModel):
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = True
    voice_responses: Optional[bool] = False
    font_size: Optional[str] = "medium"
    high_contrast: Optional[bool] = False

class UserProfileBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    mental_health_history: Optional[str] = None
    therapy_goals: Optional[str] = None
    communication_style: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    role: str
    access_token: str
    token_type: str
    preferences: Optional[UserPreferences] = None

    class Config:
        from_attributes = True

# Conversation schemas
class ConversationBase(BaseModel):
    title: str

class ConversationCreate(ConversationBase):
    pass

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None

class ConversationResponse(ConversationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    message_count: int
    summary: Optional[str] = None
    sentiment: Optional[str] = None

    class Config:
        from_attributes = True

# Message schemas
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    use_rag: bool = False
    voice_input: bool = False

class MessageMetadata(BaseModel):
    references: Optional[List[Dict[str, Any]]] = None
    confidence_score: Optional[float] = None
    processing_time: Optional[float] = None
    voice_attributes: Optional[Dict[str, Any]] = None

class MessageResponse(MessageBase):
    id: int
    sender: str
    created_at: datetime
    sentiment: Optional[str] = None
    intent: Optional[str] = None
    message_metadata: Optional[MessageMetadata] = None

    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    name: str
    content: str
    context_notes: Optional[str] = None
    document_type: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: int
    status: str
    created_at: datetime
    embedding_status: Optional[str] = None
    chunk_count: Optional[int] = None

    class Config:
        from_attributes = True

# Chat completion schemas
class ChatMessage(BaseModel):
    role: str  # "system", "user", "assistant"
    content: str

class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    use_rag: bool = False
    user_id: Optional[int] = None
    conversation_id: Optional[int] = None
    max_tokens: Optional[int] = 500
    temperature: Optional[float] = 0.7

class ChatCompletionResponse(BaseModel):
    message: ChatMessage
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
