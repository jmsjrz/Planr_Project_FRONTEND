import {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
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
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Upload, Clock, XCircleIcon } from "lucide-react";
import { createPrivateEvent } from "@/utils/api";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/utils/api";

interface FormData {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  date: Date | null;
  time: string;
  maxParticipants: number;
  image: string | null;
  category: string;
}

interface EventCreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORM_STORAGE_KEY = "eventCreationFormData";

const CATEGORY_CHOICES = [
  { value: "CONF", label: "Conférences" },
  { value: "WORK", label: "Ateliers" },
  { value: "FEST", label: "Festivals" },
  { value: "SPORT", label: "Sport" },
  { value: "PARTY", label: "Soirées" },
  { value: "EXPO", label: "Expositions" },
  { value: "TRIP", label: "Excursions" },
  { value: "CHAR", label: "Événements caritatifs" },
  { value: "PROF", label: "Rencontres professionnelles" },
  { value: "FAM", label: "Famille et Enfants" },
];

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
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      latitude: 0,
      longitude: 0,
      date: null,
      time: "",
      maxParticipants: 0,
      image: null,
      category: "",
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      reset({
        ...parsedData,
        date: parsedData.date ? new Date(parsedData.date) : null,
      });
      if (parsedData.image) {
        setImage(parsedData.image);
        setCroppedImage(parsedData.image);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openDropzone,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleOpenDropzone = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openDropzone();
  };

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
  }, []);

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): string => {
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
    },
    []
  );

  useEffect(() => {
    if (completedCrop && imgRef.current) {
      const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
      setCroppedImage(croppedImageUrl);
      setValue("image", croppedImageUrl);
    }
  }, [completedCrop, getCroppedImg, setValue]);

  const handleRemoveImage = () => {
    setImage(null);
    setCroppedImage(null);
    setValue("image", null);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const places = autocompleteRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        setValue("location", place.formatted_address || "");
        setValue("latitude", place.geometry?.location?.lat() || 0);
        setValue("longitude", place.geometry?.location?.lng() || 0);
      }
    }
  };

  const submitForm: SubmitHandler<FormData> = async (data) => {
    console.log("Formulaire soumis avec les données :", data); // Ajouté pour déboguer
    const formData = new FormData();
    const formattedDate = data.date
      ? data.date.toISOString().split("T")[0]
      : "";
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("date", formattedDate);
    formData.append("time", data.time);
    formData.append("maxParticipants", data.maxParticipants.toString());
    formData.append("category", data.category);

    if (data.image) {
      const blob = await (await fetch(data.image)).blob();
      formData.append("image", blob, "event.jpg");
    }

    try {
      const response = await createPrivateEvent(formData);
      console.log("Événement créé avec succès :", response);
      localStorage.removeItem(FORM_STORAGE_KEY);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la création de l'événement :", error);
      if (error.response) {
        console.error("Détails de l'erreur :", error.response.data);
      }
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent className="max-h-[65vh] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Créer un Nouvel Événement</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pb-0">
            <Form {...form}>
              <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                <FormField
                  control={control}
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
                  control={control}
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

                <div className="flex space-x-2">
                  <FormItem className="flex-[3]">
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      {isLoaded ? (
                        <Controller
                          control={control}
                          name="location"
                          render={({ field }) => (
                            <StandaloneSearchBox
                              onLoad={(ref) => {
                                autocompleteRef.current = ref;
                              }}
                              onPlacesChanged={onPlaceChanged}
                            >
                              <Input
                                placeholder="Entrez l'adresse de l'événement"
                                {...field}
                              />
                            </StandaloneSearchBox>
                          )}
                        />
                      ) : (
                        <Input
                          placeholder="Chargement de Google Maps..."
                          disabled
                        />
                      )}
                    </FormControl>
                  </FormItem>

                  <FormField
                    control={control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nombre de participants</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-2">
                  <FormField
                    control={control}
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
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
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
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_CHOICES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

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
                              onClick={handleOpenDropzone}
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
                                onChange={(_, percentCrop) =>
                                  setCrop(percentCrop)
                                }
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={16 / 9}
                              >
                                <img
                                  ref={imgRef}
                                  src={image}
                                  alt="Event"
                                  onLoad={(e) => onImageLoad(e.currentTarget)}
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

                <Button type="submit" className="w-full">
                  Créer l'Événement
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
