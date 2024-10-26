// src/utils/api.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://127.0.0.1:8000";

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

// Création d'une instance Axios personnalisée
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Nouvelle instance Axios sans intercepteurs pour le rafraîchissement du token
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur Axios pour les requêtes
api.interceptors.request.use(
  async (config) => {
    if (config.url === "/token/refresh/") {
      return config;
    }

    // Vérifier si l'en-tête Authorization est déjà défini
    if (config.headers && config.headers.Authorization) {
      // Ne pas écraser l'en-tête Authorization existant
      return config;
    }

    let accessToken = getAccessToken();

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        await refreshAccessToken();
        accessToken = getAccessToken();
      } catch (error) {
        clearTokens();
        return Promise.reject(error);
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur Axios pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      let apiErrorMessage = "Une erreur est survenue.";

      if (error.response.data?.error) {
        apiErrorMessage = error.response.data.error;
      } else if (typeof error.response.data === "string") {
        apiErrorMessage = error.response.data;
      } else if (error.response.data?.detail) {
        apiErrorMessage = error.response.data.detail;
      } else if (error.response.data?.message) {
        apiErrorMessage = error.response.data.message;
      }

      return Promise.reject(new Error(apiErrorMessage));
    } else {
      return Promise.reject(
        new Error("Erreur réseau ou serveur. Veuillez réessayer.")
      );
    }
  }
);

// Fonction pour vérifier si le token JWT a expiré
export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp < now;
  } catch {
    return true;
  }
};

// Fonction pour rafraîchir l'access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Aucun token de rafraîchissement disponible");
  }

  try {
    // Utiliser 'refreshApi' au lieu de 'api'
    const response = await refreshApi.post(`/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access || response.data.accessToken;
    const newRefreshToken = response.data.refresh || response.data.refreshToken;

    if (newAccessToken) {
      setAccessToken(newAccessToken);
    } else {
      throw new Error("Access token non trouvé dans la réponse du rafraîchissement");
    }

    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    return newAccessToken;
  } catch (error) {
    throw new Error("Échec du rafraîchissement du token");
  }
};

// Fonctions API pour les actions utilisateur
export const registerUser = async (emailOrPhone: string, password?: string) => {
  const data: { email?: string; phoneNumber?: string; password?: string } = {};

  if (emailOrPhone.includes("@")) {
    data.email = emailOrPhone;
    if (password) data.password = password;
  } else {
    data.phoneNumber = emailOrPhone;
  }

  const response = await api.post(`/users/register/`, data);
  return response.data;
};

export const verifyOtp = async (otp: string, guestToken: string) => {
  const response = await api.post(
    `/users/verify-otp/`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${guestToken}`,
      },
    }
  );
  return response.data;
};

export const loginUser = async (
  emailOrPhone?: string,
  phoneNumber?: string,
  password?: string
) => {
  const data: { email?: string; phoneNumber?: string; password?: string } = {};

  if (emailOrPhone) {
    if (emailOrPhone.includes("@")) {
      data.email = emailOrPhone;
    } else {
      data.phoneNumber = emailOrPhone;
    }
  }

  if (phoneNumber) data.phoneNumber = phoneNumber;
  if (password) data.password = password;

  const response = await api.post(`/users/login/`, data);
  return response.data;
};

export const resendOtp = async (guestToken: string) => {
  const response = await api.post(
    `/users/resend-otp/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${guestToken}`,
      },
    }
  );
  return response.data;
};

export const logoutUser = async (refreshToken: string) => {
  const response = await api.post(`/users/logout/`, {
    refreshToken: refreshToken,
  });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post(`/users/request-password-reset/`, { email });
  return response.data;
};

export const getPrivateEvents = async () => {
  const response = await api.get(`/private-events/`);
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post(`/users/reset-password/${token}/`, {
    new_password: newPassword,
  });
  return response.data;
};

export const checkProfileCompletion = async () => {
  const response = await api.get("users/profile/completion/");
  return response.data;
};

export const fetchInterests = async () => {
  const response = await api.get("users/interests/");
  return response.data;
};

export const saveProfile = async (formData: FormData) => {
  const response = await api.put("users/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createPrivateEvent = async (formData: FormData) => {
  const response = await api.post("/private-events/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Exporter l'instance 'api' configurée
export default api;
