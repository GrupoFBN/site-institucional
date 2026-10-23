// Single source for everything SEO-related (metadata, robots, sitemap,
// manifest, JSON-LD) so a URL or phone number changes in one place.
//
// All business facts here come from grupofbn.com.br's own footer, title
// tag and social links (checked live) — nothing invented. The founding
// year is left out on purpose: that site shows both 1996 and 2002 and
// which one is right is still unconfirmed.

// Public URL of this site, including any subpath. Override per deploy —
// for the /site-teste build set SITE_URL=https://grupofbn.com.br/site-teste
// together with BASE_PATH=/site-teste (the canonical, sitemap and JSON-LD
// URLs are built from this, so leaving it at the domain root there would
// point them at the real site instead of the copy).
export const SITE_URL = (process.env.SITE_URL ?? "https://grupofbn.com.br").replace(/\/$/, "");

// Search engines only see the site when SITE_INDEXABLE=true. Default is
// off: while this is a test copy of the real site, indexing it would
// compete with grupofbn.com.br itself as duplicate content.
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";

export const SITE_NAME = "Grupo FBN";
export const SITE_TITLE = "Corretora de Seguros e Benefícios Corporativos";
export const SITE_DESCRIPTION =
  "Seguros empresariais, planos de saúde, benefícios corporativos e consórcio com um só contato do início ao fim. Peça seu estudo sem compromisso.";

export const SOCIAL_LINKS = [
  "https://www.facebook.com/grupofbn",
  "https://www.instagram.com/grupofbn",
  "https://www.youtube.com/@grupofbn",
  "https://www.linkedin.com/company/grupofbn",
];

export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "InsuranceAgency",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "FBN",
      url: SITE_URL,
      logo: `${SITE_URL}/fbn-logo.png`,
      image: `${SITE_URL}/fbn-logo.png`,
      description: SITE_DESCRIPTION,
      slogan: "Confiança não tem preço, tem valor",
      telephone: "+55-11-4825-6060",
      email: "contato@grupofbn.com.br",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rua João Domingues de Oliveira, 66, Centro",
        addressLocality: "Ribeirão Pires",
        addressRegion: "SP",
        postalCode: "09400-130",
        addressCountry: "BR",
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      sameAs: SOCIAL_LINKS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
