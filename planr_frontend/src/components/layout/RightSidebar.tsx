// src/components/layout/RightSidebar.tsx

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchEvents, getPrivateEvents } from "@/utils/api"; // Importez `getPrivateEvents`
import { useSearch } from "@/context/SearchContext";
import EventFiltersWidget from "../widgets/EventFiltersWidget";
import DatePickerWidget from "../widgets/DatePickerWidget";

interface RightSidebarProps {
  isOpen: boolean;
}

export default function RightSidebar({ isOpen }: RightSidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { setSearchResults } = useSearch();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        const results = await searchEvents(searchQuery);
        setSearchResults(results); // Met à jour les résultats de la recherche
      } else {
        const allEvents = await getPrivateEvents();
        setSearchResults(allEvents); // Réinitialise à tous les événements si la recherche est vide
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l w-[280px]"
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border p-4">
        <div className="relative flex items-center">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un événement..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <DatePickerWidget />
        <SidebarSeparator className="mx-0" />
        <EventFiltersWidget />
      </SidebarContent>
    </Sidebar>
  );
}
