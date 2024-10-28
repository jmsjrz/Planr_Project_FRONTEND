import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import { getPrivateEvents } from "@/utils/api";
import { Event } from "@/models/Event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function HomePage() {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getPrivateEvents()
      .then((data) => {
        console.log(data);
        // For demonstration, we'll assume the first 5 events are trending
        setTrendingEvents(data.slice(0, 5));
        setIsLoading(false);
      })
      .catch((error: any) => {
        console.error(
          "Erreur lors de la récupération des événements privés :",
          error
        );
        setIsLoading(false);
      });
  }, []);

  return (
    <MainContent>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Carte des événements en France</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">
                Placeholder pour la carte Google Maps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Événements en tendance</h2>
        {isLoading ? (
          <p>Chargement des événements...</p>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {trendingEvents.map((event) => (
                <Card key={event.id} className="w-[250px]">
                  <CardHeader>
                    <CardTitle className="truncate">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm truncate">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </section>
    </MainContent>
  );
}
