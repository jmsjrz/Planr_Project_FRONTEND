import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Planr</h3>
            <p className="text-sm text-gray-600">
              Votre plateforme de gestion sociale d'événements simplifie la
              planification, la gestion et le partage d'événements, que ce soit
              pour des réunions privées ou professionnelles.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h4 className="text-md font-semibold mb-2">Liens rapides</h4>
            <ul className="text-sm">
              <li className="mb-1">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Conditions d'utilisations
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Foire aux Questions
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h4 className="text-md font-semibold mb-2">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Planr. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
