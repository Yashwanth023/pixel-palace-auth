
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authStorage } from '@/utils/storage';
import ClientSidebar from '@/components/client/ClientSidebar';

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
    <div className="flex h-screen">
      <ClientSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientDashboard;
