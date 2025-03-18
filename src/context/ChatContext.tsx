import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/components/chat/ChatInterface";
import { conversationApi, convertApiMessageToFrontend } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface Conversation {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, type: "text" | "voice") => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  createConversation: (title: string) => Promise<string>;
  setCurrentConversationId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversations when user changes
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [user]);

  // Load messages when conversation changes
  useEffect(() => {
    if (user && currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [user, currentConversationId]);

  const loadConversations = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiConversations = await conversationApi.getConversations(
        user.token,
      );

      const formattedConversations: Conversation[] = apiConversations.map(
        (conv: any) => ({
          id: conv.id.toString(),
          title: conv.title,
          date: new Date(conv.created_at),
          messageCount: conv.message_count,
        }),
      );

      setConversations(formattedConversations);

      // If we have conversations but none selected, select the first one
      if (formattedConversations.length > 0 && !currentConversationId) {
        setCurrentConversationId(formattedConversations[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = await conversationApi.getMessages(
        user.token,
        conversationId,
      );

      const formattedMessages: Message[] = apiMessages.map(
        convertApiMessageToFrontend,
      );

      setMessages(formattedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = async (title: string) => {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    setError(null);

    try {
      const newConversation = await conversationApi.createConversation(
        user.token,
        title,
      );

      const formattedConversation: Conversation = {
        id: newConversation.id.toString(),
        title: newConversation.title,
        date: new Date(),
        messageCount: 0,
      };

      setConversations([formattedConversation, ...conversations]);
      setCurrentConversationId(formattedConversation.id);

      return formattedConversation.id;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create conversation",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, type: "text" | "voice") => {
    if (!user || !currentConversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to UI immediately (optimistic update)
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, tempUserMessage]);

      // Send to API
      const response = await conversationApi.sendMessage(
        user.token,
        currentConversationId,
        content,
        type === "voice", // Use RAG for voice messages as an example
      );

      // Replace temp message with real one and add AI response
      const userMessage = convertApiMessageToFrontend(response.user_message);
      const aiMessage = convertApiMessageToFrontend(response.ai_message);

      setMessages((prev) => {
        // Remove the temp message
        const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
        // Add the real messages
        return [...filtered, userMessage, aiMessage];
      });

      // Update conversation in the list (message count)
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messageCount: conv.messageCount + 2 }
            : conv,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");

      // Remove the temp message on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("temp-")));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        isLoading,
        error,
        sendMessage,
        loadConversations,
        loadMessages,
        createConversation,
        setCurrentConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
