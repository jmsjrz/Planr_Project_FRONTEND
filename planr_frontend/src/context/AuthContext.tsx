// src/context/AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";
import { loginUser, registerUser, requestPasswordReset } from "@/utils/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, undefined, password);
      setUser(response.data.user); // Hypothèse : le backend renvoie l'utilisateur
      navigate("/dashboard"); // Redirection après connexion
    } catch (error) {
      console.error("Erreur de connexion", error);
      // Gestion des erreurs ici (par exemple, notification d'échec)
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await registerUser(email, password);
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription", error);
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
