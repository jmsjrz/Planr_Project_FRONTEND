// /utils/api.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

// Intercepteur pour gérer les erreurs venant de l'API
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur interceptée dans Axios :", error);

    if (axios.isAxiosError(error) && error.response) {
      // Récupérer le message d'erreur spécifique renvoyé par l'API
      let apiErrorMessage = "Une erreur est survenue.";

      if (error.response.data?.error) {
        apiErrorMessage = error.response.data.error;  // Message d'erreur standard
      } else if (typeof error.response.data === "string") {
        apiErrorMessage = error.response.data;  // Si l'erreur est directement une string
      } else if (error.response.data?.detail) {
        apiErrorMessage = error.response.data.detail;  // Message sous la clé "detail"
      } else if (error.response.data?.message) {
        apiErrorMessage = error.response.data.message;  // Message sous la clé "message"
      }

      return Promise.reject(new Error(apiErrorMessage));
    } else {
      return Promise.reject(new Error("Erreur réseau ou serveur. Veuillez réessayer."));
    }
  }
);



// Fonction utilitaire pour vérifier si le token JWT a expiré
export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    console.error("Token indéfini ou vide");
    return true; // Considérer le token comme expiré s'il est invalide
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes
    return decodedToken.exp < now;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return true; // Considérer le token comme expiré s'il ne peut pas être décodé
  }
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
  console.log("Réponse de connexion :", response.data);
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
    console.log("Réponse du rafraîchissement du token :", response.data);

    // Stocke le nouveau access token et le nouveau refresh token (si rotation activée)
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
    } else if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    } else {
      throw new Error("Access token non trouvé dans la réponse du rafraîchissement");
    }

    // Si le backend retourne un nouveau refresh token (rotation activée), le stocker
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
    } else if (response.data.refresh_token) {
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }

    return response.data.access || response.data.access_token;
  } catch (error) {
    console.error("Échec du rafraîchissement du token:", error);
    throw new Error("Failed to refresh token");
  }
};

// Exportez axios si vous en avez besoin ailleurs
export default axios;
