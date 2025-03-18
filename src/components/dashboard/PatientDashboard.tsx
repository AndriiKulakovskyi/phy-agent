import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatInterface from "../chat/ChatInterface";
import ConversationHistory from "../history/ConversationHistory";
import EmergencyResources from "../resources/EmergencyResources";
import SessionScheduler from "../schedule/SessionScheduler";

interface PatientDashboardProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const PatientDashboard = ({
  userName = "Jane Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  onLogout = () => console.log("Logout clicked"),
}: PatientDashboardProps) => {
  const [activePage, setActivePage] = useState<string>("chat");

  // Map of page IDs to their respective components
  const pageComponents: Record<string, React.ReactNode> = {
    chat: <ChatInterface />,
    history: <ConversationHistory />,
    resources: <EmergencyResources />,
    schedule: <SessionScheduler />,
  };

  // Handle navigation from sidebar
  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userAvatar={userAvatar}
        activePage={activePage}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {/* Render the active page component or the router outlet */}
        {pageComponents[activePage] || <Outlet />}
      </main>
    </div>
  );
};

export default PatientDashboard;
