import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Bell,
  MessageSquare,
  Star,
  ChevronRight,
  Apple,
  Smartphone,
} from "lucide-react";

export function Content() {
  return (
    <main className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Planifiez vos événements avec Planr
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La plateforme tout-en-un pour créer, gérer et participer à des
          événements inoubliables
        </p>
        <Button size="lg" className="text-lg px-8 py-6">
          Commencer gratuitement
        </Button>
        <div className="mt-12">
          <img
            src="/placeholder.svg"
            alt="Aperçu de l'application Planr"
            className="rounded-lg shadow-xl mx-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Gestion d'Événements</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Créez, modifiez et gérez vos événements en toute simplicité.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Profils Personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Personnalisez votre profil et gérez vos préférences.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Notifications en Temps Réel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Restez informé des mises à jour et des invitations.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Messagerie Intégrée</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Communiquez facilement avec les autres participants.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <img
              src="/placeholder.svg"
              alt="Application mobile Planr"
              className="mx-auto rounded-3xl shadow-2xl"
              style={{ height: "600px", width: "350px" }} // Taille ajustée pour correspondre à un téléphone
            />
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Planr dans votre poche
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Gérez vos événements où que vous soyez avec notre application
              mobile intuitive et puissante.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="outline" className="text-lg px-6 py-3">
                <Apple className="mr-2 h-6 w-6" />
                App Store
              </Button>
              <Button variant="outline" className="text-lg px-6 py-3">
                <Smartphone className="mr-2 h-6 w-6" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          L'équipe derrière Planr
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Sophie Martin",
              role: "Fondatrice & CEO",
              image: "/placeholder.svg",
            },
            { name: "Thomas Dubois", role: "CTO", image: "/placeholder.svg" },
            {
              name: "Emma Lefebvre",
              role: "Designer UX",
              image: "/placeholder.svg",
            },
            {
              name: "Lucas Moreau",
              role: "Lead Developer",
              image: "/placeholder.svg",
            },
          ].map((member) => (
            <Card key={member.name}>
              <CardHeader>
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full w-32 h-32 mx-auto mb-4"
                />
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Ce que disent nos utilisateurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Marie L.",
              text: "Planr a révolutionné la façon dont j'organise mes événements. C'est tellement simple et intuitif !",
            },
            {
              name: "Pierre D.",
              text: "La fonction de messagerie intégrée est géniale. Je peux facilement communiquer avec tous mes invités.",
            },
            {
              name: "Camille F.",
              text: "Les notifications en temps réel sont un vrai plus. Je ne rate plus jamais un événement important.",
            },
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <Star className="text-yellow-400 mr-1" />
                    <Star className="text-yellow-400 mr-1" />
                    <Star className="text-yellow-400 mr-1" />
                    <Star className="text-yellow-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Questions fréquentes
        </h2>
        <Tabs defaultValue="general" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="technical">Technique</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Qu'est-ce que Planr ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Planr est une plateforme de gestion sociale d'événements qui
                  vous permet de créer, gérer et participer à des événements
                  facilement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle>Planr fonctionne-t-il hors ligne ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  L'application mobile Planr offre certaines fonctionnalités
                  hors ligne, mais une connexion internet est nécessaire pour
                  une synchronisation complète.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Nos tarifs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Gratuit",
              price: "0€",
              features: [
                "Jusqu'à 10 événements/mois",
                "Fonctionnalités de base",
                "Support communautaire",
              ],
            },
            {
              name: "Premium",
              price: "9.99€/mois",
              features: [
                "Événements illimités",
                "Fonctionnalités avancées",
                "Support prioritaire",
              ],
            },
            {
              name: "Entreprise",
              price: "Sur devis",
              features: [
                "Solutions personnalisées",
                "API dédiée",
                "Account manager",
              ],
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.name === "Premium" ? "border-blue-500 border-2" : ""
              }
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à révolutionner vos événements ?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez Planr aujourd'hui et découvrez une nouvelle façon de créer
          et gérer vos événements.
        </p>
        <Button size="lg" className="text-lg px-8 py-6">
          Commencer gratuitement
        </Button>
      </section>
    </main>
  );
}

export default Content;
