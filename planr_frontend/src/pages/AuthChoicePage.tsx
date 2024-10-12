import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone } from "lucide-react"

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Connexion / Inscription</CardTitle>
          <CardDescription className="text-center">
            Choisissez votre méthode de connexion ou inscrivez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => console.log("Connexion par téléphone")}>
            <Phone className="mr-2 h-4 w-4" />
            Se connecter avec SMS/Téléphone
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => console.log("Connexion par email")}>
            <Mail className="mr-2 h-4 w-4" />
            Se connecter avec E-mail
          </Button>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full" onClick={() => console.log("Inscription")}>
            Vous n'avez pas de compte ? Inscrivez-vous
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
