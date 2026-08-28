"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const HEADING_TEXT =
  "Gerencie os benefícios da sua empresa com confiança. A FBN entrega o controle, a confiabilidade e a expertise que sua empresa precisa.";
const HEADING_WORDS = HEADING_TEXT.split(" ");

// Reveal starts once the paragraph is 85% down the screen (just entering
// from the bottom). It ends exactly at STICKY_TOP_PX — the same offset the
// paragraph goes `sticky` at — so the text finishes painting dark right as
// it locks into place, then stays fully painted while the cards below
// scroll up into view underneath it (the spacer below provides that scroll
// room; the paragraph's on-screen position is otherwise constant while
// stuck, so a scroll-linked effect keyed off its position has to target
// the same offset it sticks at, or it would never reach 100%).
const REVEAL_START_VH = 0.85;
const STICKY_TOP_PX = 96; // matches the `top-24` class below

// How much empty scroll room sits between the pinned heading and the
// cards — this is what the user scrolls "through" while the heading stays
// put and the cards rise into view from below the fold.
const PIN_SPACER_VH = 45;

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
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    // Direct call on every scroll event, no requestAnimationFrame — rAF
    // only fires while the tab is actively compositing, so a backgrounded
    // tab would leave this stuck (same class of bug already hit and fixed
    // in the partner-logos scroll effect).
    function updateReveal() {
      const el = paragraphRef.current;
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
        <p
          ref={paragraphRef}
          className="sticky top-24 z-10 max-w-2xl bg-white text-2xl font-medium leading-snug sm:text-3xl"
        >
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
        {/* Scroll room the heading pins through — this is what gets
            "consumed" while the cards rise into view underneath it. */}
        <div style={{ height: `${PIN_SPACER_VH}vh` }} />
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
    </section>
  );
}
