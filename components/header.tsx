"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/header-section";
import { MobileNav } from "@/components/mobile-nav";
import {
  CONTACT_HREF,
  MOBILE_NAV_ID,
  MOBILE_NAV_TOGGLE_ID,
  NAV_LINKS,
  NAV_SECTIONS,
  isDesktopNav,
  subscribeDesktopNav,
  type NavSection,
} from "@/lib/nav";

const CLOSE_DELAY_MS = 150;

// Adyen-style header (adyen.com/pt_BR specifically — the global/en variant
// renders a solid white bar, but pt_BR, the relevant reference for a
// Brazilian site, is a transparent overlay on the hero video, `position:
// absolute`, no scroll-triggered solid state — confirmed directly against
// the live site): logo + divider + nav on the left, CTA on the right. Each
// section opens on mouse hover (Adyen's actual interaction — confirmed on
// their "Products"/"About" items) with a small close delay so moving from
// the trigger into the panel doesn't flicker it shut; a click or Enter/Space
// toggles it (touch taps only go through click) and Escape closes it. Panel
// layout mirrors Adyen's "About" dropdown: a title+description column on the
// left, a link list on the right (two columns when the list runs long).
// Below lg the row has no room for the nav: a hamburger opens the
// full-screen MobileNav instead.
//
// `solid` is for pages without a hero (the blog): the bar starts white
// instead of transparent, and the hero/CTA lookups below are skipped.
export function Header({ solid = false }: { solid?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mobileOpenerRef = useRef<HTMLElement | null>(null);
  // Bar and pill unmount each other, so focus inside the one going away is
  // handed to the other once it has rendered (see the effect further down).
  const pendingFocusRef = useRef<"bar" | "pill" | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = useSyncExternalStore(subscribeDesktopNav, isDesktopNav, () => false);

  // Adyen's own real behavior (confirmed against their own screenshots,
  // not just one frame of it): the header stays fixed and fully expanded
  // — logo, full nav, CTA — the entire time it's over the hero or over a
  // LIGHT section (just swapping transparent-over-hero for solid white
  // once past it). It only shrinks to the small logo+hamburger pill while
  // scrolled over a DARK section further down the page (their "Intelligent
  // Money Movement" block; ours is the map/CTA section and the footer) —
  // a big white bar would clash sitting on top of a dark section, so it
  // collapses there instead of staying white. Hovering the pill with a
  // mouse, or clicking it / pressing Enter on it, expands the full white
  // bar back (below lg, where the bar has no nav, it opens the mobile menu
  // instead); the next scroll drops it back to the pill.
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
    const toPill = !pill(prev) && pill(next);
    const fromPill = pill(prev) && !pill(next);
    const active = document.activeElement;
    if (toPill && headerRef.current?.contains(active)) pendingFocusRef.current = "pill";
    if (fromPill && active && active === pillRef.current) pendingFocusRef.current = "bar";
    const apply = () => {
      setScrollStateRaw(next);
      // An open dropdown (and its scrim) has nothing to hang from once the
      // bar is gone.
      if (toPill) setOpenId(null);
    };
    const animate =
      (toPill || fromPill) &&
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) {
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
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
    // The panel holding focus is about to go inert: hand focus to this trigger.
    const focusedPanel = document.activeElement?.closest<HTMLElement>("[data-nav-panel]")?.dataset.navPanel;
    if (focusedPanel && focusedPanel !== id) triggerRefs.current[id]?.focus();
    setOpenId(id);
  }
  // Closing makes the open panel inert; if focus was inside it, hand it
  // back to that panel's trigger instead of letting it drop to <body>.
  function closeMenu() {
    const panelId = document.activeElement?.closest<HTMLElement>("[data-nav-panel]")?.dataset.navPanel;
    if (panelId) triggerRefs.current[panelId]?.focus();
    setOpenId(null);
  }
  function scheduleClose() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(closeMenu, CLOSE_DELAY_MS);
  }

  function toggleMobileNav(opener: HTMLElement) {
    mobileOpenerRef.current = opener;
    setOpenId(null);
    setMobileOpen((open) => !open);
  }
  const closeMobileNav = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!openId) return;
    const id = openId;

    function onPointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenId(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (headerRef.current?.contains(document.activeElement)) triggerRefs.current[id]?.focus();
      setOpenId(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  // Crossing lg swaps which of the two menus exists, so close both rather
  // than leave one open behind a nav that just went display:none.
  useEffect(() => subscribeDesktopNav(() => { setOpenId(null); setMobileOpen(false); }), []);

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

  // Hands focus over after a bar<->pill swap (queued in setScrollState or
  // by the pill's click). Below lg the nav row is display:none, so the
  // hamburger stands in for the first nav trigger.
  useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    pendingFocusRef.current = null;
    if (target === "pill") pillRef.current?.focus();
    else (isDesktopNav() ? triggerRefs.current[NAV_SECTIONS[0].id] : menuToggleRef.current)?.focus();
  }, [showPill]);

  // Each panel scales open top-to-bottom (Adyen's own actual technique,
  // confirmed against their DOM: `origin-top` + `scaleY(0→1)`) instead of
  // just appearing. A CSS transition can't animate a conditionally-mounted
  // element's first frame, so every section's panel stays mounted and
  // `openId` only toggles its scale — which means the curtain can't follow
  // `activeSection` directly either, or it would lose its height the
  // instant a section closes, before the shrink animation finishes. This
  // keeps the last real section shown (and measured) while it scales down.
  const [displayedSection, setDisplayedSection] = useState<NavSection>(NAV_SECTIONS[0]);
  // Moving straight from one open section to another swaps the panels at
  // full size with no animation, as before: the curtain stays open and
  // only its height changes.
  const [swapping, setSwapping] = useState(false);
  // Adjusted during render (React's documented pattern for this — not in
  // an effect) so the swap lands in the same paint as the open, instead of
  // one frame later.
  const [prevActiveSection, setPrevActiveSection] = useState(activeSection);
  if (activeSection !== prevActiveSection) {
    setPrevActiveSection(activeSection);
    setSwapping(!!activeSection && !!prevActiveSection);
    if (activeSection) setDisplayedSection(activeSection);
  }

  // One curtain owns the whole white surface behind the row and the open
  // panel, so row and panel read as two heights of the same sheet. Its
  // real height (row + the displayed panel) isn't knowable up front, so
  // it's measured off the actual DOM instead of hardcoded — a
  // ResizeObserver keeps it correct automatically if either piece's
  // content or the viewport ever changes.
  const [sheet, setSheet] = useState({ row: 0, panel: 0 });
  useEffect(() => {
    const row = rowRef.current;
    const panel = panelRefs.current[displayedSection.id];
    function measure() {
      const next = { row: row?.offsetHeight ?? 0, panel: panel?.offsetHeight ?? 0 };
      setSheet((prev) => (prev.row === next.row && prev.panel === next.panel ? prev : next));
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (row) observer.observe(row);
    if (panel) observer.observe(panel);
    return () => observer.disconnect();
    // Also re-measure whenever the full bar mounts fresh: `showPill`
    // toggling conditionally unmounts the whole <header> (see the pill
    // render below), which gives the row and panels brand new DOM nodes
    // that this effect would otherwise never measure, since
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
          `overDarkZone` effect above). At lg+, a mouse hover or a click /
          Enter brings the full bar back (a click also moves focus to the
          first nav trigger, since this button unmounts); below lg it opens
          the mobile menu. Not on focus: that unmounted the very button
          holding focus. Collapsing back is driven by the next scroll
          event, not by mouse-leave, matching the user's own spec exactly:
          stays expanded "até scrollar a página de novo". */}
      {showPill && (
        <button
          ref={pillRef}
          type="button"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse" && isDesktopNav()) setScrollState({ pillHovered: true });
          }}
          onClick={(event) => {
            if (!isDesktopNav()) return toggleMobileNav(event.currentTarget);
            pendingFocusRef.current = "bar";
            setScrollState({ pillHovered: true });
          }}
          aria-label={isDesktop ? "Mostrar menu completo" : "Abrir menu"}
          aria-controls={isDesktop ? undefined : MOBILE_NAV_ID}
          aria-expanded={isDesktop ? undefined : mobileOpen}
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
      <header
        ref={headerRef}
        onBlur={(event) => {
          // A null relatedTarget (window blur, a click on plain text in the
          // panel) isn't focus leaving; outside clicks close via pointerdown.
          const next = event.relatedTarget;
          if (next && !event.currentTarget.contains(next)) setOpenId(null);
        }}
        className="fixed inset-x-0 top-0 z-20 [view-transition-name:site-bar]"
      >
      {/* The curtain is purely decorative: the links live in each
          section's panel (header-section.tsx), right after its trigger, so
          nothing a screen reader needs sits under aria-hidden. Those panels
          run this same scaleY transition from this element's top edge, so
          sheet and content still move as one. Height is measured above,
          since the panels sit in `position: absolute` clip boxes to overlay
          the hero. The row is a separate, never-animated sibling on top — it
          can't live inside a box that scales to zero. */}
      <div
        aria-hidden="true"
        style={{ height: sheet.row + sheet.panel }}
        className={`absolute inset-x-0 top-0 origin-top bg-white shadow-lg transition-transform duration-200 ease-out ${
          isOpen ? "scale-y-100" : "scale-y-0"
        }`}
      />

      {/* Past the hero the row needs its own white backing — the curtain
          above only covers it while a dropdown is open (scale-y-0
          otherwise), which left dark text floating over a transparent bar.
          No shadow while open: the curtain already draws one under the
          whole sheet, and a second one here would cut across the panel.
          Gaps and padding tighten between lg and xl so logo, the six nav
          items and the CTA fit on one line from 1024px. */}
      <div
        ref={rowRef}
        className={`relative flex items-center gap-3 px-4 py-5 transition-[background-color,box-shadow] duration-200 ease-out sm:gap-4 sm:px-6 xl:gap-8 xl:px-10 ${
          overHero ? `bg-transparent ${transparent ? "on-dark" : ""}` : `bg-white ${isOpen ? "" : "shadow-sm"}`
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
          className={`hidden h-6 w-px transition-colors duration-200 ease-out lg:block ${
            visualOpen ? "bg-gray-200" : "bg-white/30"
          }`}
          aria-hidden="true"
        />
        <nav
          aria-label="Principal"
          className={`hidden items-center gap-5 text-sm font-medium transition-colors duration-200 ease-out lg:flex xl:gap-8 ${
            visualOpen ? "text-gray-700" : "text-white/90"
          }`}
        >
          {NAV_SECTIONS.map((section) => (
            <HeaderSection
              key={section.id}
              section={section}
              active={openId === section.id}
              shown={displayedSection.id === section.id}
              animate={!swapping}
              light={visualOpen}
              originY={-sheet.row}
              triggerRef={(el) => {
                triggerRefs.current[section.id] = el;
              }}
              panelRef={(el) => {
                panelRefs.current[section.id] = el;
              }}
              onHoverStart={() => openSection(section.id)}
              onHoverEnd={scheduleClose}
              onToggle={() => setOpenId((current) => (current === section.id ? null : section.id))}
              onNavigate={closeMenu}
            />
          ))}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap transition ${visualOpen ? "hover:text-brand-dark" : "hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* On the narrowest phones the CTA tightens so logo, CTA and the
            hamburger still share one row at 320px. */}
        <Button asChild className="ml-auto max-[359px]:px-2 max-[359px]:text-[13px]">
          <Link href={CONTACT_HREF}>Fale com a gente</Link>
        </Button>
        {/* Negative margins keep the row at the logo/CTA height and line the
            icon up with the padding edge, with a 40px hit area. */}
        <button
          ref={menuToggleRef}
          id={MOBILE_NAV_TOGGLE_ID}
          type="button"
          onClick={(event) => toggleMobileNav(event.currentTarget)}
          aria-expanded={mobileOpen}
          aria-controls={MOBILE_NAV_ID}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          className={`-my-1 -mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ease-out lg:hidden ${
            visualOpen ? "text-brand-dark hover:bg-gray-100" : "text-white hover:bg-white/10"
          }`}
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </div>
      </header>
      )}
      <MobileNav open={mobileOpen} onClose={closeMobileNav} returnFocusRef={mobileOpenerRef} />
    </>
  );
}
