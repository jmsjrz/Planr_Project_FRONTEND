import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await requestPasswordReset(email);
      setSuccessMessage("Lien de réinitialisation envoyé avec succès !");
    } catch (error) {
      setErrorMessage(
        "Échec de la demande de réinitialisation. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4">
        <div className="container mx-auto flex h-screen items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
              <p className="text-sm text-muted-foreground">
                Entrez votre adresse e-mail et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
              </p>
            </div>
            {successMessage && (
              <p className="text-green-600 text-center">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Envoi en cours..."
                  : "Envoyer le lien de réinitialisation"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
