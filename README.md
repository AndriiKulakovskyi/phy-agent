# AI-Powered Mental Health Support Application

This application provides an AI-powered mental health support platform with secure authentication, personalized chat experiences, and administrative tools for managing the system.

## Connect to the application:
You can test the forms with these credentials:

- Login: email="patient@example.com", password="password" (for patient dashboard)
- Login: email="admin@example.com", password="password" (for admin dashboard)
- Signup: Any email except "taken@example.com" will work

## Architecture Overview

The application is built with a modern stack:

### Frontend
- **React + TypeScript**: Core UI framework
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework for styling
- **Shadcn/UI**: Component library built on Radix UI
- **React Router**: Client-side routing

### Backend
- **FastAPI**: Modern, high-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **OpenAI API**: Powers the AI chat capabilities
- **LangChain**: Framework for building LLM applications
- **FAISS**: Vector database for efficient similarity search

## Key Features

### Authentication System
- Secure JWT-based authentication
- Role-based access control (patient vs admin)
- User profile management

### Chat Interface
- Real-time AI responses
- Text and voice input options
- Conversation history tracking
- Sentiment analysis of messages

### Retrieval-Augmented Generation (RAG)
- Document management for admins
- Vector embeddings for efficient retrieval
- Context-aware AI responses

### Personalization
- User profiles with preferences
- Conversation memory and context
- Adaptive communication style

### Admin Features
- Document upload for training the RAG system
- Agent configuration settings
- Conversation monitoring and analytics

## Data Structures

### User Data
- **User**: Basic user information and authentication details
- **UserProfile**: Extended user information for personalization
- **Preferences**: User interface and interaction preferences

### Conversation Data
- **Conversation**: Groups of messages between a user and the AI
- **Message**: Individual text exchanges with metadata
- **Sentiment Analysis**: Emotional tone detection for messages
- **Intent Detection**: Understanding the purpose of user messages

### Knowledge Base
- **Document**: Training materials for the RAG system
- **DocumentChunk**: Smaller segments of documents for efficient retrieval
- **Vector Embeddings**: Numerical representations of text for similarity search

## Backend Implementation Details

### RAG System

The Retrieval-Augmented Generation system works as follows:

1. **Document Processing**:
   - Documents are uploaded by admins
   - Text is split into manageable chunks
   - Each chunk is embedded using OpenAI's embedding model
   - Embeddings are stored in a FAISS vector database

2. **Query Processing**:
   - User queries are embedded using the same model
   - Similar document chunks are retrieved from the vector database
   - Retrieved chunks provide context for the AI response
   - OpenAI's GPT model generates a response using this context

### Memory and Personalization

The system maintains context and personalization through:

1. **Short-term Memory**:
   - Recent conversation history within a session
   - Detected sentiment and intent of messages

2. **Long-term Memory**:
   - User profile information
   - Historical conversation patterns
   - Inferred preferences based on past interactions

3. **Personalized Prompts**:
   - System prompts are dynamically generated for each user
   - Includes relevant context from user history
   - Adapts communication style based on user preferences

## API Endpoints

### Authentication
- `POST /api/auth/register`: Create a new user account
- `POST /api/auth/login`: Authenticate and receive access token

### User Profile
- `GET /api/users/me/profile`: Get current user's profile
- `PUT /api/users/me/profile`: Update user profile
- `PUT /api/users/me/preferences`: Update user preferences

### Conversations
- `POST /api/conversations`: Create a new conversation
- `GET /api/conversations`: List user's conversations
- `GET /api/conversations/{id}`: Get a specific conversation
- `PUT /api/conversations/{id}`: Update conversation details
- `DELETE /api/conversations/{id}`: Delete a conversation

### Messages
- `POST /api/conversations/{id}/messages`: Send a message and get AI response
- `GET /api/conversations/{id}/messages`: Get messages in a conversation

### Documents (Admin)
- `POST /api/documents`: Add a document to the knowledge base
- `POST /api/documents/upload`: Upload a document file
- `GET /api/documents`: List all documents
- `DELETE /api/documents/{id}`: Remove a document

### Analytics
- `GET /api/analytics/user/{id}`: Get user interaction analytics
- `GET /api/analytics/conversation/{id}`: Get conversation analytics

## Setup and Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Database configuration
DATABASE_URL=sqlite:///./app.db

# Security
SECRET_KEY=your-secret-key-for-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Vector database
VECTOR_DB_PATH=./vector_db
```

### Running the Application

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

## Future Enhancements

- Voice-to-text and text-to-voice capabilities
- Integration with external mental health resources
- Enhanced analytics and reporting for therapists
- Multi-language support
- Mobile application
