// src/pages/dashboard/HomePage.tsx

import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import EventCard from "@/components/main/EventCard";
import api from "@/utils/api"; // Assurez-vous que cette instance d'axios est configurée pour inclure les tokens d'authentification si nécessaire.

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  max_participants: number;
  creator: {
    name: string;
    avatar: string;
  };
  participants: Participant[];
  date: string;
  duration: string;
  location: string;
  image: string;
  wishlist_count: number;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/private-events/");
        const eventsData = response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          max_participants: event.max_participants,
          creator: {
            name: event.creator_name || "Anonyme",
            avatar: event.creator_avatar || "",
          },
          participants: event.participants || [],
          date: event.date,
          duration: event.duration || "N/A",
          location: event.location,
          image: event.image || "",
          wishlist_count: event.wishlist_count || 0,
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des événements privés :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <MainContent>
      <h1 className="text-2xl font-bold mb-4">
        Page de test pour fetch les Events Privés
      </h1>
      {loading ? (
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
