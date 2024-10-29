// src/context/SearchContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import { Event } from "@/models/Event";

interface SearchContextType {
  searchResults: Event[];
  setSearchResults: (results: Event[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  // Initialisez `searchResults` comme un tableau vide
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
