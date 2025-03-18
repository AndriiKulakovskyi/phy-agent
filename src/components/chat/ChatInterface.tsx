import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string, type: "text" | "voice") => void;
  isLoading?: boolean;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [
    {
      id: "1",
      content: "Hello! How are you feeling today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      content: "I've been feeling a bit anxious lately.",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      content:
        "I'm sorry to hear that. Can you tell me more about what's been making you feel anxious?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "4",
      content:
        "Work has been really stressful, and I'm having trouble sleeping.",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "5",
      content:
        "That sounds challenging. Let's talk about some strategies that might help with both your work stress and sleep issues.",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
  ],
  onSendMessage = (message, type) =>
    console.log(`Sent ${type} message: ${message}`),
  isLoading = false,
  className = "",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceResponseEnabled, setVoiceResponseEnabled] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);

  // Toggle voice recording
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // If stopping recording, simulate sending a voice message
    if (isRecording) {
      onSendMessage("Voice message content would be processed here", "voice");
    }
  };

  // Handle sending a message
  const handleSendMessage = (message: string, type: "text" | "voice") => {
    onSendMessage(message, type);

    // Simulate AI typing response
    const newTypingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "",
      sender: "ai",
      timestamp: new Date(),
      isTyping: true,
    };

    setTypingMessage(newTypingMessage);

    // Simulate AI response after 1.5 seconds
    setTimeout(() => {
      setTypingMessage(null);
    }, 1500);
  };

  // Combine regular messages with typing indicator if present
  const displayMessages = typingMessage
    ? [...messages, typingMessage]
    : messages;

  return (
    <div className={`flex flex-col h-full w-full bg-background ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Therapy Chat</h2>
        <div className="flex items-center gap-2">
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
        disabled={isLoading}
        placeholder="Type your message here..."
      />
    </div>
  );
};

export default ChatInterface;
