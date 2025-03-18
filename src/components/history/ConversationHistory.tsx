import React, { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Calendar,
  MessageSquare,
  Download,
  Filter,
  Clock,
  Tag,
} from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Conversation {
  id: string;
  date: Date;
  title: string;
  snippet: string;
  messages: number;
  tags?: string[];
  sentiment?: "positive" | "neutral" | "negative";
}

interface ConversationHistoryProps {
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  isAdmin?: boolean;
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
      tags: ["anxiety", "mindfulness", "breathing"],
      sentiment: "positive",
    },
    {
      id: "2",
      date: new Date(2023, 5, 10),
      title: "Sleep Improvement Strategies",
      snippet:
        "Explored various techniques to improve sleep quality, including creating a bedtime routine.",
      messages: 18,
      tags: ["sleep", "routine", "insomnia"],
      sentiment: "neutral",
    },
    {
      id: "3",
      date: new Date(2023, 5, 5),
      title: "Stress Reduction Plan",
      snippet:
        "Developed a personalized plan to identify stressors and implement coping mechanisms.",
      messages: 32,
      tags: ["stress", "coping", "planning"],
      sentiment: "positive",
    },
    {
      id: "4",
      date: new Date(2023, 4, 28),
      title: "Mood Tracking Discussion",
      snippet:
        "Talked about the benefits of tracking daily mood patterns and emotional triggers.",
      messages: 15,
      tags: ["mood", "tracking", "emotions"],
      sentiment: "neutral",
    },
    {
      id: "5",
      date: new Date(2023, 4, 20),
      title: "Healthy Boundaries",
      snippet:
        "Discussed strategies for setting and maintaining healthy boundaries in relationships.",
      messages: 27,
      tags: ["boundaries", "relationships", "self-care"],
      sentiment: "positive",
    },
    {
      id: "6",
      date: new Date(2023, 4, 15),
      title: "Depression Management",
      snippet:
        "Explored strategies for managing depressive symptoms and maintaining daily functioning.",
      messages: 31,
      tags: ["depression", "self-care", "daily routine"],
      sentiment: "negative",
    },
    {
      id: "7",
      date: new Date(2023, 4, 10),
      title: "Panic Attack Prevention",
      snippet:
        "Discussed techniques to identify early signs of panic attacks and strategies to prevent escalation.",
      messages: 22,
      tags: ["panic", "anxiety", "prevention"],
      sentiment: "neutral",
    },
    {
      id: "8",
      date: new Date(2023, 4, 5),
      title: "Grief Processing",
      snippet:
        "Talked about the stages of grief and healthy ways to process loss and change.",
      messages: 29,
      tags: ["grief", "loss", "emotions"],
      sentiment: "negative",
    },
  ],
  onSelectConversation = (id) => console.log(`Selected conversation: ${id}`),
  isAdmin = false,
}: ConversationHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Get all unique tags from conversations
  const allTags = Array.from(
    new Set(
      conversations
        .flatMap((conversation) => conversation.tags || [])
        .filter(Boolean),
    ),
  );

  // Filter conversations based on search term, active tab, and tag filter
  const filteredConversations = conversations
    .filter(
      (conversation) =>
        (conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conversation.snippet
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (conversation.tags || []).some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          )) &&
        (activeTab === "all" ||
          (activeTab === "positive" && conversation.sentiment === "positive") ||
          (activeTab === "neutral" && conversation.sentiment === "neutral") ||
          (activeTab === "negative" &&
            conversation.sentiment === "negative")) &&
        (!filterTag || (conversation.tags || []).includes(filterTag)),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });

  // Handle export functionality (dummy implementation)
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setExportDialogOpen(false);
            // In a real implementation, this would trigger a file download
            alert(
              `Exported all conversations as ${exportFormat.toUpperCase()}`,
            );
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Conversation History</h1>
          {isAdmin && (
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Conversation History</DialogTitle>
                  <DialogDescription>
                    Export all conversation data for analysis or backup
                    purposes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Export Format</label>
                    <div className="flex gap-4">
                      <Button
                        variant={exportFormat === "csv" ? "default" : "outline"}
                        onClick={() => setExportFormat("csv")}
                        className="flex-1"
                      >
                        CSV
                      </Button>
                      <Button
                        variant={
                          exportFormat === "json" ? "default" : "outline"
                        }
                        onClick={() => setExportFormat("json")}
                        className="flex-1"
                      >
                        JSON
                      </Button>
                    </div>
                  </div>
                  {isExporting && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Export Progress
                      </label>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${exportProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setExportDialogOpen(false)}
                    disabled={isExporting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <p className="text-muted-foreground">
          Browse and continue your previous conversations
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setFilterTag(null)}
                  className={!filterTag ? "bg-accent/50" : ""}
                >
                  All Tags
                </DropdownMenuItem>
                {allTags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={filterTag === tag ? "bg-accent/50" : ""}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSortOrder("newest")}
                  className={sortOrder === "newest" ? "bg-accent/50" : ""}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortOrder("oldest")}
                  className={sortOrder === "oldest" ? "bg-accent/50" : ""}
                >
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filterTag && (
        <div className="mb-4 flex items-center">
          <span className="text-sm mr-2">Filtered by tag:</span>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {filterTag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-primary/20"
              onClick={() => setFilterTag(null)}
            >
              <span className="sr-only">Remove filter</span>×
            </Button>
          </div>
        </div>
      )}

      {filteredConversations.length > 0 ? (
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer hover:border-primary transition-colors ${conversation.sentiment === "positive" ? "border-l-4 border-l-green-500" : conversation.sentiment === "negative" ? "border-l-4 border-l-red-500" : ""}`}
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
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{conversation.messages} messages</span>
                  </div>
                  {conversation.tags && conversation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {conversation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterTag(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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
            {searchTerm || filterTag
              ? `No conversations matching your search criteria`
              : "You haven't had any conversations yet"}
          </p>
          {(searchTerm || filterTag) && (
            <div className="flex gap-2">
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
              {filterTag && (
                <Button variant="outline" onClick={() => setFilterTag(null)}>
                  Clear Tag Filter
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
