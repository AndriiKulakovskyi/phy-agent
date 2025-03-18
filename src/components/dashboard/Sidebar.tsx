import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageSquare,
  History,
  LifeBuoy,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";

interface SidebarProps {
  userName?: string;
  userAvatar?: string;
  activePage?: string;
  onLogout?: () => void;
}

const Sidebar = ({
  userName = "Jane Doe",
  userAvatar = "",
  activePage = "chat",
  onLogout = () => console.log("Logout clicked"),
}: SidebarProps) => {
  const navItems = [
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      path: "/chat",
    },
    {
      id: "history",
      label: "History",
      icon: <History className="mr-2 h-4 w-4" />,
      path: "/history",
    },
    {
      id: "resources",
      label: "Resources",
      icon: <LifeBuoy className="mr-2 h-4 w-4" />,
      path: "/resources",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: <Calendar className="mr-2 h-4 w-4" />,
      path: "/schedule",
    },
  ];

  return (
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
          <p className="text-xs text-slate-500">Patient</p>
        </div>
      </div>

      <nav className="space-y-1 mb-auto">
        {navItems.map((item) => (
          <Link to={item.path} key={item.id}>
            <Button
              variant={activePage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${activePage === item.id ? "font-medium" : ""}`}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600"
          onClick={() => {}}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
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
  );
};

export default Sidebar;
