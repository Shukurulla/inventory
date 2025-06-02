// src/Routes/ProtectedRoute.ts - Fixed version
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/Hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if auth state is clearly determined
    if (isAuth === false) {
      // Save current path before redirecting to login
      localStorage.setItem("last_path", location.pathname);
      navigate("/login", { replace: true });
      return;
    }

    // If user is authenticated and on login page, redirect to saved path or home
    if (isAuth === true && location.pathname === "/login") {
      const savedPath = localStorage.getItem("last_path");
      const redirectPath =
        savedPath && savedPath !== "/login" ? savedPath : "/";
      localStorage.removeItem("last_path"); // Clean up
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [isAuth, navigate, location.pathname]);

  // Don't render anything while auth state is loading
  if (isAuth === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
