import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">Planr</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Connexion</Button>
            <Button>Inscription</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
