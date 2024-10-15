// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Importer useAuth pour accéder au contexte
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { login, errorMessage, setErrorMessage } = useAuth(); // Récupérer la fonction login et errorMessage du contexte

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(email, password); // Utiliser la fonction login du contexte
      // La redirection est gérée dans le contexte
    } catch (error: any) {
      console.error("Erreur lors de la connexion par email :", error);
      setErrorMessage("Échec de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await login(phoneNumber); // Utiliser la fonction login du contexte
      // La redirection est gérée dans le contexte
    } catch (error: any) {
      console.error("Erreur lors de la connexion par téléphone :", error);
      setErrorMessage("Échec de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Se connecter</h1>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Téléphone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Connexion par Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                <form onSubmit={handleLoginEmail} className="space-y-6">
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </form>
                <div className="flex justify-between mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-primary hover:underline"
                  >
                    Créer un compte
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phone">
            <Card>
              <CardHeader>
                <CardTitle>Connexion par Téléphone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorMessage && (
                  <p className="text-red-600 text-center">{errorMessage}</p>
                )}
                <form onSubmit={handleLoginPhone} className="space-y-6">
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
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <Link
                    to="/register"
                    className="text-sm text-primary hover:underline"
                  >
                    Créer un compte
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
