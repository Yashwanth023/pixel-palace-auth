
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authStorage } from '@/utils/storage';
import ClientSidebar from '@/components/client/ClientSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const ClientDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated and is a client
    if (!authStorage.isAuthenticated()) {
      navigate('/');
    } else if (!authStorage.isClient()) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <ClientSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
