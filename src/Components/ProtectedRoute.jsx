import React from "react";
import { Navigate, useLocation } from "react-router-dom"; 
import { useAuthStateContext } from "../utils/Contexts/AuthContext"; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuthStateContext();
  const location = useLocation(); 

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memeriksa autentikasi...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: User tidak terautentikasi, redirecting ke login dari", location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;