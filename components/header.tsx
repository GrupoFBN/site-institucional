"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Real content pulled from grupofbn.com.br/servicos/ (excluding its
// "Demais serviços" section, per instruction). Section-name → header-label
// mapping:
//   "Proteção para a sua família" → Para você
//   "Proteção para o seu time"    → Para sua empresa
//   "Proteção para a sua empresa" → Franquia protegida
//   "Serviços financeiros"        → Financeiro
// "Monetiza" has no matching section on that page — left as a plain link
// until real content is confirmed, not guessed.
const NAV_SECTIONS = [
  {
    id: "voce",
    label: "Para você",
    description: "Proteção pra você e sua família, no que for importante.",
    items: [
      "Seguro Auto",
      "Seguro Moto",
      "Seguro Residencial",
      "Seguro de vida",
      "Plano de saúde",
      "Seguro Viagem",
      "Seguro Portáteis",
      "Seguro de bike",
      "Seguro para renda",
      "Previdência privada",
    ],
  },
  {
    id: "empresa",
    label: "Para sua empresa",
    description: "Benefícios pro seu time, com um só contato.",
    items: [
      "Seguro de vida empresarial",
      "Plano de saúde empresarial",
      "Plano odontológico empresarial",
      "Saúde mental corporativa",
      "Telemedicina",
      "Crédito consignado",
    ],
  },
  {
    id: "franquia",
    label: "Franquia protegida",
    description: "Proteção pro patrimônio e a operação da sua empresa.",
    items: [
      "Seguro empresarial",
      "Seguro de frota",
      "Seguro de carga",
      "Seguro Garantia",
      "Riscos cibernéticos",
      "Seguro de equipamentos",
      "Responsabilidade Civil - D&O",
      "Responsabilidade Civil - E&O",
      "Fiança locatícia",
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    description: "Crédito e consórcio pra fazer o dinheiro render mais.",
    items: [
      "Consórcios",
      "Consórcio de placa solar",
      "Consórcio de bike",
      "Cartão de crédito",
      "Financiamento de veículo",
      "Refinanciamento de veículo",
      "Refinanciamento de imóvel",
    ],
  },
] as const;

const CLOSE_DELAY_MS = 150;

// Adyen-style header (adyen.com/pt_BR specifically — the global/en variant
// renders a solid white bar, but pt_BR, the relevant reference for a
// Brazilian site, is a transparent overlay on the hero video, `position:
// absolute`, no scroll-triggered solid state — confirmed directly against
// the live site): logo + divider + nav on the left, CTA on the right. Each
// section opens on hover (Adyen's actual interaction — confirmed on their
// "Products"/"About" items) with a small close delay so moving from the
// trigger into the panel doesn't flicker it shut; click and Escape still
// work too, for touch and keyboard. Panel layout mirrors Adyen's "About"
// dropdown: a title+description column on the left, a link list on the
// right (two columns when the list runs long).
//
// `solid` is for pages without a hero (the blog): the bar starts white
// instead of transparent, and the hero/CTA lookups below are skipped.
export function Header({ solid = false }: { solid?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adyen's own real behavior (confirmed against their own screenshots,
  // not just one frame of it): the header stays fixed and fully expanded
  // — logo, full nav, CTA — the entire time it's over the hero or over a
  // LIGHT section (just swapping transparent-over-hero for solid white
  // once past it). It only shrinks to the small logo+hamburger pill while
  // scrolled over a DARK section further down the page (their "Intelligent
  // Money Movement" block; ours is the map/CTA section and the footer) —
  // a big white bar would clash sitting on top of a dark section, so it
  // collapses there instead of staying white. Hovering the pill (or
  // focusing it, for keyboard users) expands the full white bar back,
  // same as before; the next scroll drops it back to the pill.
  // All three live in one object so a change can be checked against the
  // current value BEFORE it's committed — that's what decides whether the
  // bar<->pill swap gets wrapped in a view transition (see setScrollState).
  const [scrollState, setScrollStateRaw] = useState({
    overHero: !solid,
    overDarkZone: false,
    pillHovered: false,
  });
  const { overHero, overDarkZone, pillHovered } = scrollState;
  const scrollStateRef = useRef(scrollState);

  // Bar and pill are two separately-mounted elements, so instead of one
  // disappearing and the other popping in, the swap runs inside a View
  // Transition: the logo carries the same `view-transition-name` in both,
  // so the browser slides it from the bar's spot to the pill's, while the
  // bar's white surface (also shared-named with the pill) shrinks into the
  // pill's shape. Timing lives in globals.css. Browsers without the API,
  // or users with reduced motion, just get the instant swap.
  const setScrollState = useCallback((patch: Partial<typeof scrollState>) => {
    const prev = scrollStateRef.current;
    const next = { ...prev, ...patch };
    if (
      next.overHero === prev.overHero &&
      next.overDarkZone === prev.overDarkZone &&
      next.pillHovered === prev.pillHovered
    ) {
      return;
    }
    scrollStateRef.current = next;
    const pill = (s: typeof next) => s.overDarkZone && !s.overHero && !s.pillHovered;
    const animate =
      pill(prev) !== pill(next) &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) {
      document.startViewTransition(() => flushSync(() => setScrollStateRaw(next)));
    } else {
      setScrollStateRaw(next);
    }
  }, []);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const ctaFinal = document.getElementById("cta-final");
    const footer = document.getElementById("site-footer");
    if (!footer || (!solid && (!hero || !ctaFinal))) return;

    function measure() {
      const footerRect = footer!.getBoundingClientRect();
      const ctaRect = ctaFinal?.getBoundingClientRect();
      return {
        overHero: solid ? false : hero!.getBoundingClientRect().bottom > 0,
        overDarkZone:
          (!!ctaRect && ctaRect.top <= 0 && ctaRect.bottom > 0) ||
          (footerRect.top <= 0 && footerRect.bottom > 0),
      };
    }
    function update() {
      setScrollState(measure());
    }
    // Any scroll drops the hover-expanded bar back to the pill — "até
    // scrollar a página de novo" is the user's own spec, not mouse-leave.
    function onScroll() {
      setScrollState({ ...measure(), pillHovered: false });
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [setScrollState, solid]);

  function openSection(id: string) {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenId(id);
  }
  function scheduleClose() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }

  useEffect(() => {
    if (!openId) return;

    function onPointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenId(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenId(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const activeSection = NAV_SECTIONS.find((section) => section.id === openId);
  const isOpen = !!activeSection;
  // Transparent only at the very top of the hero with nothing open —
  // opening a dropdown always forces the solid white look, hero or not
  // (the dropdown's own white panel needs a white row above it, not a
  // transparent one). Everywhere past the hero, the row is white by
  // default; the pill below is what replaces it specifically over the
  // dark sections, so by the time `transparent` would otherwise go false
  // there, the pill is what's actually on screen instead.
  const transparent = overHero && !isOpen;
  const showPill = overDarkZone && !overHero && !pillHovered;
  const visualOpen = !transparent;

  // The panel scales open top-to-bottom (Adyen's own actual technique,
  // confirmed against their DOM: `origin-top` + `scaleY(0→1)`) instead of
  // just appearing. A CSS transition can't animate a conditionally-mounted
  // element's first frame, so the panel stays mounted at all times and
  // `isOpen` only toggles its scale — which means its CONTENT can't be
  // tied directly to `activeSection` either, or it would go blank the
  // instant a section closes, before the shrink animation finishes. This
  // keeps showing the last real section while the panel scales back down.
  const [displayedSection, setDisplayedSection] = useState<(typeof NAV_SECTIONS)[number]>(
    NAV_SECTIONS[0],
  );
  // Adjusted during render (React's documented pattern for this — not in
  // an effect) so the swap lands in the same paint as the open, instead of
  // one frame later.
  const [prevActiveSection, setPrevActiveSection] = useState(activeSection);
  if (activeSection !== prevActiveSection) {
    setPrevActiveSection(activeSection);
    if (activeSection) setDisplayedSection(activeSection);
  }

  // One element owns the whole white surface: the curtain below sits
  // behind the always-visible row AND contains the dropdown's links, so
  // there's nothing to keep manually in sync between two pieces — row and
  // panel just happen to be two different heights of the same sheet. That
  // sheet's real height (row + however tall the current section's link
  // list is) isn't knowable up front, so it's measured off the actual DOM
  // instead of hardcoded — a ResizeObserver keeps it correct automatically
  // if either piece's content or the viewport ever changes.
  const [curtainHeight, setCurtainHeight] = useState(0);
  useEffect(() => {
    function measure() {
      const rowHeight = rowRef.current?.offsetHeight ?? 0;
      const panelHeight = panelContentRef.current?.offsetHeight ?? 0;
      setCurtainHeight(rowHeight + panelHeight);
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (rowRef.current) observer.observe(rowRef.current);
    if (panelContentRef.current) observer.observe(panelContentRef.current);
    return () => observer.disconnect();
    // Also re-measure whenever the full bar mounts fresh: `showPill`
    // toggling conditionally unmounts the whole <header> (see the pill
    // render below), which gives rowRef/panelContentRef brand new DOM
    // nodes that this effect would otherwise never measure, since
    // displayedSection alone doesn't change on a bare remount.
  }, [displayedSection, showPill]);

  return (
    <>
      {/* Adyen dims and blurs everything below the header while a section
          is open (confirmed against their live site) instead of just
          floating a white panel over the hero. This has to sit OUTSIDE
          the header's own `z-20` stacking context — it needs to cover the
          hero's text/CTA too, a sibling of Header in hero.tsx, and a
          descendant's z-index can never escape its ancestor's stacking
          context no matter how high the number is. */}
      <div
        aria-hidden="true"
        onClick={() => setOpenId(null)}
        className={`fixed inset-0 z-[15] bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Collapsed pill — only over a dark section past the hero (see the
          `overDarkZone` effect above). Hovering — or focusing, for
          keyboard users — brings the full bar back. Collapsing back is
          driven by the next scroll event, not by mouse-leave, matching the
          user's own spec exactly: stays expanded "até scrollar a página de
          novo". Rendered as a real <button> (not a hover-only <div>) so
          click and keyboard focus trigger the same reveal as hover. */}
      {showPill && (
        <button
          type="button"
          onMouseEnter={() => setScrollState({ pillHovered: true })}
          onFocus={() => setScrollState({ pillHovered: true })}
          aria-label="Mostrar menu completo"
          className="fixed left-4 top-4 z-20 flex items-center gap-5 rounded-lg bg-white px-5 py-4 shadow-lg [view-transition-name:site-bar]"
        >
          {/* Crop ratio corrected by actually decoding the PNG (715x336):
              the logo's own ink (icon+wordmark) runs to row 267, a blank
              gap sits at rows 268-285, and the tagline starts at row 286.
              The previous ratio (2.857) assumed the logo ended well before
              that and sliced into its real bottom pixels. Cropping at row
              276 — the middle of the real gap — needs container ratio
              2.128 (the full image's own ratio) / (276/336) ≈ 2.59, not
              2.857: `object-fit: cover`'s visible top fraction is
              naturalRatio / containerRatio, so a too-high ratio shows
              LESS of the image, not more. */}
          <div
            className="relative h-8 w-[83px] shrink-0 overflow-hidden [view-transition-name:site-logo]"
            aria-hidden="true"
          >
            {/* `fill` + `sizes` made Next pick its largest srcset
                candidate (3840px — upscaled nearly 5.4x past the source's
                own 715px) instead of something close to the real 83px
                rendered width. Explicit intrinsic width/height sidesteps
                that guesswork entirely: 166x78 is exactly 2x the 83x39 the
                logo displays at (crisp on retina without upscaling past
                what the source actually has), then CSS shrinks it to the
                real display size and the shorter `h-8` parent clips the
                tagline via plain overflow — no object-fit crop math. */}
            <Image
              src="/fbn-logo.png"
              alt=""
              width={166}
              height={78}
              className="absolute left-0 top-0 h-[39px] w-[83px]"
            />
          </div>
          {/* Divider + hamburger icon — Adyen's own reference badge has
              both next to the logo, not just the logo alone. */}
          <div className="h-7 w-px bg-gray-200" aria-hidden="true" />
          <Menu className="h-7 w-7 shrink-0 text-brand-dark" aria-hidden="true" />
        </button>
      )}
      {/* Always fixed — pinned at the top through the hero AND every
          section after it (confirmed against Adyen's own screenshots:
          their header never scrolls away, it's visible mid-scroll too),
          not just once collapsed. `hero.tsx` no longer needs to reserve
          flow space for it either, since a fixed element doesn't occupy
          any. */}
      {!showPill && (
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-20 [view-transition-name:site-bar]">
      {/* ONE element owns the entire white surface — the row's backing AND
          the dropdown's links live inside this single scaleY-animated
          sheet, so there's no second piece to keep in sync by duration or
          easing. Its height (row + the current section's link-list height)
          is measured off the real DOM above, since the panel must stay
          `position: absolute` to overlay the hero instead of pushing it
          down, which means it can't just fall out of normal flow sizing.
          The row itself is a separate, never-animated sibling on top —
          it has to stay visible and undistorted at all times, so it can't
          live inside a box that scales to zero. */}
      <div
        aria-hidden="true"
        style={{ height: curtainHeight }}
        className={`absolute inset-x-0 top-0 origin-top overflow-hidden bg-white shadow-lg transition-transform duration-200 ease-out ${
          isOpen ? "scale-y-100" : "scale-y-0"
        }`}
      >
        <div
          ref={panelContentRef}
          id={`nav-menu-${displayedSection.id}`}
          onMouseEnter={() => openSection(displayedSection.id)}
          onMouseLeave={scheduleClose}
          aria-hidden={!isOpen}
          inert={!isOpen ? true : undefined}
          className="absolute inset-x-0 bottom-0 grid grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-[minmax(0,20rem)_1fr] sm:px-10"
        >
          <div>
            <p className="text-xl font-semibold text-brand-dark">{displayedSection.label}</p>
            <p className="mt-2 max-w-xs text-sm text-gray-500">{displayedSection.description}</p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {displayedSection.items.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  onClick={() => setOpenId(null)}
                  className="text-base font-medium text-brand-dark transition hover:text-primary"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Past the hero the row needs its own white backing — the curtain
          above only covers it while a dropdown is open (scale-y-0
          otherwise), which left dark text floating over a transparent bar.
          No shadow while open: the curtain already draws one under the
          whole sheet, and a second one here would cut across the panel. */}
      <div
        ref={rowRef}
        className={`relative flex items-center gap-8 px-6 py-5 transition-[background-color,box-shadow] duration-200 ease-out sm:px-10 ${
          overHero ? "bg-transparent" : `bg-white ${isOpen ? "" : "shadow-sm"}`
        }`}
      >
        {/* Same crop as the pill's logo (tagline clipped by the h-8
            parent). Over the hero video the full-color mark would vanish
            into the dark footage, so it's flattened to white there with
            `brightness-0 invert`; on the white bar it shows its real
            colors. */}
        <Link
          href="/"
          aria-label="Grupo FBN — página inicial"
          className="relative block h-8 w-[83px] shrink-0 overflow-hidden [view-transition-name:site-logo]"
        >
          <Image
            src="/fbn-logo.png"
            alt=""
            width={166}
            height={78}
            priority
            className={`absolute left-0 top-0 h-[39px] w-[83px] transition-[filter] duration-200 ease-out ${
              visualOpen ? "" : "brightness-0 invert"
            }`}
          />
        </Link>
        <div
          className={`hidden h-6 w-px transition-colors duration-200 ease-out md:block ${
            visualOpen ? "bg-gray-200" : "bg-white/30"
          }`}
          aria-hidden="true"
        />
        <nav
          className={`hidden items-center gap-8 text-sm font-medium transition-colors duration-200 ease-out md:flex ${
            visualOpen ? "text-gray-700" : "text-white/90"
          }`}
        >
          {NAV_SECTIONS.map((section) => {
            const active = openId === section.id;
            return (
              <div
                key={section.id}
                onMouseEnter={() => openSection(section.id)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenId((current) => (current === section.id ? null : section.id))}
                  aria-expanded={active}
                  aria-controls={`nav-menu-${section.id}`}
                  className={`flex items-center gap-1 transition ${
                    visualOpen
                      ? active
                        ? "font-semibold text-brand-dark"
                        : "hover:text-brand-dark"
                      : "hover:text-white"
                  } ${!visualOpen && active ? "text-white" : ""}`}
                >
                  {section.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${active ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            );
          })}
          <Link href="#" className={`transition ${visualOpen ? "hover:text-brand-dark" : "hover:text-white"}`}>
            Monetiza
          </Link>
          <Link href="/blog" className={`transition ${visualOpen ? "hover:text-brand-dark" : "hover:text-white"}`}>
            Blog
          </Link>
        </nav>
        <Button asChild className="ml-auto">
          <Link href="#">Fale com a gente</Link>
        </Button>
      </div>
      </header>
      )}
    </>
  );
}
