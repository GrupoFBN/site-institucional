"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const HEADING_TEXT =
  "Gerencie os benefícios da sua empresa com confiança. A FBN entrega o controle, a confiabilidade e a expertise que sua empresa precisa.";
const HEADING_WORDS = HEADING_TEXT.split(" ");

// Reveal window, in fractions of viewport height (measured from the
// paragraph's own top): starts painting words dark once the paragraph is
// 85% down the screen (just entering from the bottom), finishes once it's
// scrolled up to 35% down — so it paints while it's naturally being read,
// not immediately on enter or only right at the top.
const REVEAL_START_VH = 0.85;
const REVEAL_END_VH = 0.35;

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
      const end = window.innerHeight * REVEAL_END_VH;
      const progress = Math.min(1, Math.max(0, (start - top) / (start - end)));
      setRevealedCount(Math.round(progress * HEADING_WORDS.length));
    }

    updateReveal();
    window.addEventListener("scroll", updateReveal, { passive: true });
    return () => window.removeEventListener("scroll", updateReveal);
  }, []);

  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p
          ref={paragraphRef}
          className="mb-16 max-w-2xl text-2xl font-medium leading-snug sm:text-3xl"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg bg-gray-50 p-6 transition hover:bg-gray-100"
            >
              <Icon className="mb-10 h-5 w-5 text-gray-700" />
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
