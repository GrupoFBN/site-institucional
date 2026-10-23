import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
import { TrustSection } from "@/components/trust-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { StoriesSection } from "@/components/stories-section";
import { StatsSection } from "@/components/stats-section";
import { CtaFinal } from "@/components/cta-final";
import { ClosingCta } from "@/components/closing-cta";
import { NextSection } from "@/components/next-section";
import { Footer } from "@/components/footer";
import { STRUCTURED_DATA } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* `<` is escaped so no string inside the data can close the tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c"),
        }}
      />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <PartnerLogos />
        <TrustSection />
        <CtaFinal />
        <TestimonialsSection />
        <NextSection />
        <StatsSection />
        <StoriesSection />
        <ClosingCta />
      </main>
      {/* Outside <main> so the footer is its own landmark (contentinfo). */}
      <Footer />
    </>
  );
}
