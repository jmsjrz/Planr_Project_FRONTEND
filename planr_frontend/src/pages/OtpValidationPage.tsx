import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OtpValidationPage() {
  const [otp, setOtp] = useState<string>(""); // OTP saisi par l'utilisateur
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Récupérer le guest_token depuis localStorage (stocké lors de l'inscription)
  const guestToken = localStorage.getItem("guest_token");

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Appel de l'API pour vérifier l'OTP
      const response = await verifyOtp(otp, guestToken!); // Assure-toi que guestToken est bien récupéré

      // Stocker les tokens JWT renvoyés par l'API
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      // Redirection vers la page protégée (ex. tableau de bord)
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("OTP invalide ou expiré, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Vérification OTP</h1>
        <p className="text-center text-muted-foreground">
          Entrez le code OTP envoyé à votre adresse e-mail pour vérifier votre
          compte.
        </p>
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Code OTP</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Entrez votre OTP"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-600 text-center">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Validation en cours..." : "Valider"}
          </Button>
        </form>
      </div>
    </div>
  );
}
