import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // If no user is logged in, redirect to login
  if (!user) return <Navigate to="/" />;

  // If a role is specified but doesn't match the user's role, redirect to dashboard
  if (role && user.role !== role) return <Navigate to="/dashboard" />;

  // Otherwise, render the child component
  return children;
};

export default ProtectedRoute;
