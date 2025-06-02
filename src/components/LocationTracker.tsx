// src/components/LocationTracker.tsx - Fixed version
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const LocationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only save valid paths, not login page
    const validPaths = [
      "/",
      "/contracts",
      "/characteristics",
      "/addeds",
      "/settings",
    ];

    if (
      location.pathname !== "/login" &&
      validPaths.includes(location.pathname)
    ) {
      localStorage.setItem("last_path", location.pathname);
    }
  }, [location]);

  return null;
};

export default LocationTracker;
