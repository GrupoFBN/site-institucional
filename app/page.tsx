import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
import { ServiceCards } from "@/components/service-cards";
import { Stats } from "@/components/stats";
import { CtaFinal } from "@/components/cta-final";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <ServiceCards />
      <Stats />
      <CtaFinal />
    </main>
  );
}
