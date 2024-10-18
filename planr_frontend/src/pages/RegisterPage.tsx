import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Gestion de l'inscription par email
  const handleRegisterEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(email, password); // Appel API pour inscription par email
      if (response.guest_token) {
        localStorage.setItem("guest_token", response.guest_token);
        navigate("/verify-otp");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Échec de l'inscription. Veuillez réessayer.";
      console.error("Erreur d'inscription par email :", errorMessage);
      setErrorMessage(errorMessage); // On affiche l'erreur précise
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'inscription par téléphone
  const handleRegisterPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await registerUser(phoneNumber); // Appel API pour inscription par téléphone
      if (response.guest_token) {
        localStorage.setItem("guest_token", response.guest_token);
        navigate("/verify-otp");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Échec de l'inscription. Veuillez réessayer.";
      console.error("Erreur d'inscription par téléphone :", errorMessage);
      setErrorMessage(errorMessage); // On affiche l'erreur précise
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Téléphone</TabsTrigger>
          </TabsList>

          {/* Inscription par Email */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Inscription par Email</CardTitle>
                <CardDescription>
                  Entrez vos informations pour créer un compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                <form onSubmit={handleRegisterEmail} className="space-y-6">
                  <div className="space-y-1">
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
                  <div className="space-y-1">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? "Inscription en cours..."
                      : "S'inscrire par Email"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline"
                  >
                    Vous avez déjà un compte ? Se connecter
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inscription par Téléphone */}
          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle>Inscription par Téléphone</CardTitle>
                <CardDescription>
                  Entrez votre numéro pour créer un compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                <form onSubmit={handleRegisterPhone} className="space-y-6">
                  <div className="space-y-1">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? "Inscription en cours..."
                      : "S'inscrire par Téléphone"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline"
                  >
                    Vous avez déjà un compte ? Se connecter
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
