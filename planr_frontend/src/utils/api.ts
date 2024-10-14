// /utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Fonction d'inscription (via email ou téléphone)
export const registerUser = async (email: string, password: string) => {
  const data: { email?: string; password?: string } = {};

  // Ajouter les valeurs uniquement si elles existent
  if (email) {
    data.email = email;
  }
  if (password) {
    data.password = password;
  }

  // Envoyer la requête avec les données valides
  const response = await axios.post(`${API_BASE_URL}/users/register/`, data);
  return response.data;
};

// Fonction pour vérifier l'OTP
export const verifyOtp = async (otp: string, guestToken: string) => {
  // Le body contient l'OTP en tant que simple chaîne de caractères
  const response = await axios.post(
    `${API_BASE_URL}/users/verify-otp/`,
    { otp },  // Le body ne contient que l'OTP fourni par l'utilisateur
    {
      headers: {
        Authorization: `Bearer ${guestToken}`,  // guestToken utilisé dans l'en-tête
      },
    }
  );
  return response.data;  // Renvoie les données du serveur (JWT tokens)
};

// Fonction pour authentifier un utilisateur (email/numéro de téléphone + mot de passe ou OTP)
export const loginUser = async (email?: string, phoneNumber?: string, password?: string) => {
  const data = {
    email: email || undefined,
    phone_number: phoneNumber || undefined,
    password: password || undefined,
  };

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
