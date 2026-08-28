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
  startOffsetMs,
}: {
  items: string[];
  startOffsetMs: number;
}) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);
  const displayItems = [...items, items[0]];

  useEffect(() => {
    let tickTimeout: ReturnType<typeof setTimeout>;

    function scheduleTick(delay: number) {
      tickTimeout = setTimeout(() => {
        setAnimated(true);
        setIndex((current) => current + 1);
        scheduleTick(CYCLE_MS);
      }, delay);
    }

    scheduleTick(startOffsetMs);

    return () => clearTimeout(tickTimeout);
  }, [startOffsetMs]);

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
            className="flex items-center justify-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-white/70"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos() {
  return (
    <div className="relative z-10 px-6 py-6 pointer-events-none sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {PARTNER_GROUPS.map((items, i) => (
          <PartnerSlot key={i} items={items} startOffsetMs={i * STAGGER_MS} />
        ))}
      </div>
    </div>
  );
}
