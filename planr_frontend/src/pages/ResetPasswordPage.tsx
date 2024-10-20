import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false); // État pour afficher/masquer le nouveau mot de passe
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false); // État pour afficher/masquer la confirmation du mot de passe
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // État pour la force du mot de passe
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value)); // Mettre à jour la force du mot de passe
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token!, newPassword);
      setSuccessMessage("Mot de passe réinitialisé avec succès.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      const apiErrorMessage =
        error.message || "Une erreur est survenue, veuillez réessayer.";
      setErrorMessage(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">
          Réinitialiser le mot de passe
        </h1>
        <Tabs defaultValue="password-reset" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="password-reset">Réinitialisation</TabsTrigger>
          </TabsList>
          <TabsContent value="password-reset">
            <Card>
              <CardHeader>
                <CardTitle>Réinitialiser votre mot de passe</CardTitle>
                <CardDescription>
                  Entrez et confirmez votre nouveau mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-600 text-center">{successMessage}</p>
                )}
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-1">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={handlePasswordChange} // Appel pour calculer la force
                        placeholder="Votre nouveau mot de passe"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        aria-label={
                          showNewPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showNewPassword ? (
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
                        placeholder="Confirmez votre mot de passe"
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
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span className="spinner-border spinner-border-sm" />
                        <span>Réinitialisation...</span>
                      </span>
                    ) : (
                      "Réinitialiser le mot de passe"
                    )}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline"
                  >
                    Se connecter
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
