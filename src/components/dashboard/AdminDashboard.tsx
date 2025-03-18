import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import Sidebar from "./Sidebar";
import DocumentManagement from "../admin/DocumentManagement";
import AgentConfiguration from "../admin/AgentConfiguration";
import ConversationMonitoring from "../admin/ConversationMonitoring";
import { Settings, FileText, MessageSquare, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AdminDashboardProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const AdminDashboard = ({
  userName = "Admin User",
  userAvatar = "",
  onLogout = () => console.log("Logout clicked"),
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("documents");
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const navItems = [
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      id: "configuration",
      label: "Configuration",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <div className="flex flex-col h-full w-[280px] bg-sidebar-gradient border-r border-border/50 p-4">
        <div className="flex items-center space-x-3 mb-8 pt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{userName}</h3>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>

        <nav className="space-y-1 mb-auto">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === item.id ? "font-medium" : ""}`}
              onClick={() => handleTabChange(item.id)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsContent value="documents" className="m-0 p-0">
            <DocumentManagement />
          </TabsContent>
          <TabsContent value="configuration" className="m-0 p-0">
            <AgentConfiguration />
          </TabsContent>
          <TabsContent value="monitoring" className="m-0 p-0">
            <ConversationMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
