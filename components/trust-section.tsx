"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const HEADING_TEXT =
  "Gerencie os benefícios da sua empresa com confiança. A FBN entrega o controle, a confiabilidade e a expertise que sua empresa precisa.";
const HEADING_WORDS = HEADING_TEXT.split(" ");

// Reveal starts once the paragraph is 85% down the screen (just entering
// from the bottom). It ends exactly at STICKY_TOP_PX — the same offset the
// heading pins at — so the text finishes painting dark right as it locks
// into place.
const REVEAL_START_VH = 0.85;
const STICKY_TOP_PX = 96;
const HEADING_CARDS_GAP_PX = 32;
const LG_BREAKPOINT_PX = 1024;

// Exact scroll distance (in px) the pin lasts, once the heading reaches
// STICKY_TOP_PX. This used to be governed by CSS `position: sticky`'s own
// release math on both the heading and the card row — which turned out to
// be impossible to keep in sync (see git history): each sticky element's
// release point depends on its own height plus whatever content trails it,
// so two independently-sized sticky elements drift apart, and so does a
// third: the section *after* this one (ServiceCards) is plain document
// flow, keeps scrolling at 1:1 with the page throughout, and was measured
// catching up to and sliding underneath the pinned card row once the pin
// lasted long enough.
//
// Both problems have the same fix: don't let anything's "how long is this
// held" be an emergent property of CSS layout math. Pin the heading AND
// the card row with the same explicit JS-computed duration, and give the
// spacer *after* the card row that exact same duration in px (not a vh
// guess) — so the next section's natural document position, at the exact
// moment the pin ends, lines up flush with the card row's held position.
// (Algebraically: the spacer's contribution to "how far the next section
// has to travel" and the pin's own duration cancel out, as long as they're
// the literal same number — see PIN_SPACER_PX below.)
const PIN_DURATION_PX = 600;
const PIN_SPACER_PX = PIN_DURATION_PX;

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
    // Both elements' held offsets, plus the scrollY at which the pin
    // started (null until the heading first reaches STICKY_TOP_PX). All
    // three reset to their "not pinned yet" state whenever we scroll back
    // above the pin point, and get frozen (stop updating, but stay
    // applied) once PIN_DURATION_PX of scroll has passed since pin start.
    //
    // Deliberately never reads a transform back out of a measured rect
    // (an earlier version did: "current position minus what I applied
    // last time equals the natural position"). That's a feedback loop —
    // any tiny mismatch between "what I applied" and "what actually
    // rendered" (sub-pixel rounding, a layout read racing a not-yet-
    // settled paint) compounds frame over frame, and it visibly showed up
    // as the whole pinned block trembling in place. Instead, the two
    // natural document-flow positions are captured once, only while
    // nothing is pinned (so the elements carry no transform yet and the
    // measurement is unambiguous), and reused as pure constants for the
    // rest of the pin — every offset from then on is plain arithmetic
    // against `window.scrollY`, nothing ever measured back.
    let docTopHeading = 0;
    let docTopCards = 0;
    let pinStartScrollY = 0;
    let isPinned = false;

    function applyOffsets(headingOffsetPx: number, cardsOffsetPx: number) {
      const pEl = paragraphRef.current;
      const cardsEl = cardsRef.current;
      if (!pEl || !cardsEl) return;
      pEl.style.transform =
        headingOffsetPx === 0 ? "" : `translateY(${headingOffsetPx}px)`;
      cardsEl.style.transform =
        cardsOffsetPx === 0 ? "" : `translateY(${cardsOffsetPx}px)`;
    }

    function updatePin() {
      const pEl = paragraphRef.current;
      const cardsEl = cardsRef.current;
      if (!pEl || !cardsEl) return;

      if (window.innerWidth < LG_BREAKPOINT_PX) {
        isPinned = false;
        applyOffsets(0, 0);
        return;
      }

      if (!isPinned) {
        // No transform applied right now, so these rects ARE the true
        // natural positions — keep this refreshed every call up until
        // the instant pinning starts, so it's accurate even if layout
        // shifted (fonts loading, content above changing, etc.).
        docTopHeading = pEl.getBoundingClientRect().top + window.scrollY;
        docTopCards = cardsEl.getBoundingClientRect().top + window.scrollY;

        if (docTopHeading - window.scrollY > STICKY_TOP_PX) {
          applyOffsets(0, 0);
          return; // still above the pin point
        }
        isPinned = true;
        pinStartScrollY = window.scrollY;
      }

      if (docTopHeading - window.scrollY > STICKY_TOP_PX) {
        // Scrolled back up above the pin point — release.
        isPinned = false;
        applyOffsets(0, 0);
        return;
      }

      // Clamping the scrollY used for the offset math (not the real
      // window.scrollY) to the pin window folds "actively pinning" and
      // "held past the duration" into one formula: past the end, this
      // stays fixed at the value it had exactly at the boundary, so both
      // elements hang there motionless instead of being recomputed every
      // frame — no separate frozen-value bookkeeping needed.
      const effectiveScrollY = Math.min(
        window.scrollY,
        pinStartScrollY + PIN_DURATION_PX,
      );

      const headingOffsetPx =
        STICKY_TOP_PX - (docTopHeading - effectiveScrollY);
      const cardsTargetTop =
        STICKY_TOP_PX + pEl.offsetHeight + HEADING_CARDS_GAP_PX;
      const cardsOffsetPx =
        cardsTargetTop - (docTopCards - effectiveScrollY);

      applyOffsets(headingOffsetPx, cardsOffsetPx);
    }

    updatePin();
    // Direct calls, no requestAnimationFrame — rAF only fires while the
    // tab is actively compositing (confirmed missing entirely in this
    // project's dev/test environment), so a backgrounded tab would leave
    // this stuck.
    window.addEventListener("scroll", updatePin, { passive: true });
    window.addEventListener("resize", updatePin);
    return () => {
      window.removeEventListener("scroll", updatePin);
      window.removeEventListener("resize", updatePin);
    };
  }, []);

  useEffect(() => {
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
          className="mb-16 max-w-2xl bg-white text-2xl font-medium leading-snug sm:text-3xl lg:z-10 lg:mb-8"
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
        {/* Exactly PIN_DURATION_PX tall — see the comment on that constant
            for why this has to be the literal same number, not a vh
            guess, to line up with ServiceCards right after the pin
            releases. */}
        <div className="hidden lg:block" style={{ height: PIN_SPACER_PX }} />
      </div>
    </section>
  );
}
