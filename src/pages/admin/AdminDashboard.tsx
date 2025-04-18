
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authStorage } from '@/utils/storage';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!authStorage.isAuthenticated()) {
      navigate('/');
    } else if (!authStorage.isAdmin()) {
      navigate('/client');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
