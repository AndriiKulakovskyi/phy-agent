import React, { useState } from "react";
import { format } from "date-fns";
import { Search, Calendar, MessageSquare } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Conversation {
  id: string;
  date: Date;
  title: string;
  snippet: string;
  messages: number;
}

interface ConversationHistoryProps {
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
}

const ConversationHistory = ({
  conversations = [
    {
      id: "1",
      date: new Date(2023, 5, 15),
      title: "Anxiety Management Techniques",
      snippet:
        "We discussed breathing exercises and mindfulness practices to help manage anxiety symptoms.",
      messages: 24,
    },
    {
      id: "2",
      date: new Date(2023, 5, 10),
      title: "Sleep Improvement Strategies",
      snippet:
        "Explored various techniques to improve sleep quality, including creating a bedtime routine.",
      messages: 18,
    },
    {
      id: "3",
      date: new Date(2023, 5, 5),
      title: "Stress Reduction Plan",
      snippet:
        "Developed a personalized plan to identify stressors and implement coping mechanisms.",
      messages: 32,
    },
    {
      id: "4",
      date: new Date(2023, 4, 28),
      title: "Mood Tracking Discussion",
      snippet:
        "Talked about the benefits of tracking daily mood patterns and emotional triggers.",
      messages: 15,
    },
    {
      id: "5",
      date: new Date(2023, 4, 20),
      title: "Healthy Boundaries",
      snippet:
        "Discussed strategies for setting and maintaining healthy boundaries in relationships.",
      messages: 27,
    },
  ],
  onSelectConversation = (id) => console.log(`Selected conversation: ${id}`),
}: ConversationHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.snippet.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full w-full bg-background p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold">Conversation History</h1>
        <p className="text-muted-foreground">
          Browse and continue your previous conversations
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredConversations.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{conversation.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {format(conversation.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {conversation.snippet}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{conversation.messages} messages</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectConversation(conversation.id);
                    }}
                  >
                    Continue Conversation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No conversations found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? `No conversations matching "${searchTerm}"`
              : "You haven't had any conversations yet"}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
