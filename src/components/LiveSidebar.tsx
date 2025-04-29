
import React from "react";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageCircle, Users, Gift, Settings, ChevronLeft } from "lucide-react";

const LiveSidebar = () => {
  const sidebarItems = [
    {
      icon: MessageCircle,
      label: "Comments"
    },
    {
      icon: Users,
      label: "Viewers"
    },
    {
      icon: Gift,
      label: "Gifts"
    },
    {
      icon: Settings,
      label: "Settings"
    }
  ];

  return (
    <Sidebar className="border-r border-white/10">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Live Stream</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default LiveSidebar;
