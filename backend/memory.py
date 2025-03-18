from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .models import User, Conversation, Message

def get_conversation_history(db: Session, conversation_id: int, limit: int = 20) -> List[Dict[str, Any]]:
    """Get the conversation history for a specific conversation."""
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.desc()).limit(limit).all()
    
    # Reverse to get chronological order
    messages.reverse()
    
    return [{
        "id": msg.id,
        "content": msg.content,
        "sender": msg.sender,
        "created_at": msg.created_at,
        "sentiment": msg.sentiment,
        "intent": msg.intent
    } for msg in messages]

def get_user_conversation_summaries(db: Session, user_id: int, limit: int = 5) -> List[Dict[str, Any]]:
    """Get summaries of a user's recent conversations."""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id
    ).order_by(Conversation.updated_at.desc()).limit(limit).all()
    
    return [{
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "summary": conv.summary,
        "sentiment": conv.sentiment
    } for conv in conversations]

def get_user_message_patterns(db: Session, user_id: int, days: int = 30) -> Dict[str, Any]:
    """Analyze patterns in a user's messages over a period of time."""
    # Get time threshold
    threshold = datetime.utcnow() - timedelta(days=days)
    
    # Get user's conversations
    conversations = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.created_at >= threshold
    ).all()
    
    # Get all messages from these conversations
    all_messages = []
    for conv in conversations:
        messages = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender == "user"
        ).all()
        all_messages.extend(messages)
    
    # Analyze sentiment distribution
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
    for msg in all_messages:
        if msg.sentiment:
            sentiment_counts[msg.sentiment] = sentiment_counts.get(msg.sentiment, 0) + 1
    
    # Analyze intent distribution
    intent_counts = {}
    for msg in all_messages:
        if msg.intent:
            intent_counts[msg.intent] = intent_counts.get(msg.intent, 0) + 1
    
    # Get top intents
    top_intents = sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "message_count": len(all_messages),
        "conversation_count": len(conversations),
        "sentiment_distribution": sentiment_counts,
        "top_intents": dict(top_intents),
        "time_period_days": days
    }

def create_memory_context(db: Session, user_id: int, current_conversation_id: Optional[int] = None) -> str:
    """Create a memory context string for the AI based on user history."""
    # Get user profile
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return ""
    
    context_parts = []
    
    # Add basic user info
    context_parts.append(f"User: {user.name} (Role: {user.role})")
    
    # Add user profile if available
    if hasattr(user, 'user_profile') and user.user_profile:
        profile = user.user_profile
        profile_info = []
        if profile.age:
            profile_info.append(f"Age: {profile.age}")
        if profile.gender:
            profile_info.append(f"Gender: {profile.gender}")
        if profile.therapy_goals:
            profile_info.append(f"Therapy goals: {profile.therapy_goals}")
        if profile.communication_style:
            profile_info.append(f"Preferred communication style: {profile.communication_style}")
        
        if profile_info:
            context_parts.append("User profile: " + ", ".join(profile_info))
    
    # Add message patterns
    patterns = get_user_message_patterns(db, user_id, days=30)
    if patterns["message_count"] > 0:
        # Add sentiment trends
        sentiments = patterns["sentiment_distribution"]
        dominant_sentiment = max(sentiments.items(), key=lambda x: x[1])[0] if sentiments else "neutral"
        context_parts.append(f"Recent sentiment trend: predominantly {dominant_sentiment}")
        
        # Add top intents
        if patterns["top_intents"]:
            top_intent = list(patterns["top_intents"].keys())[0] if patterns["top_intents"] else "general conversation"
            context_parts.append(f"Common conversation focus: {top_intent}")
    
    # Add current conversation context if available
    if current_conversation_id:
        conversation = db.query(Conversation).filter(Conversation.id == current_conversation_id).first()
        if conversation and conversation.summary:
            context_parts.append(f"Current conversation summary: {conversation.summary}")
    
    # Add recent conversation summaries
    recent_conversations = get_user_conversation_summaries(db, user_id, limit=3)
    if recent_conversations and len(recent_conversations) > 0:
        summaries = []
        for i, conv in enumerate(recent_conversations):
            if conv.get("summary") and current_conversation_id != conv.get("id"):
                summaries.append(f"Previous conversation {i+1}: {conv['summary']}")
        
        if summaries:
            context_parts.append("Recent conversation history: " + " ".join(summaries))
    
    return "\n".join(context_parts)
