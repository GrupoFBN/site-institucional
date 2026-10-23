"use client";

import { useEffect, useRef, useState } from "react";

// Row labels were dictated by the user. Figures reuse what the site already
// states (see PRODUCT.md "Evidence on Hand"): 220+ cities and the 24-hour
// assistance line from grupofbn.com.br, and the 1,200-company count used in
// testimonials-section.tsx. 220+ cities is the old site's own claim and has
// not been re-verified.
const STATS = [
  // PLACEHOLDER: the real amount saved for clients hasn't been provided yet.
  { label: "Valor economizado", value: "R$ 000 mi", live: false },
  { label: "Empresas atendidas", value: "1.200+", live: false },
  { label: "Cidades atendidas", value: "220+", live: false },
  { label: "Assistência", value: "24h", live: true },
] as const;

// One-shot "has this scrolled into view" flag. Reduced-motion visitors skip
// the transitions via `motion-reduce:transition-none` on the consumers.
function useInView<T extends Element>(threshold: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

export function StatsSection() {
  const [listRef, listIn] = useInView<HTMLUListElement>(0.25);

  return (
    <section
      id="numeros"
      aria-labelledby="numeros-titulo"
      className="bg-white px-4 py-24 text-brand-dark lg:py-40"
    >
      {/* Full width with a 16px gutter, like the reference: the numbers run
          out to the right edge of the page instead of stopping at a cap. */}
      <div>
        <h2
          id="numeros-titulo"
          className="max-w-xl text-balance text-[clamp(1.5rem,2.1vw,2.125rem)] font-normal leading-[1.18] tracking-tight lg:max-w-[50%]"
        >
          Especializados em economia
        </h2>

        <ul ref={listRef} className="mt-16 lg:mt-24">
          {STATS.map((stat, i) => (
            <li key={stat.label} className="overflow-clip">
              <hr
                className={`h-px w-full origin-left border-0 bg-current/18 transition-transform duration-[900ms] motion-reduce:transition-none ease-out ${
                  listIn ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              />
              <div
                className={`flex items-center justify-between gap-6 py-2 transition-[opacity,transform] duration-700 motion-reduce:transition-none ease-out ${
                  listIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${150 + i * 120}ms` }}
              >
                <span className="flex items-center gap-2">
                  {stat.live ? (
                    <span aria-hidden="true" className="size-2 shrink-0 animate-pulse bg-primary" />
                  ) : null}
                  <span className="font-mono text-xs uppercase leading-[1.12]">{stat.label}</span>
                </span>
                <div className="flex items-center gap-6">
                  {/* The small gray tile with a dot that sits left of every
                      number but the first, as in the reference. Decorative:
                      there's no copy for a tooltip, so it isn't a control. */}
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="hidden size-[30px] shrink-0 place-items-center rounded-md bg-gray-100 md:grid"
                    >
                      <span className="size-1.5 bg-brand-dark" />
                    </span>
                  ) : null}
                  <p className="text-[clamp(2.75rem,4.6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.03em] tabular-nums">
                    {stat.value}
                  </p>
                </div>
              </div>
              {i === STATS.length - 1 ? (
                <hr
                  className={`h-px w-full origin-left border-0 bg-current/18 transition-transform duration-[900ms] motion-reduce:transition-none ease-out ${
                    listIn ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transitionDelay: `${(i + 1) * 120}ms` }}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
