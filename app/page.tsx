import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
import { ServiceCards } from "@/components/service-cards";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <ServiceCards />
    </main>
  );
}
