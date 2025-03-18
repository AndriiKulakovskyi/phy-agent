from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from .models import User, UserProfile, Conversation, Message
from .memory import get_user_message_patterns, create_memory_context

def get_or_create_user_profile(db: Session, user_id: int) -> UserProfile:
    """Get or create a user profile."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

def update_user_profile(db: Session, user_id: int, profile_data: Dict[str, Any]) -> UserProfile:
    """Update a user's profile with new data."""
    profile = get_or_create_user_profile(db, user_id)
    
    # Update fields
    for key, value in profile_data.items():
        if hasattr(profile, key):
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

def infer_user_preferences(db: Session, user_id: int) -> Dict[str, Any]:
    """Infer user preferences based on their conversation history."""
    # Get message patterns
    patterns = get_user_message_patterns(db, user_id)
    
    # Default preferences
    preferences = {
        "communication_style": "balanced",
        "response_length": "medium",
        "formality_level": "casual"
    }
    
    # Analyze intents to infer preferences
    intents = patterns.get("top_intents", {})
    
    # If user frequently asks questions, they might prefer detailed responses
    if "asking_question" in intents and intents["asking_question"] > 5:
        preferences["response_length"] = "detailed"
    
    # If user frequently expresses negative emotions, they might prefer empathetic communication
    sentiment = patterns.get("sentiment_distribution", {})
    if sentiment.get("negative", 0) > sentiment.get("positive", 0):
        preferences["communication_style"] = "empathetic"
    
    # If user uses formal language, match their formality
    # This would require more sophisticated analysis in a real implementation
    
    return preferences

def create_personalized_prompt(db: Session, user_id: int, conversation_id: Optional[int] = None) -> str:
    """Create a personalized system prompt for the AI based on user profile and history."""
    # Get user and profile
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return get_default_system_prompt()
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    
    # Start with base prompt
    prompt = get_default_system_prompt()
    
    # Add memory context
    memory_context = create_memory_context(db, user_id, conversation_id)
    if memory_context:
        prompt += "\n\nUser Context:\n" + memory_context
    
    # Add personalization based on profile
    if profile:
        prompt += "\n\nPersonalization Guidelines:\n"
        
        if profile.communication_style:
            prompt += f"- Use a {profile.communication_style} communication style\n"
        
        if profile.therapy_goals:
            prompt += f"- Focus on helping with: {profile.therapy_goals}\n"
    
    # Add inferred preferences
    preferences = infer_user_preferences(db, user_id)
    if preferences:
        if "communication_style" in preferences and not (profile and profile.communication_style):
            prompt += f"- Adapt a {preferences['communication_style']} tone\n"
        
        if "response_length" in preferences:
            prompt += f"- Provide {preferences['response_length']} length responses\n"
        
        if "formality_level" in preferences:
            prompt += f"- Maintain a {preferences['formality_level']} level of formality\n"
    
    return prompt

def get_default_system_prompt() -> str:
    """Get the default system prompt for the AI."""
    return """You are an AI mental health support assistant designed to provide empathetic, 
    helpful guidance. Your responses should be supportive, non-judgmental, and focused on the user's wellbeing. 
    You are not a replacement for professional mental health care, and you should suggest seeking professional 
    help when appropriate. Always prioritize user safety and wellbeing in your responses.
    
    Guidelines:
    1. Be empathetic and understanding
    2. Provide practical, evidence-based suggestions when appropriate
    3. Recognize the limits of AI assistance and recommend professional help when needed
    4. Maintain a supportive and non-judgmental tone
    5. Respect user privacy and confidentiality
    6. Avoid making definitive diagnoses or medical recommendations
    7. Focus on coping strategies and emotional support
    8. Be alert for signs of crisis and provide appropriate resources
    """

def analyze_conversation_for_insights(db: Session, conversation_id: int) -> Dict[str, Any]:
    """Analyze a conversation to extract insights about the user."""
    # Get conversation messages
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    
    # Extract user messages
    user_messages = [msg for msg in messages if msg.sender == "user"]
    
    if not user_messages:
        return {}
    
    # Analyze sentiment trends
    sentiments = [msg.sentiment for msg in user_messages if msg.sentiment]
    sentiment_trend = "neutral"
    if sentiments:
        positive_count = sentiments.count("positive")
        negative_count = sentiments.count("negative")
        neutral_count = sentiments.count("neutral")
        
        if positive_count > negative_count and positive_count > neutral_count:
            sentiment_trend = "improving"
        elif negative_count > positive_count and negative_count > neutral_count:
            sentiment_trend = "declining"
        else:
            sentiment_trend = "stable"
    
    # Analyze common intents
    intents = [msg.intent for msg in user_messages if msg.intent]
    intent_counts = {}
    for intent in intents:
        intent_counts[intent] = intent_counts.get(intent, 0) + 1
    
    top_intents = sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return {
        "message_count": len(user_messages),
        "sentiment_trend": sentiment_trend,
        "top_intents": dict(top_intents),
        "conversation_duration": (user_messages[-1].created_at - user_messages[0].created_at).total_seconds() if len(user_messages) > 1 else 0
    }
