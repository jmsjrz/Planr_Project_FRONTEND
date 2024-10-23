import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export function PricingSection() {
  const pricingPlans = [
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
      features: ["Solutions personnalisées", "API dédiée", "Account manager"],
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Nos tarifs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan) => (
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
  );
}
