// src/pages/dashboard/CreateProfilePage.tsx

import MainContent from "@/components/layout/MainContent";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchInterests, saveProfile } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

// Type for interest options
interface InterestOption {
  id: string;
  name: string;
}

export default function CreateProfilePage() {
  const [firstName, setFirstName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestOptions, setInterestOptions] = useState<InterestOption[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { setIsProfileComplete } = useAuth();

  // Load interests on component mount
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const data = await fetchInterests();
        setInterestOptions(data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des centres d'intérêts",
          error
        );
      }
    };
    loadInterests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = "Le prénom est requis";
    if (!birthDate) newErrors.birthDate = "La date de naissance est requise";
    if (!gender) newErrors.gender = "Le genre est requis";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append(
        "birth_date",
        birthDate?.toISOString().split("T")[0] || ""
      );
      formData.append("gender", gender);
      formData.append("interests", JSON.stringify(interests));

      try {
        await saveProfile(formData);
        setIsProfileComplete(true); // Mettre à jour le statut de complétion du profil
        navigate("/dashboard"); // Redirige vers le dashboard une fois le profil complété
      } catch (error) {
        console.error("Erreur lors de la création du profil", error);
      }
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <MainContent>
      <h1 className="text-2xl font-bold">Création du Profil</h1>
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Personnalisation du Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">
                Informations Personnelles
              </TabsTrigger>
              <TabsTrigger value="interests">Centres d'intérêt</TabsTrigger>
            </TabsList>

            {/* Informations personnelles */}
            <TabsContent value="personal">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de Naissance</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? (
                          format(birthDate, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={birthDate || undefined}
                        onSelect={(day: Date | undefined) =>
                          setBirthDate(day || null)
                        }
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Genre</Label>
                  <Select onValueChange={setGender} defaultValue={gender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Sélectionnez votre genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="male">Homme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit">Enregistrer les Informations</Button>
              </form>
            </TabsContent>

            {/* Centres d'intérêt */}
            <TabsContent value="interests">
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest.id}
                    variant={
                      interests.includes(interest.name) ? "default" : "outline"
                    }
                    onClick={() => toggleInterest(interest.name)}
                  >
                    {interest.name}
                  </Badge>
                ))}
              </div>
              <Button type="submit" className="mt-4" onClick={handleSubmit}>
                Enregistrer les Centres d'intérêt
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainContent>
  );
}
