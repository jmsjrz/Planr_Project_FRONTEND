import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/utils/api"; // Fonction d'inscription
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
      // Appel de l'API pour l'inscription
      const response = await registerUser(email, password);

      // Vérifier que la réponse contient bien les données attendues (guest_token, etc.)
      if (response && response.guest_token) {
        // Stocker le guest_token pour la vérification OTP
        localStorage.setItem("guest_token", response.guest_token);

        // Rediriger vers la page de validation OTP
        navigate("/verify-otp");
      } else {
        throw new Error("Réponse inattendue du serveur.");
      }
    } catch (error: any) {
      // Si Axios renvoie une erreur, afficher l'erreur spécifique
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
          {errorMessage && (
            <p className="text-red-600 text-center">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </form>
      </div>
    </div>
  );
}
