"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Real client companies named in grupofbn.com.br's own testimonials
// section (confirmed live, 2026-10-01) — the only named clients that site
// publishes. "Dra. Fernanda / Médica" from that same section is a person,
// not a company, so she isn't included here.
export const PARTNER_GROUPS: string[][] = [
  ["Sorridents", "Além do Olhar"],
  ["GiO", "Hurst"],
  ["Buddha Spa", "Solargoup"],
  ["Nordex", "Dupps"],
  ["Liga Ventures"],
];

const ITEM_HEIGHT_PX = 24;
// Fixed per-position width, wide enough for the longest name ("Liga
// Ventures") at this text size. Without this, each position's width
// shrinks to fit whatever name is currently showing, and since the names
// have different lengths, the row's total width would change tick to
// tick. Right at the flex-wrap breakpoint, that was enough to sometimes
// overflow and wrap 1-2 positions onto a clipped second line, making them
// appear to randomly vanish.
const ITEM_WIDTH_PX = 160;
const FLIP_DURATION_MS = 600;
const STAGGER_MS = 300;
const PAUSE_AFTER_LAST_MS = 1000;
// One full flip cycle for a ticker with this many slots.
const cycleFor = (slots: number) => (slots - 1) * STAGGER_MS + FLIP_DURATION_MS + PAUSE_AFTER_LAST_MS;

// How much scroll distance it takes to go from "pulled up, overlapping the
// hero" to "settled at its normal spot on the page". Matches the strip's
// own height by default (measured on mount) so it starts flush with the
// hero's bottom edge, but this caps how far you have to scroll before it
// locks — pure scroll distance, not the strip's height, so a taller strip
// wouldn't need more scrolling to settle.
const SETTLE_SCROLL_PX = 220;
// Below this width the hero's heading/subtitle wrap onto enough extra
// lines that its centered content sits much closer to the hero's own
// bottom edge than on desktop, with no headroom left for the strip's
// "pulled up, overlapping the hero" illusion — it was landing directly on
// top of the CTA button instead of the empty background below it. The
// trick is purely decorative (`aria-hidden`), so below this width it's
// simply skipped: the strip starts already settled at its normal
// document position instead of risking the overlap.
const NARROW_VIEWPORT_PX = 1024;
// Extra gap between the hero and where the strip finally locks, so it
// settles a bit below the hero's edge instead of landing flush against it.
// The starting (pulled-up, over-the-video) position is unaffected — see
// fullPullUpPx below, which pulls up by this much extra to compensate.
const SETTLE_GAP_PX = 40;
// Fallback used for the very first paint, before the real height is
// measured — avoids a visible jump once the effect measures the actual
// element and corrects it (matches this strip's typical rendered height).
const DEFAULT_PULL_PX = 72 + SETTLE_GAP_PX;

function PartnerSlot({
  items,
  offsetMs,
  originTime,
  settled,
  cycleMs,
  logos,
  flatLogos,
  itemHeight,
  logoScale,
}: {
  items: string[];
  offsetMs: number;
  originTime: number;
  settled: boolean;
  cycleMs: number;
  logos?: Record<string, string>;
  flatLogos?: Record<string, string>;
  // Any CSS length (numbers are px).
  itemHeight: number | string;
  logoScale?: Record<string, number>;
}) {
  const rowHeight = typeof itemHeight === "number" ? `${itemHeight}px` : itemHeight;
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);
  const displayItems = [...items, items[0]];

  useEffect(() => {
    // WCAG 2.2.2 (Pause, Stop, Hide): this ticker has no pause control, so
    // honor the OS-level motion preference instead — skip scheduling
    // entirely and let the slot render its first item statically.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let tickTimeout: ReturnType<typeof setTimeout>;
    let resetTimeout: ReturnType<typeof setTimeout>;
    // Only the very first call (mount) may target k=0 — a reschedule after
    // an actual fire must always jump to a strictly later cycle. Without
    // this distinction, position A (offsetMs=0) reads as already "past"
    // its own k=0 slot the instant its effect runs (any render/commit lag
    // at all makes `now` a hair after originTime+0), so it always skipped
    // straight to k=1 and lost a whole cycle on first paint — while B/C/D/E
    // have enough offset headroom to never trip the same check.
    let hasFiredOnce = false;

    // Each tick is scheduled against the absolute origin clock (originTime +
    // offsetMs + k*CYCLE_MS), not "wait CYCLE_MS from whenever the last
    // callback happened to run" — the latter drifts, since setTimeout
    // callbacks fire a little late and those small delays compound every
    // cycle, eventually pulling the 5 positions' stagger out of sync.
    function scheduleNextTick() {
      const now = performance.now();
      const sinceFirstFire = now - (originTime + offsetMs);
      const cyclesElapsed =
        sinceFirstFire < 0
          ? 0
          : Math.floor(sinceFirstFire / cycleMs) + (hasFiredOnce ? 1 : 0);
      const nextFireAt = originTime + offsetMs + cyclesElapsed * cycleMs;

      tickTimeout = setTimeout(() => {
        hasFiredOnce = true;
        setAnimated(true);
        // The snap-back-to-0 (once we've scrolled to the duplicate-of-first
        // item at index items.length) is scheduled right here, in the same
        // timer chain as the tick itself — not in a separate effect keyed
        // off `index`. Two independently-scheduled timers racing to update
        // the same index is exactly how it could end up incremented past
        // items.length (e.g. a backgrounded tab delaying one timer but not
        // the other): translateY would then scroll past the last stacked
        // name into genuinely empty space, rendering that position blank.
        setIndex((current) => {
          const next = current + 1;
          if (next === items.length) {
            resetTimeout = setTimeout(() => {
              setAnimated(false);
              setIndex(0);
            }, FLIP_DURATION_MS);
          }
          return next;
        });
        scheduleNextTick();
      }, Math.max(0, nextFireAt - now));
    }

    scheduleNextTick();

    return () => {
      clearTimeout(tickTimeout);
      clearTimeout(resetTimeout);
    };
  }, [offsetMs, originTime, items.length, cycleMs]);

  return (
    <div
      className="overflow-hidden"
      style={{ height: rowHeight, width: logos ? `calc(${rowHeight} * 4 / 3)` : ITEM_WIDTH_PX }}
    >
      <div
        style={{
          // Clamped defensively: displayItems only has items.length + 1
          // entries (0..items.length), so an out-of-range index would
          // scroll past the last stacked name into empty space instead of
          // erroring — clamping keeps that a visual no-op rather than a
          // blank position.
          transform: `translateY(calc(${rowHeight} * -${Math.min(index, items.length)}))`,
          transitionProperty: "transform",
          transitionDuration: animated ? `${FLIP_DURATION_MS}ms` : "0ms",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        {displayItems.map((name, i) =>
          logos?.[name] ? (
            // Logo mode: over the hero photo every logo is flattened to
            // white; once the strip settles on the page they get their own
            // colors back.
            <div key={i} style={{ height: rowHeight }} className="flex items-center justify-center">
              <div
                className="relative"
                style={{ height: rowHeight, width: rowHeight, transform: `scale(${logoScale?.[name] ?? 1})` }}
              >
                {/* Some marks have white parts (a smile) that would fill in
                    solid once flattened to white. Those get a second file
                    with the white cut out, shown over the hero; the original
                    takes over when the strip settles. */}
                {flatLogos?.[name] && (
                  <Image
                    src={flatLogos[name]}
                    alt=""
                    width={160}
                    height={160}
                    loading="eager"
                    className={`absolute inset-0 h-full w-full object-contain transition duration-300 ${
                      settled ? "opacity-0" : "opacity-80 brightness-0 invert"
                    }`}
                  />
                )}
                <Image
                  src={logos[name]}
                  alt=""
                  width={160}
                  height={160}
                  // The slot clips everything below its current logo, so lazy
                  // loading would never fetch the next ones and each flip would
                  // land on an empty space.
                  loading="eager"
                  className={`h-full w-full object-contain transition duration-300 ${
                    flatLogos?.[name] ? "absolute inset-0" : ""
                  } ${settled ? "opacity-100" : flatLogos?.[name] ? "opacity-0" : "opacity-80 brightness-0 invert"}`}
                />
              </div>
            </div>
          ) : (
            <div
              key={i}
              style={{ height: rowHeight }}
              className={`flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                settled ? "text-black" : "text-white/70"
              }`}
            >
              {name}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// `groups` defaults to the home page's clients; the Franquia Protegida page
// passes its own. With `logos` (name -> image URL) a slot shows the logo
// instead of the name, at `itemHeight` px tall.
export function PartnerLogos({
  groups = PARTNER_GROUPS,
  logos,
  itemHeight = ITEM_HEIGHT_PX,
  logoScale,
  flatLogos,
}: {
  groups?: string[][];
  logos?: Record<string, string>;
  // Alternate files used while the logos are flattened to white over the hero.
  flatLogos?: Record<string, string>;
  itemHeight?: number | string;
  // Per-logo size correction (1 = as is). Logo files carry very different
  // amounts of empty margin, so equal boxes make some marks look tiny.
  logoScale?: Record<string, number>;
}) {
  // Shared clock origin — all 5 positions schedule their ticks relative to
  // this single timestamp so their stagger stays exact over time, instead
  // of each position drifting independently.
  const [originTime] = useState(() => performance.now());

  const sectionRef = useRef<HTMLElement>(null);
  const [pullUpPx, setPullUpPx] = useState(DEFAULT_PULL_PX);
  // Once fully settled (off the video, at its normal page position), the
  // logos switch from light text (readable over the photo) to black
  // (readable over the page background it lands on).
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Pulled up by its own height, it starts flush with the hero's bottom
    // edge (looks attached to the video). As the page scrolls, pullUpPx
    // eases to 0 — a real change to the section's own layout position on
    // the page, not a viewport-relative "sticky" pin — so once it reaches
    // 0 it's just sitting at its normal spot in the document, unaffected
    // by any further scrolling.
    function updatePullUp() {
      // Measured on every update: with fluid logo sizes the strip's height
      // changes with the window.
      const fullPullUpPx = (el as HTMLElement).offsetHeight + SETTLE_GAP_PX;
      if (window.innerWidth < NARROW_VIEWPORT_PX) {
        setPullUpPx(0);
        setSettled(true);
        return;
      }
      const progress = Math.min(1, window.scrollY / SETTLE_SCROLL_PX);
      setPullUpPx(fullPullUpPx * (1 - progress));
      setSettled(progress >= 1);
    }

    updatePullUp();
    // Direct call, no requestAnimationFrame throttling — rAF only fires
    // while the tab is actively compositing, so a backgrounded/inactive
    // tab would leave this permanently stuck at its last value. The
    // handler itself is cheap (one division, one setState), so there's
    // no real cost to running it on every scroll event.
    function onScroll() {
      updatePullUp();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updatePullUp, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updatePullUp);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      style={{
        transform: `translateY(-${pullUpPx}px)`,
        marginTop: SETTLE_GAP_PX,
      }}
      className="relative z-10 px-6 py-6 pointer-events-none sm:px-10"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {groups.map((items, i) => (
          <PartnerSlot
            key={i}
            items={items}
            offsetMs={i * STAGGER_MS}
            originTime={originTime}
            settled={settled}
            cycleMs={cycleFor(groups.length)}
            logos={logos}
            flatLogos={flatLogos}
            itemHeight={itemHeight}
            logoScale={logoScale}
          />
        ))}
      </div>
    </section>
  );
}
