import { Button } from "@/components/ui/button";
import { Apple, Smartphone } from "lucide-react";

export function MobileAppSection() {
  return (
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
            Gérez vos événements où que vous soyez avec notre application mobile
            intuitive et puissante.
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
  );
}
