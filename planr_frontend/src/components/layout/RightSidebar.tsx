// src/components/layout/RightSidebar.tsx

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DatePickerWidget from "@/components/widgets/DatePickerWidget";
import EventFiltersWidget from "@/components/widgets/EventFiltersWidget";

interface RightSidebarProps {
  isOpen: boolean;
}

export default function RightSidebar({ isOpen }: RightSidebarProps) {
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
