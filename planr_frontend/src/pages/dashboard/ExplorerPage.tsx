// src/pages/ExplorerPage.tsx

import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import EventCard from "@/components/main/EventCard";
import { getPrivateEvents } from "@/utils/api";
import { useSearch } from "@/context/SearchContext";
import { Event } from "@/models/Event";

export default function ExplorerPage() {
  const { searchResults } = useSearch();
  const [events, setEvents] = useState<Event[]>([]);

  // Charge tous les événements au chargement de la page
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const allEvents = await getPrivateEvents();
        setEvents(allEvents); // Charge tous les événements par défaut
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };
    fetchAllEvents();
  }, []);

  // Met à jour `events` si des résultats de recherche sont disponibles
  useEffect(() => {
    if (searchResults.length > 0) {
      setEvents(searchResults); // Affiche les résultats de la recherche
    }
  }, [searchResults]);

  return (
    <MainContent>
      <h1 className="text-2xl font-bold mb-4">
        Les événements organisés par la communauté
      </h1>
      {events.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>Aucun événement trouvé.</p>
      )}
    </MainContent>
  );
}
