"use client";

import { useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

// The "FRANQUIA PROTEGIDA" beside the logo is Montserrat Bold on the current
// site; loaded here only, for this lockup.
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

const NAV = [
  { href: "#o-que-e", label: "O que é" },
  { href: "#galeria", label: "Galeria" },
  { href: "#cases", label: "Depoimentos" },
];

// The header is sized in em from one font size, 14px up to the lg breakpoint
// and then fluid with the window (12px at ~1240px wide, 18px on wide
// screens), so logo, links and button grow and shrink together.
const SIZE = "text-[14px] lg:text-[clamp(12px,0.97vw,18px)]";
// A size container, so the lockup below can be sized from the row's width.
const ROW = "@container mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6";
const buttonClass =
  "inline-flex h-[3.43em] shrink-0 items-center whitespace-nowrap rounded-lg bg-white px-[0.71em] font-semibold text-brand-dark transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-[1.71em]";
// Below sm the lockup (about 16.4em wide) shrinks with the row so it always
// leaves room for the gap and the button (12px + ~132px); 17.5 instead of
// 16.4 is a safety margin. Everything in it is in em, so it scales as one
// piece and keeps its inner alignment. Full size from ~420px wide.
const FIT = "text-[length:min(1em,calc((100cqw_-_144px)/17.5))] sm:text-[length:1em]";

// The file is only the "fbn" lettering; "Franquia Protegida" sits beside it
// as text, as on the current site.
function Lockup({ logoSrc, className = "" }: { logoSrc: string; className?: string }) {
  return (
    <span className={`flex items-center gap-[0.71em] ${className}`}>
      <Image src={logoSrc} alt="" width={1748} height={747} priority className="h-[2.857em] w-auto" />
      {/* Two lines of 1.43em = 2.857em, the same height as the logo. */}
      <span className={`${montserrat.className} relative top-[0.214em] text-[1.43em] font-bold leading-[1]`}>
        FRANQUIA
        <br />
        PROTEGIDA
      </span>
    </span>
  );
}

// Only the logo follows the page: it is fixed to the top, while the menu and
// the button belong to the hero and scroll away with it. Over the hero photo
// the logo is bare; once it has left the hero it gets a dark, blurred chip so
// the white lettering stays readable over the light sections.
export function FpHeader({ logoSrc }: { logoSrc: string }) {
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  // Where the logo's bottom edge sits when it is bare. The chip makes the
  // logo smaller, so comparing against the live edge would flip back and
  // forth right at the threshold.
  const restBottom = useRef(0);
  const chipOn = useRef(false);

  useEffect(() => {
    // The chip only appears once the logo has left the hero photo: until
    // then the bare white logo is already readable over it.
    const update = () => {
      const hero = document.getElementById("inicio");
      const logo = logoRef.current;
      if (!hero || !logo) return;
      if (!chipOn.current) restBottom.current = logo.getBoundingClientRect().bottom;
      chipOn.current = hero.getBoundingClientRect().bottom < restBottom.current;
      setScrolled(chipOn.current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* Menu and button, part of the hero. The invisible lockup keeps the
          menu where it sits when the logo is in the row. It must not shrink:
          the row used to squeeze it (its image can shrink) while the fixed
          logo kept its size, so the button slid over the wordmark. */}
      <header className={`absolute inset-x-0 top-0 z-30 py-[1.7em] text-white ${SIZE}`}>
        <div className={ROW}>
          <span aria-hidden="true" className={`invisible shrink-0 ${FIT}`}>
            <Lockup logoSrc={logoSrc} />
          </span>
          <nav aria-label="Seções" className="hidden items-center gap-[2.29em] font-medium lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-white/85 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#contato" className={buttonClass}>
            Quero conhecer
          </a>
        </div>
      </header>

      {/* The logo alone, fixed. The row repeats the header's own so it lines
          up with it; the padding and the negative margin of the link cancel
          out, so the chip does not shift the logo. */}
      <div className={`pointer-events-none fixed inset-x-0 top-0 z-40 py-[1.7em] text-white ${SIZE}`}>
        <div className={`${ROW} min-h-[3.43em]`}>
          <Link
            ref={logoRef}
            href="#inicio"
            aria-label="Franquia Protegida, início"
            className={`pointer-events-auto -m-[0.55em] rounded-lg p-[0.55em] transition-[background-color,box-shadow] duration-300 ${FIT} ${
              scrolled ? "bg-brand-dark/90 shadow-lg shadow-black/10 backdrop-blur-md" : "bg-transparent"
            }`}
          >
            {/* Smaller once it sits in the chip. */}
            <Lockup logoSrc={logoSrc} className={scrolled ? "text-[0.78em]" : ""} />
          </Link>
        </div>
      </div>
    </>
  );
}
