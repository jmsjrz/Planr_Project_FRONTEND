import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Prêt à révolutionner vos événements ?
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Rejoignez Planr aujourd'hui et découvrez une nouvelle façon de créer et
        gérer vos événements.
      </p>
      <Button size="lg" className="text-lg px-8 py-6">
        Commencer gratuitement
      </Button>
    </section>
  );
}
