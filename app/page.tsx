import { Hero } from "@/components/hero";
import { ServiceCards } from "@/components/service-cards";
import { Stats } from "@/components/stats";
import { CtaFinal } from "@/components/cta-final";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiceCards />
      <Stats />
      <CtaFinal />
      <Footer />
    </main>
  );
}
