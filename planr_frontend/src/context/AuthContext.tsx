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
  setAuthenticatedUser: () => void; // Nouvelle fonction pour mettre à jour l'utilisateur
  loading: boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Création du contexte AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur de contexte pour l'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null); // État utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const [errorMessage, setErrorMessage] = useState<string>(""); // Message d'erreur
  const navigate = useNavigate();

  // Fonction pour mettre à jour l'état utilisateur après la vérification de l'OTP
  const setAuthenticatedUser = useCallback(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const userData = parseJwt(accessToken);
      setUser(userData);
    }
  }, []);

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
    localStorage.removeItem("guest_token");

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

        if (
          (response.access || response.access_token) &&
          (response.refresh || response.refresh_token)
        ) {
          // L'utilisateur est authentifié
          const accessToken = response.access || response.access_token;
          const refreshToken = response.refresh || response.refresh_token;

          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          const userData = parseJwt(accessToken);
          console.log("Données utilisateur extraites :", userData);
          setUser(userData);

          navigate("/dashboard"); // Redirige vers le tableau de bord
        } else if (response.guest_token) {
          // L'utilisateur doit vérifier son OTP
          localStorage.setItem("guest_token", response.guest_token);

          navigate("/verify-otp"); // Redirige vers la page de vérification OTP
        } else {
          console.error("Les tokens ne sont pas présents dans la réponse");
          setErrorMessage(
            "Échec de la connexion. Veuillez vérifier vos informations."
          );
        }
      } catch (error) {
        console.error("Erreur de connexion", error);
        setErrorMessage("Erreur lors de la connexion. Veuillez réessayer.");
      }
    },
    [navigate]
  );

  // Fonction d'inscription (inchangée)
  const register = useCallback(
    async (emailOrPhone: string, password?: string) => {
      try {
        const response = await registerUser(emailOrPhone, password);

        if (response.guest_token) {
          localStorage.setItem("guest_token", response.guest_token);
          navigate("/verify-otp"); // Redirige vers la page de vérification OTP
        } else {
          console.error("Échec de l'inscription, guest_token non reçu");
          setErrorMessage(
            "Échec de l'inscription. Veuillez vérifier vos informations."
          );
        }
      } catch (error) {
        console.error("Erreur d'inscription", error);
        setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    },
    [navigate]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        setAuthenticatedUser, // On ajoute la fonction au contexte
        loading,
        errorMessage,
        setErrorMessage,
      }}
    >
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
