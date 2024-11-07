import React, { createContext, useContext, ReactNode } from "react";
import { Libraries, useLoadScript, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries: Libraries = ["places"];

interface GoogleMapsContextProps {
  isLoaded: boolean;
  Autocomplete: typeof Autocomplete;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextProps | undefined>(
  undefined
);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div>Erreur de chargement de Google Maps</div>;
  if (!isLoaded) return <div>Chargement...</div>;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, Autocomplete, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = (): GoogleMapsContextProps => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error(
      "useGoogleMaps doit être utilisé à l'intérieur de GoogleMapsProvider"
    );
  }
  return context;
};
