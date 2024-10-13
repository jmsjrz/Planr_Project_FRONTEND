import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { MobileAppSection } from "@/components/MobileAppSection";
import { TeamSection } from "@/components/TeamSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4">
        <HeroSection />
        <FeaturesSection />
        <MobileAppSection />
        <TeamSection />
        <TestimonialsSection />
        <FAQSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
