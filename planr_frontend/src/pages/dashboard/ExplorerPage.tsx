import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import EventCard from "@/components/main/EventCard";
import { getPrivateEvents } from "@/utils/api";
import { Event } from "@/models/Event";

export default function ExplorerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getPrivateEvents()
      .then((data) => {
        console.log(data);
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.error(
          "Erreur lors de la récupération des événements privés :",
          error
        );
      });
  }, []);

  return (
    <MainContent>
      <h1 className="text-2xl font-bold mb-4">
        Les événements organisés par la communauté
      </h1>
      {isLoading ? (
        <p>Chargement des événements...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {" "}
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </MainContent>
  );
}
