import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface MessageListProps {
  messages?: Message[];
  className?: string;
}

const MessageList = ({
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
  className = "",
}: MessageListProps) => {
  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2 max-w-[80%]",
                message.sender === "user" ? "self-end ml-auto" : "self-start",
              )}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=therapy"
                    alt="AI Assistant"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "p-3 shadow-sm animate-gentle",
                  message.sender === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-ai",
                )}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                {message.isTyping && (
                  <div className="flex space-x-1 mt-2 items-center">
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-current animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                )}
                <div className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    alt="User"
                  />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
