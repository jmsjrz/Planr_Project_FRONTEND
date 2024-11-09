import { Button } from "@/components/ui/button";
import { Apple, Smartphone } from "lucide-react";

export const MobileAppSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="relative w-[300px] h-[600px] mx-auto">
              <img
                src="/mobile_app_illustration.png"
                alt="Application mobile Planr"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Planr dans votre poche
            </h2>
            <p className="text-xl text-muted-foreground">
              Gérez vos événements où que vous soyez avec notre application
              mobile intuitive et puissante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" className="text-lg">
                <Apple className="mr-2 h-6 w-6" />
                App Store
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                <Smartphone className="mr-2 h-6 w-6" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
