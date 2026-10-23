# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are HR/decision-makers and business owners at companies of any size (no size focus — confirmed: targets small, medium, and large companies alike) who need insurance, employee benefit plans (health, dental, life, retirement), or financial products (consórcios, crédito) for their business or team. Their job: find, contract, and get ongoing support without doing the insurer-comparison and claims-handling work themselves.

## Product Purpose

**Correction (2026-10-01):** FBN is NOT a benefits-only brokerage — an earlier pass narrowed the whole site's copy around "corretora de benefícios," which undersells the real business. grupofbn.com.br's own title tag states it plainly: **"Corretora de Seguros e Benefícios Corporativos."** FBN (Grupo FBN) is a full-line broker connecting companies to: property/casualty insurance (ramos elementares — seguro empresarial, frota, carga, garantia, riscos cibernéticos, D&O/E&O, fiança locatícia), corporate benefits (saúde, odontológico, vida, previdência), and financial services (consórcios, crédito, financiamento). It acts as the single point of contact across all of these, from quoting through contracting and claims. Success means the client company gets better coverage/cost than going direct, with less operational burden, across its whole insurance and benefits footprint — not just one line of it.

## Positioning

29+ years in the market (grupofbn.com.br states founded 1996; the same site also has a "since 2002" mention elsewhere — dates conflict, not resolved, do not pick one without confirming with the user). **Correction (2026-10-01):** present in 22 states, not 17 — grupofbn.com.br's own "17 estados" text is outdated/wrong per the user, who confirmed the 22-state map (`components/brazil-orbit.tsx`'s `PULSING_STATES`) as the current source of truth. Also 220+ cities (unverified beyond the old site's own claim, not corrected). Positions as a single dedicated contact spanning multiple insurance and benefit lines, with active cost/coverage negotiation, rather than a per-line broker relationship.

## Operating Context

Workflow spans quoting, contracting (grupofbn.com.br references an online contracting platform), and claims support. The real site also advertises 24-hour assistance. This is a B2B relationship — the buyer (HR/company decision-maker) is not the end beneficiary (employee).

## Capabilities and Constraints

- Multi-line broker: not just benefícios (saúde, odontológico, vida, previdência) — also ramos elementares/property-casualty insurance (seguro empresarial, frota, carga, garantia, riscos cibernéticos, D&O, E&O, fiança locatícia), personal lines (auto, moto, residencial, viagem), franquia protegida, and financial services (consórcios, crédito consignado, financiamento) (confirmed via grupofbn.com.br/servicos/).
- Dedicated account support positioned as differentiator.
- **Confirmed:** FBN is a corretora registered/regulated by SUSEP. The trust-section.tsx copy stating this is accurate real copy, not placeholder — keep it.
- **Correction:** the partner-logos carousel (`partner-logos.tsx`) is meant to show FBN's own **partner/client companies** (the businesses FBN serves), not insurance carriers — "seguradoras parceiras" was an invented framing added earlier in this session to fill a placeholder and is wrong. Rename the concept in any future copy/comments accordingly. The 10 named real clients on grupofbn.com.br (Buddha Spa, Além do Olhar, Solargroup, etc. — see Evidence on Hand) are the real candidates for this slot once ported in; the current "Empresa 1"–"Empresa 25" labels stay placeholder until then.

## Brand Commitments

Name: FBN / Grupo FBN. grupofbn.com.br's stated line: "Confiança não tem preço, tem valor" ("Trust has no price, it has value") — trust is the recurring brand theme. This codebase already has an established visual system: primary blue `#294799`, brand-dark navy `#0B1440`, Inter font — treat as incumbent, not open for revisiting under `init`. Visual direction is explicitly and heavily inspired by adyen.com (user-stated, binding) — full documentation of that reference belongs in DESIGN.md via `/impeccable document`, not expanded here.

## Evidence on Hand

From grupofbn.com.br (real, live site — not yet ported into this codebase):
- An "active clients" counter is shown on the homepage, but its numeric value renders via JS and wasn't captured — needs a live check before quoting a number.
- 22 states (confirmed by the user against the site's own map, 2026-10-01 — grupofbn.com.br's own "17 estados" text is outdated), 220+ cities served.
- 10 named client testimonials with 5-star ratings (e.g., Patricia Siebra/COO at Buddha Spa, Fabiana Barros/Além do Olhar, a 10+-year client at Solargroup) — real names, not yet pulled into this new site.
- No named insurance-carrier partners found on the homepage — the SUSEP registration itself is confirmed directly by the user, independent of the site.

Everything currently in this codebase's placeholder content (partner names, "+15 anos"/"+500 empresas"/stat figures removed earlier, SUSEP claim, card descriptions) is fabricated placeholder text per this project's own established practice (see AGENTS.md-adjacent session history) — future work must replace it with confirmed facts, not carry it forward as evidence.

## Product Principles

1. Trust is the brand's core claim — every surface should earn it with specifics (real numbers, named clients), not generic reassurance copy.
2. One relationship, many lines — seguros, benefícios corporativos, and serviços financeiros — the "single point of contact" model is the actual differentiator, not just a services list.
3. Speaks to any company size — copy and UI should not silently assume "enterprise" or "small business" defaults.
4. Operational burden removed from the buyer — quoting, contracting, and claims support are all part of the product, not just the sales pitch.

## Accessibility & Inclusion

Target WCAG 2.1/2.2 AA (confirmed).
