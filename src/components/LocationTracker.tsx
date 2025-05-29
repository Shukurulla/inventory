// App.tsx yoki Layout.tsx ichida (React Router bilan ishlayotgan joyda)

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const LocationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/login') {
      localStorage.setItem('last_path', location.pathname);
    };
  }, [location]);

  return null;
};


export default LocationTracker;