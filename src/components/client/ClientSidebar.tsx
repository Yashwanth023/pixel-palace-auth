
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListTodo, UserCog, LogOut } from 'lucide-react';
import { authStorage } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="w-64 h-screen bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">PixelPalace</h1>
        <p className="text-sm text-muted-foreground">Client Dashboard</p>
      </div>
      
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/50"
                } animated-btn`}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-accent/50 transition-colors animated-btn"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ClientSidebar;
