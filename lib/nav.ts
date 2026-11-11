// Shared by the desktop header (header.tsx) and the full-screen menu used
// below lg (mobile-nav.tsx).

export type NavSection = {
  id: string;
  label: string;
  description: string;
  items: readonly string[];
  // A page for the section as a whole, shown apart from the item list.
  page?: { label: string; href: string };
};

// Real content pulled from grupofbn.com.br/servicos/ (excluding its
// "Demais serviços" section, per instruction). Section-name → header-label
// mapping:
//   "Proteção para a sua família" → Para você
//   "Proteção para o seu time"    → Para sua empresa
//   "Proteção para a sua empresa" → Franquia protegida
//   "Serviços financeiros"        → Financeiro
// The individual items stay at "#" until their destinations are decided.
export const NAV_SECTIONS: readonly NavSection[] = [
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
    page: { label: "Conheça o Franquia Protegida", href: "/franquia-protegida" },
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
];

// "Monetiza" has no matching section on that page — left as a plain link
// until real content is confirmed, not guessed.
export const NAV_LINKS = [
  { label: "Monetiza", href: "#" },
  { label: "Blog", href: "/blog" },
] as const;

// The footer's contact block, present on every page that uses the header.
export const CONTACT_HREF = "#contato";

// The breakpoint (lg) where the full nav row replaces the hamburger menu.
// The helpers touch `window`, so only call them from effects and handlers.
export const DESKTOP_NAV_QUERY = "(min-width: 1024px)";
export const isDesktopNav = () => window.matchMedia(DESKTOP_NAV_QUERY).matches;
export function subscribeDesktopNav(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_NAV_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export const MOBILE_NAV_ID = "mobile-nav";
export const MOBILE_NAV_TOGGLE_ID = "mobile-nav-toggle";
