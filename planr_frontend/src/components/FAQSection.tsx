// /components/FAQSection.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqData = {
  general: [
    {
      question: "Qu'est-ce que Planr ?",
      answer:
        "Planr est une plateforme de gestion sociale d'événements qui vous permet de créer, gérer et participer à des événements facilement.",
    },
    {
      question: "Planr est-il gratuit ?",
      answer:
        "Oui, Planr est gratuit pour un usage personnel. Des plans payants sont disponibles pour les utilisateurs professionnels.",
    },
    {
      question: "Planr est-il disponible sur mobile ?",
      answer:
        "Oui, Planr est disponible sur iOS et Android. Vous pouvez télécharger l'application mobile sur l'App Store et Google Play.",
    },
  ],
  technical: [
    {
      question: "Planr fonctionne-t-il hors ligne ?",
      answer:
        "L'application mobile Planr offre certaines fonctionnalités hors ligne, mais une connexion internet est nécessaire pour une synchronisation complète. L'application web nécessite une connexion internet pour fonctionner.",
    },
    {
      question: "Quelles sont les technologies utilisées par Planr ?",
      answer:
        "Planr est construit avec React, Tailwind CSS avec ShadCN ainsi que Django. L'application mobile est développée avec React Native.",
    },
  ],
};

export function FAQSection() {
  return (
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
          {faqData.general.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="technical">
          {faqData.technical.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
