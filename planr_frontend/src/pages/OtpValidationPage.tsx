// src/pages/OtpValidationPage.tsx

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Supprimé car non utilisé
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { resendOtp } from "@/utils/api"; // Ajouté pour importer resendOtp

export default function OtpValidationPage() {
  const [otp, setOtp] = useState<string>(""); // Stockage de l'OTP complet
  const [loading, setLoading] = useState(false);
  const { handleVerifyOtp, errorMessage, setErrorMessage } = useAuth(); // Utiliser handleVerifyOtp
  const [timeLeft, setTimeLeft] = useState(900); // Temps restant (15 minutes = 900 secondes)
  const [canResend, setCanResend] = useState(false); // Statut du bouton de renvoi d'OTP
  // const navigate = useNavigate(); // Supprimé car non utilisé

  // Fonction pour capturer chaque chiffre saisi dans l'OTP
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  // Timer de 15 minutes pour demander un nouvel OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Réduit d'une seconde chaque seconde
      return () => clearInterval(timer); // Nettoyage à la fin du composant
    } else {
      setCanResend(true); // Active le bouton de renvoi une fois le temps écoulé
    }
  }, [timeLeft]);

  // Fonction pour renvoyer un OTP une fois le temps écoulé
  const handleResendOtp = async () => {
    try {
      const guestToken = localStorage.getItem("guestToken");
      if (!guestToken) {
        throw new Error("Token invité non trouvé");
      }

      // Appel de l'API pour renvoyer un OTP
      await resendOtp(guestToken);
      setTimeLeft(900); // Réinitialise le timer après renvoi d'OTP
      setCanResend(false); // Désactive à nouveau le bouton de renvoi
    } catch (error) {
      console.error("Erreur lors du renvoi de l'OTP :", error);
      setErrorMessage("Échec du renvoi de l'OTP. Veuillez réessayer.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const guestToken = localStorage.getItem("guestToken");
      if (!guestToken) {
        throw new Error("Token invité non trouvé");
      }

      // Appel de handleVerifyOtp depuis le contexte
      await handleVerifyOtp(otp, guestToken);
      // La mise à jour de l'état utilisateur et la navigation sont gérées dans handleVerifyOtp
    } catch (error: any) {
      // On s'assure d'afficher le bon message d'erreur provenant de l'API
      const apiErrorMessage =
        error.message ||
        "Erreur lors de la vérification de l'OTP. Veuillez réessayer.";
      console.error(
        "Erreur lors de la vérification de l'OTP :",
        apiErrorMessage
      );
      setErrorMessage(apiErrorMessage); // Utilise l'erreur précise renvoyée par l'API
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater le temps en minutes et secondes
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Vérification OTP</h1>
      <p className="text-center text-muted-foreground">
        Entrez le code OTP envoyé à votre adresse e-mail ou numéro de téléphone.
      </p>
      {errorMessage && (
        <p className="text-red-600 text-center">{errorMessage}</p>
      )}

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        {/* Utilisation du composant OTP */}
        <InputOTP maxLength={6} onChange={handleOtpChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Validation en cours..." : "Valider"}
        </Button>
      </form>

      {/* Timer de 15 minutes pour le renvoi d'OTP */}
      <div className="mt-4 text-center">
        {canResend ? (
          <Button onClick={handleResendOtp} className="w-full">
            Renvoyer un nouvel OTP
          </Button>
        ) : (
          <p>Vous pouvez renvoyer un OTP dans {formatTime(timeLeft)}</p>
        )}
      </div>
    </div>
  );
}
