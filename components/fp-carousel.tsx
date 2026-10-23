"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type FpQuote = { name: string; company: string; photo: string; quote: string };

// Testimonials as a swipeable row: native scroll-snap, with arrows for mouse
// users. No library; each card is 498px wide with a 20px gap, as on the
// current site.
export function FpTestimonials({ items }: { items: FpQuote[] }) {
  const track = useRef<HTMLUListElement>(null);

  function move(direction: 1 | -1) {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * 518, behavior: "smooth" });
  }

  const arrow =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-[#0454A4] transition hover:text-[#2065F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2065F1] lg:flex";

  return (
    <div className="relative mx-auto max-w-[1140px]">
      <button type="button" onClick={() => move(-1)} aria-label="Depoimento anterior" className={`${arrow} -left-12`}>
        <ChevronLeft aria-hidden="true" className="h-6 w-6" />
      </button>
      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Depoimentos de clientes"
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="w-[min(498px,85vw)] shrink-0 snap-start rounded-xl bg-white p-[25px] text-left"
          >
            <div className="flex items-center gap-3">
              <Image
                src={item.photo}
                alt=""
                width={46}
                height={46}
                className="h-[46px] w-[46px] shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold leading-6 text-[#0454A4]">{item.name}</p>
                <p aria-label="5 de 5 estrelas" className="text-[15px] leading-[22px] tracking-[2px] text-[#FFDF00]">
                  ★★★★★
                </p>
                <p className="text-[13px] font-light leading-[19.5px] text-[#A5A5A5]">{item.company}</p>
              </div>
            </div>
            <blockquote className="mt-5 text-base font-light italic leading-6 text-[#7A7A7A]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => move(1)} aria-label="Próximo depoimento" className={`${arrow} -right-12`}>
        <ChevronRight aria-hidden="true" className="h-6 w-6" />
      </button>
    </div>
  );
}
