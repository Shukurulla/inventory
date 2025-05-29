import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/Hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth !== undefined) {
      if (!isAuth) {
        navigate('/login', { replace: true });
        return;
      }
      
      navigate(`/`, { replace: true });
      return;
    }
  }, [isAuth]);

  return isAuth ? children : null;
};

export default ProtectedRoute;
