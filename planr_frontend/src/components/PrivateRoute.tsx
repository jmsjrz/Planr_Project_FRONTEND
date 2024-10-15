// src/components/PrivateRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth(); // Récupère l'utilisateur et l'état de chargement

  if (loading) {
    return <div>Chargement...</div>; // Affiche un indicateur de chargement pendant la vérification
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirige vers login si l'utilisateur n'est pas authentifié
  }

  return children; // Si l'utilisateur est authentifié, affiche la page protégée
};

export default PrivateRoute;
