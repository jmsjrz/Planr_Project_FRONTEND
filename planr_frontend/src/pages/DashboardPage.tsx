// src/pages/DashboardPage.tsx
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button"; // Bouton ShadCN
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Composants de carte ShadCN
import { Separator } from "@/components/ui/separator"; // Pour séparer visuellement les sections

const DashboardPage = () => {
  const { user, logout } = useAuth(); // Récupérer l'utilisateur et la fonction logout

  console.log("Données utilisateur dans DashboardPage :", user);

  return (
    <div className="container mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue dans votre Dashboard</CardTitle>
          <CardDescription>
            Gérez vos informations et vos activités ici.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p className="text-lg font-semibold">Connecté en tant que :</p>
              <p className="text-gray-700">
                {user.email ||
                  user.phone_number ||
                  `ID utilisateur : ${user.user_id}`}
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Cette page ne contient rien pour le moment. Il s'agit d'un
                environnement de développement. La seule chose que vous pouvez
                faire est de vous déconnecter et visualiser les informations
                utilisateur renvoyées par le backend actuel.
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Chargement des informations utilisateur...
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* Bouton de déconnexion */}
          <Button onClick={logout} variant="destructive">
            Se déconnecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardPage;
