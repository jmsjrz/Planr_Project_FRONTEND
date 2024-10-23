// src/components/layout/DashboardLayout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs: { title: string; url: string }[];
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}

export default function DashboardLayout({
  children,
  breadcrumbs,
  showLeftSidebar = true,
  showRightSidebar = true,
}: DashboardLayoutProps) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(showLeftSidebar);
  const [isRightSidebarOpen, setIsRightSidebarOpen] =
    useState(showRightSidebar);

  return (
    <SidebarProvider>
      {showLeftSidebar && <LeftSidebar isOpen={isLeftSidebarOpen} />}
      <div className="flex-1 flex flex-col">
        <Header
          breadcrumbs={breadcrumbs}
          showLeftSidebar={showLeftSidebar}
          showRightSidebar={showRightSidebar}
          isLeftSidebarOpen={isLeftSidebarOpen}
          setIsLeftSidebarOpen={setIsLeftSidebarOpen}
          isRightSidebarOpen={isRightSidebarOpen}
          setIsRightSidebarOpen={setIsRightSidebarOpen}
        />
        {children}
      </div>
      {showRightSidebar && <RightSidebar isOpen={isRightSidebarOpen} />}
    </SidebarProvider>
  );
}
