"use client";

import { useEffect, useState } from "react";

const PARTNER_GROUPS: string[][] = [
  ["Seguradora 1", "Seguradora 2", "Seguradora 3", "Seguradora 4", "Seguradora 5"],
  ["Seguradora 6", "Seguradora 7", "Seguradora 8", "Seguradora 9", "Seguradora 10"],
  ["Seguradora 11", "Seguradora 12", "Seguradora 13", "Seguradora 14", "Seguradora 15"],
  ["Seguradora 16", "Seguradora 17", "Seguradora 18", "Seguradora 19", "Seguradora 20"],
  ["Seguradora 21", "Seguradora 22", "Seguradora 23", "Seguradora 24", "Seguradora 25"],
];

const ITEM_HEIGHT_PX = 24;
const FLIP_DURATION_MS = 600;
const STAGGER_MS = 300;
const PAUSE_AFTER_LAST_MS = 1000;
const CYCLE_MS =
  (PARTNER_GROUPS.length - 1) * STAGGER_MS + FLIP_DURATION_MS + PAUSE_AFTER_LAST_MS;

function PartnerSlot({
  items,
  offsetMs,
  originTime,
}: {
  items: string[];
  offsetMs: number;
  originTime: number;
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
    <div className="overflow-hidden" style={{ height: ITEM_HEIGHT_PX }}>
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
            className="flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-gray-400"
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

  return (
    <section className="bg-gray-50 px-6 py-12 sm:px-10">
      <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
        Seguradoras parceiras
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {PARTNER_GROUPS.map((items, i) => (
          <PartnerSlot
            key={i}
            items={items}
            offsetMs={i * STAGGER_MS}
            originTime={originTime}
          />
        ))}
      </div>
    </section>
  );
}
