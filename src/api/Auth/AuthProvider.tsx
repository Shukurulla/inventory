import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '@/lib/isTokenExpired';
import { useRefreshTokenMutation } from '../loginWithApi';
import { AuthContext, type AuthContextType } from '@/Context/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthContextType>({ isAuth: false, accessToken: null });
  const [refreshToken] = useRefreshTokenMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem('accessToken') || '';
      const refresh = localStorage.getItem('refreshToken');

      try {
        if (accessToken && !isTokenExpired(accessToken)) {
          setAuthState({ isAuth: true, accessToken });
        } else if (refresh && isTokenExpired(accessToken)) {
          const response = await refreshToken({ refresh }).unwrap();
          localStorage.setItem('accessToken', response?.access);
          setAuthState({ isAuth: true, accessToken: response?.access });
        } else {
          logoutAndRedirect();
        }

        const lastPath = localStorage.getItem('last_path');
        if (lastPath) {
          navigate('/', { replace: true });
        } else {
          const role = localStorage.getItem('role');
          if (role === 'admin') navigate('/', { replace: true });
          else if (role === 'user') navigate('/', { replace: true });
        }
      } catch (error) {
        console.log("Token refresh error:", error);
        logoutAndRedirect();
      } finally {
        setLoading(false);
      }
    };

    const logoutAndRedirect = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.active_nav="Главная страница"
      setAuthState({ isAuth: false, accessToken: null });
      navigate('/login', { replace: true });
    };

    checkAndRefreshToken();
  }, [refreshToken]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
