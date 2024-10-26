import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Upload, Clock, XCircleIcon } from "lucide-react";
import { createPrivateEvent } from "@/utils/api";

interface FormData {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  maxParticipants: number;
  image: string | null;
}

interface EventCreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventCreationDrawer({
  isOpen,
  onClose,
}: EventCreationDrawerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 56.25, // Aspect ratio 16:9
    x: 0,
    y: 21.875,
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: new Date(),
      time: "",
      maxParticipants: 0,
      image: null,
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
  });

  const onCropComplete = (crop: Crop) => {
    if (image) {
      const croppedImageUrl = getCroppedImg(image, crop);
      setCroppedImage(croppedImageUrl);
      form.setValue("image", croppedImageUrl);
    }
  };

  const getCroppedImg = (src: string, crop: Crop): string => {
    const image = new Image();
    image.src = src;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return canvas.toDataURL("image/jpeg");
  };

  const handleRemoveImage = () => {
    setImage(null);
    setCroppedImage(null);
    form.setValue("image", null);
  };

  const submitForm = async (data: FormData) => {
    // Création d'un formData pour envoyer les données avec l'image
    const formData = new FormData();
    const formattedDate = data.date.toISOString().split("T")[0];
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("date", formattedDate);
    formData.append("time", data.time);
    formData.append("maxParticipants", data.maxParticipants.toString());

    if (data.image) {
      const blob = await fetch(data.image).then((r) => r.blob());
      formData.append("image", blob, "event.jpg");
    }

    try {
      // Appel de la fonction API pour créer l'événement
      const response = await createPrivateEvent(formData);
      console.log("Événement créé avec succès :", response);
      onClose(); // Fermer le drawer après soumission
    } catch (error) {
      console.error("Erreur lors de la création de l'événement :", error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Créer un Nouvel Événement</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de l'événement" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de l'événement"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Lieu de l'événement" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Heure</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="time" {...field} className="pl-8" />
                          <Clock className="absolute left-2 top-2.5 h-4 w-4 opacity-50" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Image de l'événement</FormLabel>
                    <FormControl>
                      <Card className="w-full">
                        <CardContent>
                          {!image ? (
                            <div
                              {...getRootProps()}
                              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                            >
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Déposez l'image ici ...</p>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <p className="text-sm text-gray-500">
                                    Glissez et déposez une image ici, ou cliquez
                                    pour en sélectionner une
                                  </p>
                                </div>
                              )}
                              <Button
                                onClick={open}
                                variant="outline"
                                className="mt-4"
                              >
                                Choisir une image
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="relative">
                                <ReactCrop
                                  crop={crop}
                                  onChange={(newCrop) => setCrop(newCrop)}
                                  onComplete={(c) => onCropComplete(c)}
                                  aspect={16 / 9}
                                >
                                  <img
                                    src={image}
                                    alt="Event"
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "300px",
                                    }}
                                  />
                                </ReactCrop>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 rounded-full"
                                  onClick={handleRemoveImage}
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </Button>
                              </div>
                              {croppedImage && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">
                                    Aperçu
                                  </h3>
                                  <img
                                    src={croppedImage}
                                    alt="Cropped preview"
                                    className="max-w-full h-auto rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </FormControl>
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button type="submit" className="w-full">
                  Créer l'Événement
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
