import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location and state
    // so we can bounce them back to the exact checkout process
    // once they finish logging in.
    return <Navigate to="/login" state={{ from: location.pathname, routeState: location.state }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
