// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) {
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
