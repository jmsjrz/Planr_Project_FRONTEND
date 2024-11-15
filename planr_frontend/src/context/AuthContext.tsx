// src/context/AuthContext.tsx
import React, {
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
  verifyOtp,
  checkProfileCompletion,
  getUserProfile,
} from "@/utils/api";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user: any;
  isProfileComplete: boolean | null;
  setIsProfileComplete: React.Dispatch<React.SetStateAction<boolean | null>>;
  login: (emailOrPhone: string, password?: string) => Promise<void>;
  register: (emailOrPhone: string, password?: string) => Promise<void>;
  handleVerifyOtp: (otp: string, guestToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Fonctions pour gérer les tokens
const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("guestToken");
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  // Initialisation de l'authentification au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();

      if (accessToken && !isTokenExpired(accessToken)) {
        // Récupérer des informations utilisateur complètes via l'API
        try {
          const userData = await getUserProfile(); // Appel API pour des infos complètes
          setUser(userData); // Met à jour avec les infos complètes du profil
        } catch (error) {
          setIsProfileComplete(false);
        }

        setLoading(false);
      } else {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            await refreshAccessToken(); // Rafraîchissement du token

            const userData = await getUserProfile(); // Infos complètes via l'API après rafraîchissement du token
            setUser(userData);

            setLoading(false);
          } catch (error) {
            clearTokens();
            setUser(null);
            setIsProfileComplete(false);
            setLoading(false);
          }
        } else {
          // Pas de tokens, déconnecter l'utilisateur
          clearTokens();
          setUser(null);
          setIsProfileComplete(false);
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = useCallback(
    async (emailOrPhone: string, password?: string) => {
      setLoading(true);
      try {
        const response = await loginUser(emailOrPhone, undefined, password);

        if (
          (response.access || response.accessToken) &&
          (response.refresh || response.refreshToken)
        ) {
          const accessToken = response.access || response.accessToken;
          const refreshToken = response.refresh || response.refreshToken;

          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // Récupérer le profil utilisateur complet depuis l'API
          const userData = await getUserProfile();
          setUser(userData);

          const { isProfileComplete } = await checkProfileCompletion();
          setIsProfileComplete(isProfileComplete);

          navigate("/dashboard");
        } else if (response.guestToken) {
          localStorage.setItem("guestToken", response.guestToken);
          navigate("/verify-otp");
        } else {
          setErrorMessage(
            "Échec de la connexion. Veuillez vérifier vos informations."
          );
        }
      } catch (error: any) {
        setErrorMessage(
          error.message || "Erreur lors de la connexion. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Fonction d'inscription
  const register = useCallback(
    async (emailOrPhone: string, password?: string) => {
      setLoading(true);
      try {
        const response = await registerUser(emailOrPhone, password);

        if (response.guestToken) {
          localStorage.setItem("guestToken", response.guestToken);
          navigate("/verify-otp");
        } else {
          setErrorMessage(
            "Échec de l'inscription. Veuillez vérifier vos informations."
          );
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.error ||
            "Erreur lors de l'inscription. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Fonction de vérification OTP
  const handleVerifyOtp = useCallback(
    async (otp: string, guestToken: string) => {
      setLoading(true);
      try {
        const response = await verifyOtp(otp, guestToken);

        if (
          (response.access || response.accessToken) &&
          (response.refresh || response.refreshToken)
        ) {
          const accessToken = response.access || response.accessToken;
          const refreshToken = response.refresh || response.refreshToken;

          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // Récupérer le profil utilisateur complet depuis l'API
          const userData = await getUserProfile();
          setUser(userData);

          const { isProfileComplete } = await checkProfileCompletion();
          setIsProfileComplete(isProfileComplete);

          navigate("/dashboard");
        } else {
          setErrorMessage("Échec de la vérification OTP.");
        }
      } catch (error: any) {
        setErrorMessage(error.message || "Erreur lors de la vérification OTP.");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch {}
    }

    clearTokens();
    setUser(null);
    setIsProfileComplete(false);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isProfileComplete,
        setIsProfileComplete,
        login,
        register,
        handleVerifyOtp,
        logout,
        loading,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
