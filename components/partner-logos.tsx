"use client";

import { useEffect, useRef, useState } from "react";

const PARTNER_GROUPS: string[][] = [
  ["Seguradora 1", "Seguradora 2", "Seguradora 3", "Seguradora 4", "Seguradora 5"],
  ["Seguradora 6", "Seguradora 7", "Seguradora 8", "Seguradora 9", "Seguradora 10"],
  ["Seguradora 11", "Seguradora 12", "Seguradora 13", "Seguradora 14", "Seguradora 15"],
  ["Seguradora 16", "Seguradora 17", "Seguradora 18", "Seguradora 19", "Seguradora 20"],
  ["Seguradora 21", "Seguradora 22", "Seguradora 23", "Seguradora 24", "Seguradora 25"],
];

const ITEM_HEIGHT_PX = 24;
// Fixed per-position width, wide enough for the longest name ("Seguradora
// 25") at this text size. Without this, each position's width shrinks to
// fit whatever name is currently showing — and since names have different
// digit counts (1-9 vs 10-25), the row's total width changes tick to tick.
// Right at the flex-wrap breakpoint, that was enough to sometimes overflow
// and wrap 1-2 positions onto a clipped second line, making them appear to
// randomly vanish.
const ITEM_WIDTH_PX = 132;
const FLIP_DURATION_MS = 600;
const STAGGER_MS = 300;
const PAUSE_AFTER_LAST_MS = 1000;
const CYCLE_MS =
  (PARTNER_GROUPS.length - 1) * STAGGER_MS + FLIP_DURATION_MS + PAUSE_AFTER_LAST_MS;

// How much scroll distance it takes to go from "pulled up, overlapping the
// hero" to "settled at its normal spot on the page". Matches the strip's
// own height by default (measured on mount) so it starts flush with the
// hero's bottom edge, but this caps how far you have to scroll before it
// locks — pure scroll distance, not the strip's height, so a taller strip
// wouldn't need more scrolling to settle.
const SETTLE_SCROLL_PX = 220;
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
}: {
  items: string[];
  offsetMs: number;
  originTime: number;
  settled: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);
  const displayItems = [...items, items[0]];

  useEffect(() => {
    let tickTimeout: ReturnType<typeof setTimeout>;

    // Each tick is scheduled against the absolute origin clock (originTime +
    // offsetMs + k*CYCLE_MS), not "wait CYCLE_MS from whenever the last
    // callback happened to run" — the latter drifts, since setTimeout
    // callbacks fire a little late and those small delays compound every
    // cycle, eventually pulling the 5 positions' stagger out of sync.
    function scheduleNextTick() {
      const now = performance.now();
      const sinceFirstFire = now - (originTime + offsetMs);
      const cyclesElapsed =
        sinceFirstFire < 0 ? 0 : Math.floor(sinceFirstFire / CYCLE_MS) + 1;
      const nextFireAt = originTime + offsetMs + cyclesElapsed * CYCLE_MS;

      tickTimeout = setTimeout(() => {
        setAnimated(true);
        setIndex((current) => current + 1);
        scheduleNextTick();
      }, Math.max(0, nextFireAt - now));
    }

    scheduleNextTick();

    return () => clearTimeout(tickTimeout);
  }, [offsetMs, originTime]);

  useEffect(() => {
    if (index !== items.length) return;
    const resetTimeout = setTimeout(() => {
      setAnimated(false);
      setIndex(0);
    }, FLIP_DURATION_MS);
    return () => clearTimeout(resetTimeout);
  }, [index, items.length]);

  return (
    <div
      className="overflow-hidden"
      style={{ height: ITEM_HEIGHT_PX, width: ITEM_WIDTH_PX }}
    >
      <div
        style={{
          transform: `translateY(-${index * ITEM_HEIGHT_PX}px)`,
          transitionProperty: "transform",
          transitionDuration: animated ? `${FLIP_DURATION_MS}ms` : "0ms",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        {displayItems.map((name, i) => (
          <div
            key={i}
            style={{ height: ITEM_HEIGHT_PX }}
            className={`flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
              settled ? "text-black" : "text-white/70"
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos() {
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
    const fullPullUpPx = el.offsetHeight + SETTLE_GAP_PX;

    function updatePullUp() {
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        transform: `translateY(-${pullUpPx}px)`,
        marginTop: SETTLE_GAP_PX,
      }}
      className="relative z-10 px-6 py-6 pointer-events-none sm:px-10"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {PARTNER_GROUPS.map((items, i) => (
          <PartnerSlot
            key={i}
            items={items}
            offsetMs={i * STAGGER_MS}
            originTime={originTime}
            settled={settled}
          />
        ))}
      </div>
    </section>
  );
}
