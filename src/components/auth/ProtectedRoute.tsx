import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-liquid">
          <div className="w-16 h-16 border-4 border-electric-blue rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  // if (!user) {
  //   return <Navigate to="/auth" state={{ from: location }} replace />;
  // }

  return <>{children}</> as React.ReactElement;
};

export default ProtectedRoute;
