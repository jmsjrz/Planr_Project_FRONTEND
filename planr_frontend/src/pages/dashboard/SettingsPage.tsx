import MainContent from "@/components/layout/MainContent";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

const evaluatePasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length > 7) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

export default function SettingsPage() {
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    newsletter: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordStrength(evaluatePasswordStrength(value));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNotificationChange = (type: "email" | "newsletter") => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    // Implement form submission logic here
  };
  return (
    <MainContent>
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Paramètres du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">
                Informations personnelles
              </TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button type="submit">Enregistrer les modifications</Button>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <form onSubmit={handleSubmit} className="space-y-4">
                {["current", "new", "confirm"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={`${field}-password`}>
                      {field === "current"
                        ? "Mot de passe actuel"
                        : field === "new"
                        ? "Nouveau mot de passe"
                        : "Confirmer le nouveau mot de passe"}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${field}-password`}
                        type={
                          showPasswords[field as keyof typeof showPasswords]
                            ? "text"
                            : "password"
                        }
                        value={
                          field === "current"
                            ? currentPassword
                            : field === "new"
                            ? newPassword
                            : confirmPassword
                        }
                        onChange={(e) => {
                          if (field === "current")
                            setCurrentPassword(e.target.value);
                          else if (field === "new") handlePasswordChange(e);
                          else setConfirmPassword(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility(
                            field as "current" | "new" | "confirm"
                          )
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords[field as keyof typeof showPasswords] ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="h-2 w-full bg-gray-200 rounded">
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
                  />
                </div>
                <Button type="submit">Changer le mot de passe</Button>
              </form>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-4">
                {["email", "newsletter"].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`${type}-notifications`}>
                        {type === "email"
                          ? "Notifications par e-mail"
                          : "Newsletter"}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {type === "email"
                          ? "Recevoir des notifications par e-mail"
                          : "S'abonner à notre newsletter"}
                      </p>
                    </div>
                    <Switch
                      id={`${type}-notifications`}
                      checked={
                        notifications[type as keyof typeof notifications]
                      }
                      onCheckedChange={() =>
                        handleNotificationChange(type as "email" | "newsletter")
                      }
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainContent>
  );
}
