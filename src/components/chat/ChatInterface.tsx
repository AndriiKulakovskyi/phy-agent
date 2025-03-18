import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Save } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { generateDummyResponse, simulateTyping } from "./DummyAIResponse";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string, type: "text" | "voice") => void;
  onSaveConversation?: (messages: Message[]) => void;
  isLoading?: boolean;
  className?: string;
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages: initialMessages = [
    {
      id: "1",
      content: "Hello! How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  onSendMessage = (message, type) =>
    console.log(`Sent ${type} message: ${message}`),
  onSaveConversation = (messages) =>
    console.log(`Saved conversation with ${messages.length} messages`),
  isLoading = false,
  className = "",
  conversationId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceResponseEnabled, setVoiceResponseEnabled] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle voice recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // If stopping recording, simulate sending a voice message
    if (isRecording) {
      const voiceMessage = "Voice message content would be processed here";
      handleSendMessage(voiceMessage, "voice");
    }
  };

  // Handle saving the conversation
  const handleSaveConversation = () => {
    setIsSaving(true);
    // Simulate saving process
    setTimeout(() => {
      onSaveConversation(messages);
      setIsSaving(false);
    }, 1000);
  };

  // Handle sending a message
  const handleSendMessage = (message: string, type: "text" | "voice") => {
    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    onSendMessage(message, type);

    // Create typing indicator
    const typingIndicator: Message = {
      id: `typing-${Date.now()}`,
      content: "",
      sender: "ai",
      timestamp: new Date(),
      isTyping: true,
    };

    setTypingMessage(typingIndicator);

    // Generate a dummy response
    const aiResponse = generateDummyResponse();

    // Simulate typing effect for the AI response
    let currentContent = "";
    simulateTyping(
      aiResponse,
      (text) => {
        currentContent = text;
        setTypingMessage((prev) => (prev ? { ...prev, content: text } : null));
      },
      () => {
        // When typing is complete, add the full message to the chat
        setTypingMessage(null);
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // If voice responses are enabled, we would trigger text-to-speech here
        if (voiceResponseEnabled) {
          console.log("Would play voice response:", aiResponse);
          // In a real implementation, this would call a TTS service
        }
      },
    );
  };

  // Combine regular messages with typing indicator if present
  const displayMessages = typingMessage
    ? [...messages, typingMessage]
    : messages;

  return (
    <div className={`flex flex-col h-full w-full bg-background ${className}`}>
      <div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <h2 className="text-xl font-semibold">Therapy Chat</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveConversation}
            disabled={isSaving || messages.length <= 1}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Chat"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Voice Responses
                  </span>
                  <Switch
                    checked={voiceResponseEnabled}
                    onCheckedChange={setVoiceResponseEnabled}
                    aria-label="Toggle voice responses"
                  />
                  {voiceResponseEnabled ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enable or disable AI voice responses</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList messages={displayMessages} />
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        disabled={isLoading || typingMessage !== null}
        placeholder="Type your message here..."
      />
    </div>
  );
};

export default ChatInterface;
