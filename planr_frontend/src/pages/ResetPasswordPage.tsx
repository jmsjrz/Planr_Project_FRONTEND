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

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setErrorMessage("Échec de la réinitialisation. Veuillez réessayer.");
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
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Votre nouveau mot de passe"
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
                      placeholder="Confirmez votre mot de passe"
                      required
                    />
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
