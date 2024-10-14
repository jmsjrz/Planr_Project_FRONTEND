import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importation de useNavigate
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useAuth(); // Récupération de la fonction login depuis le contexte
  const navigate = useNavigate(); // Initialisation du hook navigate pour la redirection

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(email, password); // Appel de la fonction de connexion
      // Si la connexion est réussie, redirection vers le tableau de bord
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Échec de la connexion. Vérifiez vos identifiants.");
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
              <h1 className="text-2xl font-bold">
                Connectez-vous à votre compte
              </h1>
              <p className="text-sm text-muted-foreground">
                Entrez vos identifiants ci-dessous
              </p>
            </div>
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
