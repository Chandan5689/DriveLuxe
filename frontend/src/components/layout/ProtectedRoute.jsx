import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContextValue'
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({children}) {
  const location = useLocation();
  const { isAuthLoaded, isAuthenticated } = useContext(AuthContext);

  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-sm text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

