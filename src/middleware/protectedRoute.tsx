import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  component: React.FC<any>;
}

const ProtectedRoute: React.FC<Props> = ({ component: Component }) => {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <Component />;
};

export default ProtectedRoute;
