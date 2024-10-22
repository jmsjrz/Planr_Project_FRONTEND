// src/pages/RegisterPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Importer useAuth pour accéder au contexte
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
import { Eye, EyeOff } from "lucide-react"; // Icônes pour afficher/masquer le mot de passe

// Fonction pour évaluer la force du mot de passe
const evaluatePasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length > 7) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength;
};

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // État pour l'affichage du mot de passe
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // État pour l'affichage de la confirmation du mot de passe
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // État pour la force du mot de passe
  const { register, errorMessage, setErrorMessage, loading } = useAuth(); // Utiliser register depuis useAuth

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value)); // Mettre à jour la force du mot de passe
  };

  const handleRegisterEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register(email, password); // Utiliser register depuis le contexte
    } catch (error: any) {
      const errorMessage =
        error.message || "Échec de l'inscription. Veuillez réessayer.";
      console.error("Erreur d'inscription par email :", errorMessage);
      setErrorMessage(errorMessage); // On affiche l'erreur précise
    }
  };

  const handleRegisterPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await register(phoneNumber); // Utiliser register depuis le contexte
    } catch (error: any) {
      const errorMessage =
        error.message || "Échec de l'inscription. Veuillez réessayer.";
      console.error("Erreur d'inscription par téléphone :", errorMessage);
      setErrorMessage(errorMessage); // On affiche l'erreur précise
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
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange} // Appel pour calculer la force
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {/* Barre de force du mot de passe */}
                    <div className="h-2 mt-2 w-full bg-gray-200 rounded">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          passwordStrength === 1
                            ? "bg-red-500 w-1/4"
                            : passwordStrength === 2
                            ? "bg-yellow-500 w-1/2"
                            : passwordStrength === 3
                            ? "bg-green-500 w-3/4"
                            : passwordStrength >= 4
                            ? "bg-green-700 w-full"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        aria-label={
                          showConfirmPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
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
