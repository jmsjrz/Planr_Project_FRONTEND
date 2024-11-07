// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HomePage from "./dashboard/HomePage";
import ExplorerPage from "./dashboard/ExplorerPage";
import SettingsPage from "./dashboard/SettingsPage";
import CreateProfilePage from "./dashboard/CreateProfilePage";
import MyEventsPage from "./dashboard/MyEventsPage";
import MyWishlistPage from "./dashboard/MyWishlistPage";
import { checkProfileCompletion } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import LoadingWidget from "@/components/routes/LoadingWidget";
import { GoogleMapsProvider } from "@/context/MapContext";

export default function DashboardPage() {
  const location = useLocation();
  const { isProfileComplete, setIsProfileComplete } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyProfileCompletion = async () => {
      setLoading(true);
      try {
        const { isProfileComplete } = await checkProfileCompletion();
        setIsProfileComplete(isProfileComplete);
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
    return <LoadingWidget />;
  }

  if (!isProfileComplete && location.pathname !== "/dashboard/create-profile") {
    return <Navigate to="/dashboard/create-profile" replace />;
  }

  return (
    <GoogleMapsProvider>
      <SearchProvider>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout
                breadcrumbs={[
                  { title: "Planr", url: "/" },
                  { title: "Tableau de bord", url: "/dashboard" },
                ]}
                showRightSidebar={false}
              >
                <HomePage />
              </DashboardLayout>
            }
          />
          <Route
            path="explorer"
            element={
              <DashboardLayout
                breadcrumbs={[
                  { title: "Planr", url: "/" },
                  { title: "Tableau de bord", url: "/dashboard" },
                  { title: "Explorer", url: "/dashboard/explorer" },
                ]}
              >
                <ExplorerPage />
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
          <Route
            path="my-events" // New route path
            element={
              <DashboardLayout
                breadcrumbs={[
                  { title: "Planr", url: "/" },
                  { title: "Tableau de bord", url: "/dashboard" },
                  { title: "Mes Événements", url: "/dashboard/my-events" },
                ]}
                showRightSidebar={false}
              >
                <MyEventsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="my-wishlist"
            element={
              <DashboardLayout
                breadcrumbs={[
                  { title: "Planr", url: "/" },
                  { title: "Tableau de bord", url: "/dashboard" },
                  {
                    title: "Mes Événements Wishlist",
                    url: "/dashboard/my-wishlist",
                  },
                ]}
                showRightSidebar={false}
              >
                <MyWishlistPage />
              </DashboardLayout>
            }
          />
          <Route path="create-profile" element={<CreateProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </SearchProvider>
    </GoogleMapsProvider>
  );
}
