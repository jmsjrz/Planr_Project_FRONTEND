// src/pages/DashboardPage.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "./dashboard/HomePage";
import SettingsPage from "./dashboard/SettingsPage";
// Import other pages if necessary

export default function DashboardPage() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout
            breadcrumbs={[
              { title: "Planr", url: "/" },
              { title: "Tableau de bord", url: "/dashboard" },
            ]}
          >
            <HomePage />
          </DashboardLayout>
        }
      />
      <Route
        path="settings"
        element={
          <DashboardLayout
            breadcrumbs={[
              { title: "Planr", url: "/" },
              { title: "Tableau de bord", url: "/dashboard" },
              { title: "Paramètres", url: "/dashboard/settings" },
            ]}
            showRightSidebar={false} // Hide the right sidebar
          >
            <SettingsPage />
          </DashboardLayout>
        }
      />
      {/* Add other routes here */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
