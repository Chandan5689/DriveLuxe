import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContextValue'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
  const {authToken} = useContext(AuthContext);
  return authToken ? children : <Navigate to="/login" />;
}

