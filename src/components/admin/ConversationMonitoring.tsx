import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import {
  BarChart,
  Activity,
  AlertTriangle,
  MessageSquare,
  Users,
  Flag,
} from "lucide-react";

interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  timestamp: string;
  status: "active" | "idle" | "flagged";
  messageCount: number;
}

interface AnalyticsData {
  dailyActiveUsers: number;
  averageSessionTime: string;
  totalConversations: number;
  flaggedInteractions: number;
  satisfactionRate: number;
}

const ConversationMonitoring: React.FC = () => {
  // Default mock data for active conversations
  const [activeConversations, setActiveConversations] = useState<
    Conversation[]
  >([
    {
      id: "conv-1",
      user: "Sarah Johnson",
      lastMessage:
        "I've been feeling anxious about my upcoming presentation...",
      timestamp: "2 mins ago",
      status: "active",
      messageCount: 12,
    },
    {
      id: "conv-2",
      user: "Michael Chen",
      lastMessage:
        "The breathing exercises have been helping with my stress levels.",
      timestamp: "5 mins ago",
      status: "active",
      messageCount: 8,
    },
    {
      id: "conv-3",
      user: "Emily Rodriguez",
      lastMessage:
        "I'm having trouble sleeping lately. Can you suggest some techniques?",
      timestamp: "10 mins ago",
      status: "idle",
      messageCount: 15,
    },
    {
      id: "conv-4",
      user: "David Wilson",
      lastMessage:
        "I feel like harming myself sometimes when the thoughts get too dark.",
      timestamp: "12 mins ago",
      status: "flagged",
      messageCount: 7,
    },
    {
      id: "conv-5",
      user: "Jessica Taylor",
      lastMessage:
        "The meditation techniques have been really helpful for my anxiety.",
      timestamp: "20 mins ago",
      status: "idle",
      messageCount: 23,
    },
  ]);

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    dailyActiveUsers: 127,
    averageSessionTime: "8m 45s",
    totalConversations: 342,
    flaggedInteractions: 5,
    satisfactionRate: 92,
  });

  // Function to handle flagging a conversation
  const handleFlagConversation = (id: string) => {
    setActiveConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === id ? { ...conv, status: "flagged" } : conv,
      ),
    );
  };

  // Function to view conversation details (placeholder)
  const handleViewConversation = (id: string) => {
    console.log(`Viewing conversation ${id}`);
    // In a real implementation, this would open a detailed view or navigate to a conversation page
  };

  return (
    <div className="w-full h-full p-6 bg-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conversation Monitoring</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Activity className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            User Management
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.dailyActiveUsers}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageSessionTime}
            </div>
            <p className="text-xs text-muted-foreground">-2% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalConversations}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flagged Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {analyticsData.flaggedInteractions}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Satisfaction Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.satisfactionRate}%
            </div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Interactions</TabsTrigger>
        </TabsList>

        {/* Active Conversations Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeConversations.length > 0 ? (
            activeConversations.map((conversation) => (
              <Card key={conversation.id} className="bg-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>{conversation.user}</CardTitle>
                      {conversation.status === "active" && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      )}
                      {conversation.status === "idle" && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800"
                        >
                          Idle
                        </Badge>
                      )}
                      {conversation.status === "flagged" && (
                        <Badge variant="destructive">Flagged</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">"{conversation.lastMessage}"</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {conversation.messageCount} messages
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {conversation.status !== "flagged" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagConversation(conversation.id)}
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Flag
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleViewConversation(conversation.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active conversations at the moment.
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Conversation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                <div className="text-center">
                  <BarChart className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    Analytics visualization would appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Common Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Anxiety</span>
                    <Badge>32%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Depression</span>
                    <Badge>28%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Sleep Issues</span>
                    <Badge>15%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Stress Management</span>
                    <Badge>12%</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Relationship Concerns</span>
                    <Badge>8%</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Average Messages per Session</span>
                    <span className="font-medium">14</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Return Rate</span>
                    <span className="font-medium">76%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Voice Message Usage</span>
                    <span className="font-medium">23%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Resource Access Rate</span>
                    <span className="font-medium">45%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Session Completion Rate</span>
                    <span className="font-medium">89%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Flagged Interactions Tab */}
        <TabsContent value="flagged" className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention Required</AlertTitle>
            <AlertDescription>
              The following conversations have been flagged for potential risk
              or concern. Please review them promptly.
            </AlertDescription>
          </Alert>

          {activeConversations
            .filter((conv) => conv.status === "flagged")
            .map((conversation) => (
              <Card
                key={conversation.id}
                className="bg-card border-destructive/50"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>{conversation.user}</CardTitle>
                      <Badge variant="destructive">Flagged</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">"{conversation.lastMessage}"</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {conversation.messageCount} messages
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Mark as Resolved
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleViewConversation(conversation.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}

          {activeConversations.filter((conv) => conv.status === "flagged")
            .length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No flagged conversations at the moment.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationMonitoring;
