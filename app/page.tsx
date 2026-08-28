import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
import { ServiceCards } from "@/components/service-cards";
import { Stats } from "@/components/stats";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <ServiceCards />
      <Stats />
    </main>
  );
}
