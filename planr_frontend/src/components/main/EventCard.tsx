import { useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Heart, MapPin, Users, Tag } from "lucide-react";
import { Event } from "@/models/Event";
import { toggleWishlist, registerForEvent } from "@/utils/api";

interface EventCardProps {
  event: Event;
}

const truncateDescription = (text: string, maxLength: number) =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "EEEE d MMMM yyyy", { locale: fr }).replace(/^\w/, (c) =>
    c.toUpperCase()
  );
};

export default function EventCard({ event }: EventCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(event.isWishlisted || false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered || false);
  const [localWishlistCount, setLocalWishlistCount] = useState(
    event.wishlistCount
  );

  const handleToggleWishlist = async () => {
    try {
      const response = await toggleWishlist(event.id);
      setIsWishlisted(response.status === "added");
      setLocalWishlistCount((prevCount) =>
        response.status === "added" ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error("Erreur lors de la gestion de la wishlist", error);
    }
  };

  const handleRegister = async () => {
    try {
      await registerForEvent(event.id);
      setIsRegistered(true);
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
    }
  };

  const displayedParticipants = event.participants.slice(0, 3);

  return (
    <Card className="w-full max-w-sm flex flex-col justify-between">
      <CardHeader className="p-0 relative">
        <img
          src={event.image ?? ""}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge variant="secondary" className="absolute top-2 right-2">
          <Tag className="h-3 w-3 mr-1" />
          {event.categoryDisplay}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4 space-y-4">
        <CardTitle className="text-xl font-bold line-clamp-2">
          {event.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={event.organizer.profilePicture || "/default-avatar.png"}
              alt={event.organizer.firstName || "Organisateur"}
            />
            <AvatarFallback>
              {event.organizer.firstName
                ? event.organizer.firstName.charAt(0)
                : "O"}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">
            Organisé par{" "}
            <span className="font-semibold">
              {event.organizer.firstName || "Anonyme"}
            </span>
          </p>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">Description :</p>
          <p className="text-sm text-muted-foreground line-clamp-3 max-h-[4.5rem]">
            {truncateDescription(event.description, 100)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {event.participants.length}/{event.maxParticipants}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {localWishlistCount}
              </span>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Voir les détails
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Détails de l'événement</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-sm">{formatDate(event.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <p className="text-sm">{event.time.substring(0, 5)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">{event.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <p className="text-sm">{event.categoryDisplay}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <p className="text-sm">
                        {localWishlistCount} personnes intéressées
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h5 className="font-medium mb-2">Participants inscrits</h5>
                    <div className="space-y-2">
                      {event.participants.length === 0 ? (
                        <p>Aucun participant pour le moment</p>
                      ) : (
                        event.participants.map((participant, index) => {
                          if (!participant) return null;

                          return (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    participant.profilePicture ||
                                    "/default-avatar.png"
                                  }
                                  alt={participant.firstName || "Participant"}
                                />
                                <AvatarFallback>
                                  {participant.firstName
                                    ? participant.firstName.charAt(0)
                                    : "P"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {participant.firstName || "Anonyme"}{" "}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 p-4 mt-auto">
        <div className="flex justify-between items-center w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                className="w-full mr-2"
                disabled={isRegistered}
              >
                {isRegistered ? "Inscrit" : "S'inscrire"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer l'inscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir vous inscrire à cet événement ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleRegister}>
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={
                    isWishlisted ? "text-red-500" : "text-muted-foreground"
                  }
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isWishlisted
                    ? "Retirer de la wishlist"
                    : "Ajouter à la wishlist"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-between items-center w-full min-h-[40px]">
          <div className="flex -space-x-2 overflow-hidden">
            {displayedParticipants.length === 0 ? (
              <p className="text-sm">Aucun participant inscrit</p>
            ) : (
              displayedParticipants.map((participant, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="inline-block border-2 border-background">
                        <AvatarImage
                          src={
                            participant.profilePicture || "/default-avatar.png"
                          }
                          alt={participant.firstName}
                        />
                        <AvatarFallback>
                          {participant.firstName
                            ? participant.firstName.charAt(0)
                            : "P"}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{participant.firstName || "Anonyme"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            )}
          </div>
          {event.participants.length > displayedParticipants.length && (
            <span className="text-sm text-muted-foreground">
              +{event.participants.length - displayedParticipants.length}{" "}
              inscrits
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
