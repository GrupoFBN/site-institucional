import type { Metadata } from "next";
import { FpWhatIs } from "@/components/fp-what-is";
import { FpWhatsapp } from "@/components/fp-whatsapp";
import { PartnerLogos } from "@/components/partner-logos";
import { CLIENTS, clientSrc, FpCases, FpContact, FpFooter, FpHero, FpMoments, sora } from "@/components/franquia-protegida";

// The program's clients, spread over the five ticker slots the home page
// uses, shown as their logos.
const CLIENT_GROUPS = [
  ["Odontoclinic", "Maislaser", "Amo Vacinas"],
  ["Onodera", "Oral Unic", "Olhar Certo"],
  ["Market4u", "OdontoSpecial", "GIO Estética Avançada"],
  ["LAAV", "Sorridents"],
  // DryWash is left out on purpose: its logo is a gray label with dark
  // text, which turns into a plain white block once flattened to white.
  ["Além do Olhar", "Sorrix"],
];
// Visual size corrections: each file has its own empty margin, so the same
// box makes some marks look small and others large.
const LOGO_SCALE: Record<string, number> = {
  "GIO Estética Avançada": 0.85,
  "Além do Olhar": 1.5,
  Sorridents: 1.35,
  Odontoclinic: 1.3,
  "Oral Unic": 1.3,
  // Wide mark (3:1) inside a square box: widen it to the slot.
  Sorrix: 1.3,
};
// Logos scale with the window: 64px on small laptops, 100px on wide screens.
const LOGO_HEIGHT = "clamp(64px, 5vw, 100px)";
// Over the hero every logo turns white. Sorridents' smile is white too and
// would fill in, so it has a copy with the smile cut out.
const FLAT_LOGOS = { Sorridents: "/clients/sorridents-hero.png" };
const CLIENT_LOGOS = Object.fromEntries(CLIENTS.map((client) => [client.name, clientSrc(client)]));

const DESCRIPTION =
  "O primeiro programa de prevenção e proteção para franqueadores e franqueados. Mitigação de riscos e seguros customizados para a sua rede de franchising.";

export const metadata: Metadata = {
  title: "Franquia Protegida",
  description: DESCRIPTION,
  alternates: { canonical: "/franquia-protegida" },
  openGraph: { url: "/franquia-protegida", title: "Franquia Protegida | Grupo FBN", description: DESCRIPTION },
};

export default function FranquiaProtegidaPage() {
  return (
    <>
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <FpHero />
        {/* Same ticker as the home page: it starts over the bottom of the
            hero and settles below it on scroll. The backdrop gives it the
            page color once it has settled. */}
        <div className="flow-root bg-[#F6F5F4]">
          <PartnerLogos groups={CLIENT_GROUPS} logos={CLIENT_LOGOS} itemHeight={LOGO_HEIGHT} logoScale={LOGO_SCALE} flatLogos={FLAT_LOGOS} />
        </div>
        {/* Below the hero the page uses the program's own typeface (Sora). */}
        <div className={sora.className}>
          <FpWhatIs />
          <FpMoments />
          <FpCases />
          <FpContact />
        </div>
      </main>
      <div className={sora.className}>
        <FpFooter />
      </div>
      <FpWhatsapp />
    </>
  );
}
