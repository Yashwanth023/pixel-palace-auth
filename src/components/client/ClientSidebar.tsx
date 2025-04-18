
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListTodo, UserCog, LogOut } from 'lucide-react';
import { authStorage } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const ClientSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    authStorage.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };
  
  const menuItems = [
    { path: "/client", icon: <ListTodo size={20} />, text: "Create Todo", },
    { path: "/client/view", icon: <ListTodo size={20} />, text: "View Todos", },
    { path: "/client/profile", icon: <UserCog size={20} />, text: "Profile", },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">PixelPalace</h1>
          <p className="text-sm text-muted-foreground">Client Dashboard</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild tooltip={item.text} isActive={isActive}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut size={20} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarTrigger className="absolute right-4 top-4 lg:hidden" />
    </Sidebar>
  );
};

export default ClientSidebar;
