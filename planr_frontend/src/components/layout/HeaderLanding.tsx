import { Button } from "@/components/ui/button";
import { Calendar, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingWidget from "@/components/routes/LoadingWidget";
import { useAuth } from "@/context/AuthContext"; // Import du contexte d'authentification

export function Header() {
  const { user, loading } = useAuth(); // Utilisation du contexte pour vérifier si l'utilisateur est connecté

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">Planr</span>
          </div>
          <div className="flex space-x-2">
            {loading ? (
              <LoadingWidget />
            ) : user ? (
              <Link to="/dashboard">
                <Button>Ma Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>
                  <LogIn className="mr-2" />
                  Accéder à l'application
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
