import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
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
  );
}
