// src/components/widgets/DatePickerWidget.tsx

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { fr } from "date-fns/locale";

export default function DatePickerWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <SidebarGroup className="px-4">
      <SidebarGroupLabel>Calendrier</SidebarGroupLabel>
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border max-w-full"
          locale={fr}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
