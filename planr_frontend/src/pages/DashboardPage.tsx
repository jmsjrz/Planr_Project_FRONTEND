// src/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "./dashboard/HomePage";
import SettingsPage from "./dashboard/SettingsPage";
import CreateProfilePage from "./dashboard/CreateProfilePage";
import { checkProfileCompletion } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const location = useLocation();
  const { isProfileComplete, setIsProfileComplete } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyProfileCompletion = async () => {
      setLoading(true);
      try {
        const { is_profile_complete } = await checkProfileCompletion();
        setIsProfileComplete(is_profile_complete);
      } catch (error) {
        console.error("Erreur lors de la vérification du profil :", error);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    verifyProfileCompletion();
  }, [location.pathname, setIsProfileComplete]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isProfileComplete && location.pathname !== "/dashboard/create-profile") {
    return <Navigate to="/dashboard/create-profile" replace />;
  }

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
            showRightSidebar={false}
          >
            <SettingsPage />
          </DashboardLayout>
        }
      />
      <Route path="create-profile" element={<CreateProfilePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
