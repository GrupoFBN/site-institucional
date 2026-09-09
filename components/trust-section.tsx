"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const HEADING_TEXT =
  "Gerencie os benefícios da sua empresa com confiança. A FBN entrega o controle, a confiabilidade e a expertise que sua empresa precisa.";
const HEADING_WORDS = HEADING_TEXT.split(" ");

// Reveal starts once the heading is 85% down the screen (just entering
// from the bottom). It ends exactly at STICKY_TOP_PX — the same offset the
// block pins at via CSS `sticky` (see `lg:top-24` below) — so the text
// finishes painting dark right as it locks into place.
const REVEAL_START_VH = 0.85;
const STICKY_TOP_PX = 96;

// How much scroll room sits after the pinned block, before ServiceCards.
// A `position: sticky` element releases once its containing block's
// remaining room drops below the element's own height + top offset — an
// earlier version had heading and card row as two SEPARATE sticky
// elements, each with a different height, which could never be made to
// release at the same scrollY (see git history: that's what caused cards
// sliding under the heading, then under ServiceCards). Now that heading +
// card row are one single wrapped block sharing one sticky element, there
// is only one release calculation, so this number just needs to be
// generous enough that the block gets a real pinned pause before handing
// off to ServiceCards — no cross-element sync to get right anymore.
const SETTLE_SPACER_VH = 40;

// Placeholder for the real GIFs, until those are ready: at rest each card
// is a plain gray box with a small icon; on hover the ENTIRE card becomes
// the media (an animated shimmer filling it edge to edge, standing in for
// a real GIF/video), with the title/description overlaid in white at the
// bottom — matching the reference's photo card. Swap the shimmer div for a
// real <img>/<video> when the assets land.
const POINTS = [
  {
    icon: Lock,
    title: "Confiança que você pode contar",
    description: "Corretora registrada e regulamentada pela SUSEP.",
  },
  {
    icon: Layers,
    title: "Confiabilidade de alto nível",
    description: "Atendimento dedicado do orçamento ao sinistro.",
  },
  {
    icon: Boxes,
    title: "Tudo em um só lugar",
    description: "Saúde, odontológico, vida e previdência com um só contato.",
  },
  {
    icon: TrendingUp,
    title: "Otimizações inclusas",
    description: "Negociação ativa para reduzir custo e melhorar cobertura.",
  },
  {
    icon: Zap,
    title: "Fácil de contratar",
    description: "Processo simples, do orçamento à assinatura.",
  },
];

export function TrustSection() {
  // Heading + card row are wrapped together and pinned as ONE element via
  // native CSS `position: sticky`. Three earlier versions tried to
  // reimplement "stay put while scrolling past" in JS — first as two
  // separately-sticky elements (their release timing couldn't be
  // synced), then as JS-computed `transform` following scroll events
  // (fixed the sync issue, but fighting the browser's own scroll
  // compositing frame by frame made the block visibly tremble during a
  // real scroll gesture, even after rAF-throttling the updates — a
  // symptom this sandbox's screenshot tooling can't feel, but is exactly
  // what CSS sticky exists to avoid). With everything as one block, the
  // original reason to avoid CSS sticky (two elements, two different
  // heights, un-syncable release points) no longer applies: there is
  // only one sticky element now, so there's nothing left to get out of
  // sync, and the browser's compositor holds it in place with zero JS
  // running per scroll frame — the trembling isn't structurally possible.
  const blockRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    function updateReveal() {
      const el = blockRef.current;
      // Guards against a zero-height viewport (an unsized/hidden iframe,
      // a devtools/embed edge case) — without it, start===end===0 makes
      // the progress division 0/0 (NaN), and every word would silently
      // stay dim forever since `i < NaN` is always false.
      if (!el || window.innerHeight === 0) return;
      const top = el.getBoundingClientRect().top;
      const start = window.innerHeight * REVEAL_START_VH;
      const progress = Math.min(
        1,
        Math.max(0, (start - top) / (start - STICKY_TOP_PX)),
      );
      setRevealedCount(Math.round(progress * HEADING_WORDS.length));
    }

    updateReveal();
    window.addEventListener("scroll", updateReveal, { passive: true });
    return () => window.removeEventListener("scroll", updateReveal);
  }, []);

  return (
    <section className="relative px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div
          ref={blockRef}
          className="bg-white lg:sticky lg:top-24 lg:z-10"
        >
          <p className="mb-16 max-w-2xl text-2xl font-medium leading-snug sm:text-3xl lg:mb-8">
            {HEADING_WORDS.map((word, i) => (
              <span
                key={i}
                className={`transition-colors duration-500 ${
                  i < revealedCount ? "text-gray-900" : "text-gray-300"
                }`}
              >
                {word}{" "}
              </span>
            ))}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {POINTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative h-64 overflow-hidden rounded-lg bg-gray-50 p-6"
              >
                <Icon className="h-5 w-5 text-gray-700 transition-opacity duration-300 group-hover:opacity-0" />

                {/* Placeholder "media" — becomes the whole card on hover */}
                <div className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-[linear-gradient(110deg,#f3f4f6,45%,#e5e7eb,55%,#f3f4f6)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Dark gradient so the overlaid text stays legible on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-white/80">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll room after the pinned block, before ServiceCards — see
            SETTLE_SPACER_VH above. */}
        <div
          className="hidden lg:block"
          style={{ height: `${SETTLE_SPACER_VH}vh` }}
        />
      </div>
    </section>
  );
}
