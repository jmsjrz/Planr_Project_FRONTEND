import MainContent from "@/components/layout/MainContent";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { fetchInterests, saveProfile } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, XCircleIcon, Upload, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDropzone } from "react-dropzone";
import ReactCrop, { Crop } from "react-image-crop";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "react-image-crop/dist/ReactCrop.css";
import { Interest } from "@/models/Interest";

export default function CreateProfilePage() {
  const [firstName, setFirstName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [Interest, setInterest] = useState<Interest[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const navigate = useNavigate();
  const { setIsProfileComplete } = useAuth();

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const data = await fetchInterests();
        setInterest(data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des centres d'intérêts",
          error
        );
      }
    };
    loadInterests();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
  });

  const onImageLoaded = (image: HTMLImageElement) => {
    setImageRef(image);
  };

  const onCropComplete = async () => {
    if (crop.width && crop.height && imageRef) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const croppedBase64Image = canvas.toDataURL("image/jpeg");
        setCroppedImage(croppedBase64Image);
      }
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setCroppedImage(null);
    setCrop({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = "Le prénom est requis";
    if (!birthDate) newErrors.birthDate = "La date de naissance est requise";
    if (birthDate) {
      const parsedDate = parse(birthDate, "dd/MM/yyyy", new Date());
      if (!isValid(parsedDate)) {
        newErrors.birthDate = "Format de date invalide";
      }
    }
    if (!gender) newErrors.gender = "Le genre est requis";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("firstName", firstName);
      if (birthDate) {
        const parsedDate = parse(birthDate, "dd/MM/yyyy", new Date());
        const americanFormat = format(parsedDate, "yyyy-MM-dd");
        formData.append("birthDate", americanFormat);
      }
      formData.append("gender", gender);
      formData.append("interests", JSON.stringify(interests));
      if (croppedImage) {
        const blob = await fetch(croppedImage).then((r) => r.blob());
        formData.append("profilePicture", blob, "profile.jpg");
      }

      try {
        await saveProfile(formData);
        setIsProfileComplete(true);
        navigate("/dashboard");
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Création du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={croppedImage || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {firstName ? firstName[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {profilePicture && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {!profilePicture ? (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Déposez l'image ici ...</p>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Glissez et déposez une photo de profil ici, ou cliquez
                          pour en sélectionner une
                        </p>
                      </div>
                    )}
                    <Button onClick={open} variant="outline" className="mt-4">
                      Choisir une image
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <ReactCrop
                      crop={crop}
                      onChange={(newCrop) => setCrop(newCrop)}
                      onComplete={onCropComplete}
                      aspect={1}
                    >
                      <img
                        src={profilePicture}
                        alt="To crop"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                        onLoad={(e) => onImageLoaded(e.currentTarget)}
                      />
                    </ReactCrop>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de Naissance</Label>
              <div className="relative">
                <Input
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (errors.birthDate) {
                      setErrors((prev) => ({ ...prev, birthDate: "" }));
                    }
                  }}
                  onBlur={() => {
                    const parsedDate = parse(
                      birthDate,
                      "dd/MM/yyyy",
                      new Date()
                    );
                    if (!isValid(parsedDate)) {
                      setErrors((prev) => ({
                        ...prev,
                        birthDate: "Format invalide. Utilisez JJ/MM/AAAA",
                      }));
                    }
                  }}
                  placeholder="JJ/MM/AAAA"
                  className={
                    errors.birthDate ? "border-red-500 pr-10" : "pr-10"
                  }
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Genre</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("female")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Femme
                </Button>
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("male")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Homme
                </Button>
              </div>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Centres d'intérêt</Label>
              <div className="flex flex-wrap gap-2">
                {Interest.map((interest) => (
                  <Badge
                    key={interest.id}
                    variant={
                      interests.includes(interest.name) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleInterest(interest.name)}
                  >
                    {interest.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Créer mon profil
            </Button>
          </form>
        </CardContent>
      </Card>
    </MainContent>
  );
}
