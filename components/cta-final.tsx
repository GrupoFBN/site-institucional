import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrazilOrbit } from "@/components/brazil-orbit";

export function CtaFinal() {
  return (
    <section id="cta-final" className="bg-brand-dark px-6 py-24 text-white sm:px-10 lg:py-32">
      {/* Left column: sticky heading with its OWN containing block (heading
          + spacer only — same pattern as trust-section.tsx), then the map
          in a SEPARATE containing block right after. A plain sibling in
          the same containing block as a sticky element ends up scrolling
          up through the sticky element's pinned screen band while it's
          still stuck (its document position keeps receding under scroll
          while the sticky element's screen position doesn't move) — that's
          what "map entering the text" was. Splitting them into two
          containing blocks means the map simply starts wherever normal
          flow puts it, only once the heading's own block has run out of
          room and released. Card is a separate column entirely (different
          x-range), so it was never part of this problem. */}
      {/* Capped at max-w-7xl, matching every other section's container —
          without a cap this row had nothing to push against, so at wide
          viewports `justify-between` shoved the map and the card out to
          the far edges and left a huge dead gap between them instead of
          the two halves sitting close together like Adyen's reference. */}
      <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div>
            <div className="lg:sticky lg:top-24">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Pronto pra proteger sua empresa? Deixe os seguros e
                benefícios nas mãos de quem entende do assunto.
              </h2>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="mt-8 border-white bg-transparent text-white hover:bg-white hover:text-brand-dark"
              >
                <Link href="#contato" aria-label="Fale com a gente sobre seguros e benefícios">
                  Fale com a gente
                </Link>
              </Button>
            </div>
            {/* Scroll room after the pinned heading, before the map. */}
            <div className="hidden h-[30vh] lg:block" />
          </div>

          <div className="mt-16 max-w-2xl">
            <BrazilOrbit />
          </div>
        </div>

        {/* Sticky, same as the heading in the left column — this card is a
            genuinely separate flex column (different x-range), not nested
            inside the heading's own containing block, so it's exempt from
            the Separate Containing Block Rule's warning. Pinning it here
            instead of stretching its own content with a fixed magic-number
            margin to reach the map's height is what actually fixes "the
            card looks empty": the card is just as tall as its real
            content now, nothing more. */}
        <div className="w-full max-w-lg lg:sticky lg:top-24">
          <div className="rounded-lg border border-white/15 p-8">
            {/* Real numbers (confirmed live on grupofbn.com.br, 2026-10-01 —
                see PRODUCT.md "Evidence on Hand"). "23+" uses the site's own
                "desde 2002" testimonials-section claim, not its conflicting
                "desde 1996" one elsewhere — unresolved until the user
                confirms which date is correct. Woven into a sentence
                instead of a kicker label + 3-up stat-tile grid: both are
                banned template defaults (eyebrow-over-heading, and the
                big-number/small-label/accent scaffold) regardless of how
                real the numbers themselves are. */}
            <p className="border-b border-white/15 pb-6 text-lg leading-relaxed">
              <span className="font-bold">23+</span> anos de mercado, mais de{" "}
              <span className="font-bold">1.200</span> empresas e{" "}
              <span className="font-bold">10 mil</span> clientes confiam na FBN.
            </p>
            {/* Geographic reach, next to a literal map of Brazil — ties
                directly to what's visually alongside the card instead of
                repeating the header's service-line nav out of context. */}
            <div className="mt-6 flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold">Presente em quase todo o Brasil</p>
                <p className="mt-1 text-sm text-white/60">22 estados e mais de 220 cidades atendidas.</p>
              </div>
            </div>
            {/* Real, confirmed — see PRODUCT.md "Capabilities and
                Constraints". Same trust-section.tsx claim, repeated here
                because this card is the other place on the page already
                talking about credibility. */}
            <div className="mt-5 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold">Corretora registrada na SUSEP</p>
                <p className="mt-1 text-sm text-white/60">
                  Regulamentada e fiscalizada, não só mais uma promessa de confiança.
                </p>
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-semibold">Cuidamos de tudo pra você</h3>
            <p className="mt-3 text-white/70">
              Do orçamento à renovação, acompanhamento próximo e especializado
              em seguros, benefícios corporativos e serviços financeiros.
            </p>
            <Link
              href="#servicos"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
            >
              Conheça nossos serviços
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
