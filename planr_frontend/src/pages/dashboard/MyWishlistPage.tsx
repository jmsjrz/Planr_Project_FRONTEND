// src/pages/dashboard/MyWishlistPage.tsx

import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import EventCard from "@/components/main/EventCard";
import { getMyWishlistEvents } from "@/utils/api";
import { Event } from "@/models/Event";

export default function MyWishlistPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWishlistEvents = async () => {
      try {
        const wishlistEvents = await getMyWishlistEvents();
        setEvents(wishlistEvents);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des événements de la wishlist :",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistEvents();
  }, []);

  return (
    <MainContent>
      <h1 className="text-2xl font-bold mb-4">Mes Événements en Wishlist</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : events.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>Aucun événement dans votre wishlist.</p>
      )}
    </MainContent>
  );
}
