import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, checkExistingRegistration } from "@/utils/api"; // Fonction d'inscription et vérification OTP
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      // Vérifie si l'utilisateur est déjà en attente de validation OTP
      const existingRegistration = await checkExistingRegistration(email);
      if (existingRegistration && existingRegistration.guest_token) {
        // Si un guest_token existe pour cet email, rediriger vers la page OTP
        localStorage.setItem("guest_token", existingRegistration.guest_token);
        localStorage.setItem("registered_email", email);
        navigate("/verify-otp");
        return;
      }

      // Si l'utilisateur n'a pas d'OTP en attente, procéder à l'inscription
      const response = await registerUser(email, password);
      if (response && response.guest_token) {
        // Stocker le guest_token et rediriger vers la page OTP
        localStorage.setItem("guest_token", response.guest_token);
        localStorage.setItem("registered_email", email);
        navigate("/verify-otp");
      } else {
        throw new Error("Réponse inattendue du serveur.");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Échec de l'inscription. Veuillez réessayer.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
        {errorMessage && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>
      </div>
    </div>
  );
}
