// /utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Intercepteur Axios
axios.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("access_token");

    // Si l'access token est expiré, tente de le renouveler
    if (accessToken && isTokenExpired(accessToken)) {
      try {
        await refreshAccessToken();
        // Mettre à jour l'accessToken avec le nouveau token
        accessToken = localStorage.getItem("access_token");
      } catch (error) {
        console.error("Session expirée, déconnexion de l'utilisateur");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.dispatchEvent(new Event("logout")); // Émet un événement 'logout'
        return Promise.reject(error);
      }
    }

    // Si l'access token est valide, le mettre dans les headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour vérifier si le token JWT a expiré
export const isTokenExpired = (token: string): boolean => {
  const tokenParts = token.split("."); // JWT est composé de trois parties : header, payload, signature
  const payload = JSON.parse(atob(tokenParts[1])); // On décode le payload

  const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
  return payload.exp < now; // Si la date d'expiration est passée
};

// Fonction pour vérifier si un email est déjà enregistré et en attente de validation OTP
export const checkExistingRegistration = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/check_registration/`, { email });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email", error);
    return null;
  }
};

// Fonction d'inscription qui accepte soit l'email et mot de passe, soit le numéro de téléphone
export const registerUser = async (emailOrPhone: string, password?: string) => {
  const data: { email?: string; phone_number?: string; password?: string } = {};

  if (emailOrPhone.includes("@")) {
    // C'est un email
    data.email = emailOrPhone;
    if (password) {
      data.password = password;
    }
  } else {
    // C'est un numéro de téléphone
    data.phone_number = emailOrPhone;
  }

  // Envoie la requête d'inscription avec les données
  const response = await axios.post(`${API_BASE_URL}/users/register/`, data);
  return response.data;
};

// Fonction pour vérifier l'OTP
export const verifyOtp = async (otp: string, guestToken: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/verify-otp/`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${guestToken}`,
      },
    }
  );
  return response.data; // Renvoie les données du serveur (JWT tokens)
};

// Fonction de connexion (via email et mot de passe ou téléphone)
export const loginUser = async (
  emailOrPhone?: string,
  phoneNumber?: string,
  password?: string
) => {
  const data: { email?: string; phone_number?: string; password?: string } = {};

  if (emailOrPhone) {
    if (emailOrPhone.includes("@")) {
      data.email = emailOrPhone;
    } else {
      data.phone_number = emailOrPhone;
    }
  }

  if (phoneNumber) {
    data.phone_number = phoneNumber;
  }

  if (password) {
    data.password = password;
  }

  const response = await axios.post(`${API_BASE_URL}/users/login/`, data);
  return response.data;
};

// Fonction pour renvoyer un OTP
export const resendOtp = async (guestToken: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/resend-otp/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${guestToken}`,
      },
    }
  );
  return response.data;
};

// Fonction de déconnexion
export const logoutUser = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL}/users/logout/`, {
    refresh_token: refreshToken,
  });
  return response.data;
};

// Fonction pour demander une réinitialisation de mot de passe
export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/users/request-password-reset/`, { email });
  return response.data;
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${API_BASE_URL}/users/reset-password/${token}/`, {
    new_password: newPassword,
  });
  return response.data;
};

// Fonction pour rafraîchir l'access token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    // Stocke le nouveau access token et le nouveau refresh token (si rotation activée)
    localStorage.setItem("access_token", response.data.access);

    // Si le backend retourne un nouveau refresh token (rotation activée), le stocker
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data.access;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};

// Exportez axios si vous en avez besoin ailleurs
export default axios;
