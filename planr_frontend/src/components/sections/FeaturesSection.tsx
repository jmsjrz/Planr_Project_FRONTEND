import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Bell, MessageSquare } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Gestion d'Événements",
      description:
        "Créez, modifiez et gérez vos événements en toute simplicité.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Profils Personnalisés",
      description: "Personnalisez votre profil et gérez vos préférences.",
      color: "text-green-600",
    },
    {
      icon: Bell,
      title: "Notifications en Temps Réel",
      description: "Restez informé des mises à jour et des invitations.",
      color: "text-yellow-600",
    },
    {
      icon: MessageSquare,
      title: "Messagerie Intégrée",
      description: "Communiquez facilement avec les autres participants.",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Fonctionnalités principales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
