// src/components/routes/DashboardRoute.tsx

import { Route } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface DashboardRouteProps {
  path: string;
  element: React.ReactNode;
  breadcrumbs: { title: string; url: string }[];
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}

export default function DashboardRoute({
  path,
  element,
  breadcrumbs,
  showLeftSidebar = true,
  showRightSidebar = true,
}: DashboardRouteProps) {
  return (
    <Route
      path={path}
      element={
        <DashboardLayout
          breadcrumbs={breadcrumbs}
          showLeftSidebar={showLeftSidebar}
          showRightSidebar={showRightSidebar}
        >
          {element}
        </DashboardLayout>
      }
    />
  );
}
