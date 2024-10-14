// /utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

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

// Fonction d'inscription (via email)
export const registerUser = async (email: string, password: string) => {
  const data = { email, password };

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
  return response.data;  // Renvoie les données du serveur (JWT tokens)
};

// Fonction pour authentifier un utilisateur
export const loginUser = async (email?: string, phoneNumber?: string, password?: string) => {
  const data = { email, phone_number: phoneNumber, password };

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
