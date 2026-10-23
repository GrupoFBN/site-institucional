---
name: FBN — Corretora de Benefícios
description: Institutional benefits-brokerage site, Adyen-inspired restraint over a single confident blue.
colors:
  institutional-blue: "#294799"
  deep-navy: "#0B1440"
  neutral-bg: "oklch(1 0 0)"
  neutral-fg: "oklch(0.145 0 0)"
  neutral-muted: "oklch(0.556 0 0)"
  neutral-border: "oklch(0.922 0 0)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: "3.75px"
  md: "5px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "26px"
components:
  button-primary:
    backgroundColor: "{colors.institutional-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 24px"
  button-outline-on-dark:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 24px"
---

# Design System: FBN — Corretora de Benefícios

## Overview

**Creative North Star: "The Institutional Console"**

A calm, data-grounded control surface for a relationship that's fundamentally about trust: a company handing its employees' health, dental, life, and retirement coverage to a broker. The system borrows Adyen's grammar directly — full-bleed alternating light/dark sections, restrained single-accent color, sticky-pinned headings that release into the content proving the claim, hairline borders instead of shadows — because that grammar reads as "serious financial infrastructure," which is exactly FBN's positioning. Nothing here performs playfulness; the confidence comes from restraint and from letting real numbers and named clients (once ported in) carry the emotional weight instead of decoration.

Confirmed rejections: no gradient-heavy/cards-in-cards generic SaaS look, and no old-school corporate-insurer look (boxy header blues, clip-art icons). The institutional blue is the brand's own color and is not up for revisiting — every exploration keeps it as the single accent.

**Key Characteristics:**
- One accent color, used deliberately, never diluted into a palette.
- Flat by default; a shadow only appears where it earns real depth (hover lift, focus ring) — it is not a resting-state decoration.
- Hairline borders (1px) are the default surface separator, not shadow.
- Sticky-pinned headings are a recurring, signature scroll mechanism.

## Colors

Single-accent system: one confident blue against near-black text on white, and the same blue's dark-navy sibling for full-bleed dark sections. No secondary or tertiary hue.

### Primary
- **Institutional Blue** (`#294799`): CTAs, links, active/pulsing states, the one accent color anywhere it appears. Used sparingly — most of any given screen is neutral.

### Neutral
- **Deep Navy** (`#0B1440`): full-bleed dark section backgrounds (the CTA/map section, the footer) — not a "dark mode," a deliberate alternating rhythm with the white sections.
- **Off-Black** (`oklch(0.145 0 0)`): body/heading text on light sections.
- **Muted Gray** (`oklch(0.556 0 0)`): secondary/supporting text on light sections.
- **Hairline Gray** (`oklch(0.922 0 0)`): dividers and borders on light sections; on dark sections the equivalent is `white/10–15%` (translucent white, not a separate gray).

### Named Rules
**The One Accent Rule.** Institutional Blue is the only accent in the system. A new color for a new feature is a design error, not a design decision — reach for weight, size, or the light/dark section rhythm instead.

**The Hairline Rule.** Surfaces are separated by a 1px border (gray-200 on light, white/10–15% on dark), not by shadow. Shadow is reserved for genuine state changes (hover, focus), never for resting-state card separation.

## Typography

**Body/Display Font:** Inter (with system-ui, sans-serif fallback) — one family for every role.

**Character:** Contained and confident. Hierarchy comes entirely from weight and size, never from a second typeface — the restraint itself is the point.

### Hierarchy
- **Display** (700, `text-4xl` → `text-6xl`, tight leading): hero headline only.
- **Headline** (700, `text-3xl` → `text-4xl`): section headings (`h2`).
- **Title** (600, `text-2xl`): card/block titles (`h3`).
- **Body** (400, `text-base`–`text-lg`): paragraph copy, `text-white/70–80` on dark sections, `text-gray-500/600` on light.
- **Label** (600, `text-xs`, `0.05em` tracking, uppercase): eyebrow badges, accordion category labels, partner/badge chips.

### Named Rules
**The One-Family Rule.** Every weight and size role is Inter. A second display face would read as decoration the system doesn't reach for.

## Layout

Full-bleed sections (`bg-white` / `bg-brand-dark`, alternating) with a consistent `px-6 sm:px-10` side gutter and a `max-w-7xl`–`max-w-full` inner container depending on section. Vertical rhythm is generous: `py-16` to `py-32` per section. Two-column heading+content pairs (`lg:flex-row`, heading `lg:sticky lg:top-24`) are the recurring composition, directly modeled on Adyen: the heading pins while the proof (cards, map, accordion content) scrolls in underneath or beside it.

### Named Rules
**The Separate Containing Block Rule.** A sticky-pinned heading and the content that follows it must live in separate containing blocks (own wrapper `<div>`s, not nested). A trailing sibling that shares the sticky element's containing block will scroll up through its pinned screen position — proven repeatedly in this project's own build history. Give the pinned block a spacer that governs pin duration, and let the next block start wherever normal flow puts it.

## Elevation & Depth

Flat by default — no resting-state box-shadow anywhere in the system today. Depth is allowed but not yet exercised: the user has confirmed subtle shadow may be introduced where it earns its place (hover lift, dropdown, modal), not as a default card treatment. Until then, depth is conveyed by the light/dark section alternation and by the hairline border, not by shadow.

### Named Rules
**The Earned-Shadow Rule.** Shadow is not a default. Add it only where it communicates an actual state change (something lifting on hover, something floating above content like a dropdown/modal) — never as a resting-state card decoration.

## Shapes

Base radius `10px` (`rounded-lg`), used on buttons, cards, and inputs. Larger surfaces scale up through `14px`/`18px`/`22px`/`26px` (`rounded-xl` → `rounded-4xl`) rather than staying fixed at one radius regardless of size. No sharp corners, no fully circular surfaces outside of true icon/avatar contexts.

## Components

### Buttons
- **Shape:** `rounded-lg` (10px), no shadow at rest.
- **Primary:** Institutional Blue background, white text, `10px 24px` padding.
- **On dark sections:** transparent background, white border, invert to solid white background + navy text on hover.
- **Active/press:** the whole button nudges down 1px (`translateY(1px)`) — the system's one tactile micro-interaction on buttons, in place of a shadow lift.

### Cards (trust-point cards)
- **Corner Style:** `rounded-lg`.
- **Background:** `bg-gray-50` at rest — flat, no border, no shadow.
- **Signature behavior:** at rest, a small icon only; on hover the entire card becomes its photo (grayscale + Institutional Blue duotone via `mix-blend-mode: color`), a bottom gradient fades in for legibility, and title/description recolor to white. This hover-reveal-as-media pattern is a signature component worth reusing, not a one-off.

### Accordion (category list)
- **Style:** no card chrome at all — a plain list divided by hairline borders (`gray-200`).
- **State:** closed rows show gray label text and a `+` icon; the open row bolds to near-black and rotates the icon 45° into an `×`. Height animates via a CSS grid-rows transition (`0fr` → `1fr`), not `max-height` or JS measurement.

### Chips / Badges
- **Style:** small `rounded-md` or pill labels, `bg-white/90` (on photos) or bordered `white/10` (on dark sections), uppercase, `text-xs font-semibold`, `0.05em` tracking.

### Navigation
- Flat, transparent-over-hero header; text links, no dropdown chrome documented yet.

## Do's and Don'ts

### Do:
- **Do** keep Institutional Blue as the system's only accent — everywhere else is neutral (white/off-black/navy/gray).
- **Do** separate surfaces with a 1px hairline border by default, on both light and dark sections.
- **Do** give every sticky-pinned heading its own containing block, isolated from the content that follows it.
- **Do** scale radius up with surface size (`rounded-lg` for controls, up through `rounded-4xl` for large blocks) instead of one fixed radius everywhere.

### Don't:
- **Don't** introduce a gradient-heavy, cards-in-cards generic SaaS look.
- **Don't** reach for an old-school corporate-insurer look (boxy blue headers, clip-art icons).
- **Don't** add a second display typeface — Inter carries every role via weight/size.
- **Don't** add shadow as a resting-state default; earn it with an actual state change.
