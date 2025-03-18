import { Message } from "@/components/chat/ChatInterface";

// Base API URL - change this to your FastAPI backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Helper function for handling API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "An unknown error occurred",
    }));
    throw new Error(error.detail || "An unknown error occurred");
  }
  return response.json();
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("username", email); // OAuth2 expects 'username'
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: formData,
    });

    return handleResponse(response);
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return handleResponse(response);
  },
};

// Conversation API
export const conversationApi = {
  getConversations: async (token: string) => {
    const response = await fetch(`${API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  createConversation: async (token: string, title: string) => {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    return handleResponse(response);
  },

  getMessages: async (token: string, conversationId: string) => {
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return handleResponse(response);
  },

  sendMessage: async (
    token: string,
    conversationId: string,
    content: string,
    useRag: boolean = false,
  ) => {
    const response = await fetch(
      `${API_URL}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, use_rag: useRag }),
      },
    );

    return handleResponse(response);
  },
};

// Document API (for RAG)
export const documentApi = {
  getDocuments: async (token: string) => {
    const response = await fetch(`${API_URL}/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  uploadDocument: async (
    token: string,
    name: string,
    content: string,
    contextNotes?: string,
  ) => {
    const response = await fetch(`${API_URL}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        content,
        context_notes: contextNotes,
      }),
    });

    return handleResponse(response);
  },
};

// Helper function to convert API message format to frontend format
export const convertApiMessageToFrontend = (apiMessage: any): Message => {
  return {
    id: apiMessage.id.toString(),
    content: apiMessage.content,
    sender: apiMessage.sender,
    timestamp: new Date(apiMessage.created_at),
  };
};
