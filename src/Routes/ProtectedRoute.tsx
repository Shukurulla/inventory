// src/Routes/ProtectedRoute.tsx - Improved version
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/Hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigated) return;

    // Only redirect if auth state is clearly determined
    if (isAuth === false) {
      // Save current path before redirecting to login (but not if already on login)
      if (location.pathname !== "/login") {
        localStorage.setItem("last_path", location.pathname);
        setHasNavigated(true);
        navigate("/login", { replace: true });
      }
      return;
    }

    // If user is authenticated and on login page, redirect to saved path or home
    if (isAuth === true && location.pathname === "/login") {
      const savedPath = localStorage.getItem("last_path");
      let redirectPath = "/"; // Default to home

      // Only use saved path if it's not login and exists
      if (savedPath && savedPath !== "/login" && savedPath !== "") {
        redirectPath = savedPath;
        localStorage.removeItem("last_path"); // Clean up after using
      }

      setHasNavigated(true);
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [isAuth, navigate, location.pathname, hasNavigated]);

  // Reset navigation flag when location changes
  useEffect(() => {
    setHasNavigated(false);
  }, [location.pathname]);

  // Don't render anything while auth state is loading
  if (isAuth === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-muted-foreground">
          Проверка авторизации...
        </span>
      </div>
    );
  }

  // Only render children if authenticated and not on login page
  if (isAuth && location.pathname !== "/login") {
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (redirect will happen in useEffect)
  return null;
};

export default ProtectedRoute;
