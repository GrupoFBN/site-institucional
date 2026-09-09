"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const HEADING_TEXT =
  "Gerencie os benefícios da sua empresa com confiança. A FBN entrega o controle, a confiabilidade e a expertise que sua empresa precisa.";
const HEADING_WORDS = HEADING_TEXT.split(" ");

// Reveal starts once the paragraph is 85% down the screen (just entering
// from the bottom). It ends exactly at STICKY_TOP_PX — the same offset the
// paragraph goes `sticky` at — so the text finishes painting dark right as
// it locks into place.
const REVEAL_START_VH = 0.85;
const STICKY_TOP_PX = 96; // matches the `top-24` class below
// Gap between the pinned heading's bottom edge and the pinned card row's
// top edge, once both are held on screen together.
//
// Cards are NOT CSS `sticky` — that was tried and measurably doesn't work
// for this pair. A sticky element releases once its OWN containing
// block's remaining room (below current scroll) drops below its OWN
// height + top offset. The heading's release depends on the room *after*
// it (gap + card row + spacer); the card row's release only has the
// spacer after it — strictly less room, so by that formula the (taller)
// card row was provably guaranteed to release before the heading, no
// matter how large the spacer got (verified live: at 60vh spacer the
// heading held until scrollY≈1700 while the cards row let go by
// scrollY≈1400, sliding back through/under the still-pinned heading
// during the gap). Two independent CSS sticky elements can't be forced
// to release in lockstep when one is taller than the other by more than
// the shared trailing space allows.
//
// Instead, the heading alone stays CSS `sticky` (that part is simple and
// already correct), and the card row is normal-flow with a JS-computed
// `transform: translateY()` that cancels its natural scroll motion for
// exactly as long as the heading is pinned (detected by reading the
// heading's own rendered `top`, not by re-deriving the release math
// independently) — see the effect below.
// (Includes ~15px of margin absorbing a small, constant gap-narrowing
// measured live during the release transition — the instant the heading's
// CSS sticky lets go, the two are no longer both driven by the identical
// mechanism for one frame, so the gap isn't pixel-perfect right at that
// boundary. 32px alone measured as an actual, if brief, overlap there.)
const HEADING_CARDS_GAP_PX = 48;

// Extra scroll room after the card row, so the pinned pair — heading +
// cards — stays on screen for a beat before releasing into the next
// section, instead of releasing the instant the cards arrive.
const SETTLE_SPACER_VH = 40;
const LG_BREAKPOINT_PX = 1024;

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
  const cardsRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    // Holds the card row's screen position steady for exactly as long as
    // the heading is pinned. `frozenOffsetPx` is the translateY currently
    // applied: 0 before the heading ever pins, recomputed every frame
    // while it's pinned (canceling the row's natural scroll motion), and
    // then held constant once the heading releases — so the row resumes
    // scrolling smoothly from wherever it was, with no jump.
    let frozenOffsetPx = 0;

    function updatePin() {
      const pEl = paragraphRef.current;
      const cardsEl = cardsRef.current;
      if (!pEl || !cardsEl) return;

      if (window.innerWidth < LG_BREAKPOINT_PX) {
        // Below lg the heading isn't `sticky` at all (see its className) —
        // cards stay in plain normal flow.
        frozenOffsetPx = 0;
        cardsEl.style.transform = "";
        return;
      }

      const pTop = pEl.getBoundingClientRect().top;

      if (Math.abs(pTop - STICKY_TOP_PX) < 1) {
        // Pinned right now. Back last frame's offset out of the row's
        // current measured position to recover where it'd be with no
        // transform at all, then compute the new offset needed to hold
        // it at the target. Measures the heading's height fresh here
        // (not via ResizeObserver — that never fired at all in testing,
        // apparently gated behind active compositing the same way
        // requestAnimationFrame was elsewhere in this file; reading it
        // inside this handler ties it to the same scroll/resize events
        // already proven to fire reliably).
        const cardsTargetTop =
          STICKY_TOP_PX + pEl.offsetHeight + HEADING_CARDS_GAP_PX;
        const naturalScreenTop =
          cardsEl.getBoundingClientRect().top - frozenOffsetPx;
        frozenOffsetPx = cardsTargetTop - naturalScreenTop;
        cardsEl.style.transform = `translateY(${frozenOffsetPx}px)`;
      } else if (pTop > STICKY_TOP_PX) {
        // Genuinely hasn't reached the pin point yet (or scrolled back
        // above it) — no offset.
        frozenOffsetPx = 0;
        cardsEl.style.transform = "";
      } else {
        // pTop < STICKY_TOP_PX: the heading has released and is
        // scrolling away. Keep the last offset constant so the row
        // continues from exactly where it was held, not a fresh 0.
        cardsEl.style.transform = `translateY(${frozenOffsetPx}px)`;
      }
    }

    updatePin();
    // Direct calls, no requestAnimationFrame — same reasoning as the
    // word-reveal effect below: rAF only fires while the tab is actively
    // compositing.
    window.addEventListener("scroll", updatePin, { passive: true });
    window.addEventListener("resize", updatePin);
    return () => {
      window.removeEventListener("scroll", updatePin);
      window.removeEventListener("resize", updatePin);
    };
  }, []);

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
          className="mb-16 max-w-2xl bg-white text-2xl font-medium leading-snug sm:text-3xl lg:sticky lg:top-24 lg:z-10 lg:mb-8"
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
        <div
          ref={cardsRef}
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
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
        {/* Keeps the pinned heading+cards pair on screen for a beat before
            releasing into the next section — see SETTLE_SPACER_VH above. */}
        <div
          className="hidden lg:block"
          style={{ height: `${SETTLE_SPACER_VH}vh` }}
        />
      </div>
    </section>
  );
}
