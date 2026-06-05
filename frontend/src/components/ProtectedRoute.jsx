import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(DataContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/workspace" replace />;
  }
  return children;
}
