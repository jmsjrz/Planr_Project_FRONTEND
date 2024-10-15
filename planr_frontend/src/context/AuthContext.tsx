// src/context/AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  isTokenExpired,
  refreshAccessToken,
} from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Déclaration du type AuthContext
export interface AuthContextType {
  user: any;
  login: (emailOrPhone: string, password?: string) => Promise<void>;
  register: (emailOrPhone: string, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Création du contexte AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur de contexte pour l'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // État utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const navigate = useNavigate();

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        await logoutUser(refreshToken); // Appel de l'API pour blacklister le token de rafraîchissement
      } catch (error) {
        console.error("Erreur lors de la déconnexion", error);
      }
    }

    // Supprimer les tokens du localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null); // Réinitialiser l'état utilisateur
    navigate("/login"); // Redirige vers la page de connexion
  }, [navigate]);

  // Écouteur pour l'événement de déconnexion
  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [logout]);

  // Vérifie si un token est présent au chargement de l'application
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          try {
            await refreshAccessToken();

            const newAccessToken = localStorage.getItem("access_token");
            if (newAccessToken) {
              const userData = parseJwt(newAccessToken);
              setUser(userData);
            } else {
              console.error(
                "Access token non disponible après le rafraîchissement"
              );
              logout();
            }
          } catch (error) {
            console.error("Session expirée, déconnexion");
            logout();
          }
        } else {
          // Token valide, extraire les données utilisateur du token
          const userData = parseJwt(accessToken);
          setUser(userData);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]);

  // Fonction de connexion
  const login = useCallback(
    async (emailOrPhone: string, password?: string) => {
      try {
        const response = await loginUser(emailOrPhone, undefined, password);
        console.log("Réponse de connexion :", response);

        // Vérifier que les tokens sont présents dans la réponse
        if (
          (response.access || response.access_token) &&
          (response.refresh || response.refresh_token)
        ) {
          // Stocker les tokens
          const accessToken = response.access || response.access_token;
          const refreshToken = response.refresh || response.refresh_token;

          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          // Extraire les données utilisateur du token JWT
          const userData = parseJwt(accessToken);
          console.log("Données utilisateur extraites :", userData);
          setUser(userData);

          navigate("/dashboard"); // Redirige vers le dashboard
        } else {
          console.error("Les tokens ne sont pas présents dans la réponse");
        }
      } catch (error) {
        console.error("Erreur de connexion", error);
      }
    },
    [navigate]
  );

  // Fonction d'inscription
  const register = useCallback(
    async (emailOrPhone: string, password?: string) => {
      try {
        await registerUser(emailOrPhone, password);
        navigate("/login"); // Redirige vers la page de connexion
      } catch (error) {
        console.error("Erreur d'inscription", error);
      }
    },
    [navigate]
  );

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fonction pour décoder le token JWT et extraire les données utilisateur
const parseJwt = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Erreur lors du parsing du token JWT", error);
    return null;
  }
};

// Hook pour accéder au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
