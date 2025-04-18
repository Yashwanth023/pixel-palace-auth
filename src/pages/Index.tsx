
import AuthForm from '@/components/auth/AuthForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '@/utils/storage';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    if (authStorage.isAuthenticated()) {
      if (authStorage.isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    }
  }, [navigate]);

  return <AuthForm />;
};

export default Index;
