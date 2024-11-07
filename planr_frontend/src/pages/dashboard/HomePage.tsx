import { useEffect, useState } from "react";
import MainContent from "@/components/layout/MainContent";
import { getPrivateEvents } from "@/utils/api";
import { Event } from "@/models/Event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GoogleMap } from "@react-google-maps/api";
import { useGoogleMaps } from "@/context/MapContext";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 46.603354,
  lng: 1.888334,
};

// Style de carte personnalisé
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f3f4f6" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f3f4f6" }],
  },
];

export default function HomePage() {
  const [privateEvents, setPrivateEvents] = useState<Event[]>();
  const [trendingEvents, setTrendingEvents] = useState<Event[]>();
  const [isAPILoading, setIsAPILoading] = useState<boolean>(true);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { loadError, isLoaded } = useGoogleMaps();

  useEffect(() => {
    getPrivateEvents()
      .then((data) => {
        console.log(data);
        setPrivateEvents(data);
        setTrendingEvents(data.slice(0, 5));
      })
      .catch((error: any) => {
        console.error(
          "Erreur lors de la récupération des événements privés :",
          error
        );
      });
  }, []);

  useEffect(() => {
    if (privateEvents && trendingEvents) {
      setIsAPILoading(false);
    }
  }, [privateEvents, trendingEvents]);

  const onMapLoad = (map: google.maps.Map) => {
    map.setOptions({
      styles: mapStyle,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
    });

    console.log(privateEvents);

    privateEvents &&
      privateEvents.forEach((event) => {
        const lat = parseFloat(event.latitude.toString());
        const lng = parseFloat(event.longitude.toString());
        if (!isNaN(lat) && !isNaN(lng)) {
          const position = { lat, lng };

          const marker = new google.maps.Marker({
            position,
            map,
            title: event.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#2563eb",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
            <div style="
              padding: 12px;
              max-width: 200px;
              color: #374151;
              background-color: #ffffff;
              border-radius: 6px;
              font-family: system-ui, -apple-system, sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px;
                font-weight: 600;
                font-size: 16px;
                color: #111827;
              ">${event.title}</h3>
              <p style="
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
              ">${event.description}</p>
            </div>
          `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          setMarkers((prev) => [...prev, marker]);
        }
      });
  };

  useEffect(() => {
    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [markers]);

  if (loadError) {
    return <div>Erreur de chargement de la carte : {loadError.message}</div>;
  }

  return (
    <MainContent>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Carte des événements en France</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAPILoading && isLoaded ? (
            <div className="rounded-lg overflow-hidden border border-border">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={6}
                onLoad={onMapLoad}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
              <p className="text-muted-foreground">Chargement de la carte...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Événements en tendance</h2>
        {isAPILoading ? (
          <p>Chargement des événements...</p>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
              {trendingEvents &&
                trendingEvents.map((event) => (
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
