// src/api/Auth/AuthProvider.tsx - Fixed version without auto redirect
import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "@/lib/isTokenExpired";
import { useRefreshTokenMutation } from "../loginWithApi";
import { AuthContext, type AuthContextType } from "@/Context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuth: false,
    accessToken: null,
  });
  const [refreshToken] = useRefreshTokenMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken") || "";
      const refresh = localStorage.getItem("refreshToken");

      try {
        if (accessToken && !isTokenExpired(accessToken)) {
          // Token is valid
          setAuthState({ isAuth: true, accessToken });
        } else if (refresh && isTokenExpired(accessToken)) {
          // Try to refresh token
          const response = await refreshToken({ refresh }).unwrap();
          localStorage.setItem("accessToken", response?.access);
          setAuthState({ isAuth: true, accessToken: response?.access });
        } else {
          // No valid tokens
          logoutAndClearTokens();
        }

        // Only handle automatic navigation if user is on login page and authenticated
        if (authState.isAuth && location.pathname === "/login") {
          const lastPath = localStorage.getItem("last_path");
          if (lastPath && lastPath !== "/login") {
            localStorage.removeItem("last_path");
            navigate(lastPath, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        console.log("Token refresh error:", error);
        logoutAndClearTokens();
      } finally {
        setLoading(false);
      }
    };

    const logoutAndClearTokens = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.setItem("active_nav", "Главная страница");
      setAuthState({ isAuth: false, accessToken: null });

      // Only redirect to login if not already there
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    };

    checkAndRefreshToken();
  }, [refreshToken, location.pathname]); // Removed navigate from dependencies to prevent loops

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-muted-foreground">Загрузка...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
