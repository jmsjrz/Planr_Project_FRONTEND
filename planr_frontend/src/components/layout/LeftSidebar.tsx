// src/components/layout/LeftSidebar.tsx

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { CalendarIcon } from "lucide-react";
import NavMain from "@/components/navigation/NavMain";
import NavUser from "@/components/navigation/NavUser";
import UpgradePlan from "@/components/widgets/UpgradePlanWidget";

interface LeftSidebarProps {
  isOpen: boolean;
}

export default function LeftSidebar({ isOpen }: LeftSidebarProps) {
  if (!isOpen) return null;

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Planr</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <UpgradePlan />
        <div className="mx-4 mt-4 flex items-center justify-between">
          <NavUser />
          {/* Autres éléments */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
