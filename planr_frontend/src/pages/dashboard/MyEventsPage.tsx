import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import { getMyEvents, getJoinedEvents, deleteEvent } from "@/utils/api";
import { Event } from "@/models/Event";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loadingMyEvents, setLoadingMyEvents] = useState<boolean>(true);
  const [loadingJoinedEvents, setLoadingJoinedEvents] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const events = await getMyEvents();
        setMyEvents(events);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de vos événements :",
          error
        );
      } finally {
        setLoadingMyEvents(false);
      }
    };

    const fetchJoinedEvents = async () => {
      try {
        const events = await getJoinedEvents();
        setJoinedEvents(events);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des événements rejoints :",
          error
        );
      } finally {
        setLoadingJoinedEvents(false);
      }
    };

    fetchMyEvents();
    fetchJoinedEvents();
  }, [user]);

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setMyEvents(myEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
    }
  };

  const handleView = (eventId: number) => {
    navigate(`/dashboard/event/${eventId}`);
  };

  const handleEdit = (eventId: number) => {
    navigate(`/dashboard/edit-event/${eventId}`);
  };

  return (
    <MainContent>
      <h1 className="text-3xl font-bold mb-6">Événements organisés</h1>
      {loadingMyEvents ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : myEvents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()} à {event.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      new Date(event.date) > new Date()
                        ? "default"
                        : "secondary"
                    }
                  >
                    {new Date(event.date) > new Date() ? "À venir" : "Passé"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleView(event.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye size={16} /> Visualiser
                    </Button>
                    <Button
                      onClick={() => handleEdit(event.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit size={16} /> Modifier
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-red-500"
                        >
                          <Trash size={16} /> Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Êtes-vous absolument sûr ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela
                            supprimera définitivement votre événement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(event.id)}
                          >
                            Continuer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-muted-foreground">
          Vous n'avez pas encore créé d'événements.
        </p>
      )}

      <h2 className="text-3xl font-bold mt-10 mb-6">Événements rejoints</h2>
      {loadingJoinedEvents ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : joinedEvents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString()} à {event.time}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      new Date(event.date) > new Date()
                        ? "default"
                        : "secondary"
                    }
                  >
                    {new Date(event.date) > new Date() ? "À venir" : "Passé"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleView(event.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Eye size={16} /> Visualiser
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-muted-foreground">
          Vous n'avez pas encore rejoint d'événements.
        </p>
      )}
    </MainContent>
  );
}
