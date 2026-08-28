"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const IMAGES = [
  "https://picsum.photos/seed/fbn-hero-1/1920/1080",
  "https://picsum.photos/seed/fbn-hero-2/1920/1080",
  "https://picsum.photos/seed/fbn-hero-3/1920/1080",
  "https://picsum.photos/seed/fbn-hero-4/1920/1080",
  "https://picsum.photos/seed/fbn-hero-5/1920/1080",
];

const INTERVAL_MS = 6000;

export function HeroImageRoll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % IMAGES.length;
      });
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover ${
              index === activeIndex || index === prevIndex
                ? "animate-kenburns"
                : ""
            }`}
            style={
              index === activeIndex && paused
                ? { animationPlayState: "paused" }
                : undefined
            }
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/50" />
      <button
        type="button"
        onClick={() => setPaused((current) => !current)}
        className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        aria-label={paused ? "Retomar apresentação" : "Pausar apresentação"}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
