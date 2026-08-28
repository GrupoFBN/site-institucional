import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
import { TrustSection } from "@/components/trust-section";
import { ServiceCards } from "@/components/service-cards";
import { Stats } from "@/components/stats";
import { CtaFinal } from "@/components/cta-final";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <TrustSection />
      <ServiceCards />
      <Stats />
      <CtaFinal />
      <Footer />
    </main>
  );
}
