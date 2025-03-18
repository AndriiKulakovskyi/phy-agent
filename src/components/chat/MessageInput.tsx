import React, { useState, useRef } from "react";
import { Mic, MicOff, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageInputProps {
  onSendMessage?: (message: string, type: "text" | "voice") => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage = (message) => console.log("Message sent:", message),
  isRecording = false,
  onToggleRecording = () => console.log("Toggle recording"),
  disabled = false,
  placeholder = "Type your message here...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), "text");
      setMessage("");
      // Focus back on textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-t p-4 flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isRecording}
          className="min-h-[60px] max-h-[120px] resize-none flex-1 rounded-therapeutic border-primary/20 focus-visible:ring-primary/40"
          aria-label="Message input"
        />
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => console.log("Attach file")}
                  disabled={disabled || isRecording}
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleRecording}
                  disabled={disabled}
                  className={
                    isRecording
                      ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
                      : ""
                  }
                  aria-label={
                    isRecording ? "Stop recording" : "Start voice recording"
                  }
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isRecording ? "Stop recording" : "Start voice recording"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendMessage}
                  disabled={disabled || isRecording || !message.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isRecording && (
        <div className="flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-md animate-pulse">
          Recording voice message... Click the microphone icon to stop.
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </div>
  );
};

export default MessageInput;
