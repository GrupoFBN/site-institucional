// CTA blocks that editors drop into an article. Pure string functions with
// no Node imports, so the same markup is used by the admin editor preview,
// the public article page and the leads API.
//
// In the saved article a CTA is only an empty <div data-cta data-cta-*> —
// the settings live in those attributes — and gets expanded into real
// markup when the page is rendered (renderCtasInHtml). Changing a template
// here therefore updates every article that uses it.

export const CTA_VARIANTS = ["box", "banner", "image", "inline", "form"] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

export const LINK_TYPES = ["url", "whatsapp", "phone", "email"] as const;
export type LinkType = (typeof LINK_TYPES)[number];

export type CtaAttrs = {
  variant: CtaVariant;
  title: string;
  text: string;
  buttonLabel: string;
  linkType: LinkType;
  linkValue: string;
  message: string;
  imageSrc: string;
  imageAlt: string;
  fields: string;
  successMessage: string;
};

export const CTA_ATTR_KEYS = [
  "variant",
  "title",
  "text",
  "buttonLabel",
  "linkType",
  "linkValue",
  "message",
  "imageSrc",
  "imageAlt",
  "fields",
  "successMessage",
] as const satisfies readonly (keyof CtaAttrs)[];

export const CTA_META: Record<CtaVariant, { label: string; description: string }> = {
  box: { label: "Caixa", description: "Caixa cinza com título, texto e botão." },
  banner: { label: "Destaque", description: "Faixa escura de impacto, com imagem opcional." },
  image: { label: "Imagem ao lado", description: "Imagem à esquerda e texto com botão à direita." },
  inline: { label: "Linha", description: "Uma frase discreta com link, sem caixa." },
  form: { label: "Formulário", description: "Captura nome, e-mail e telefone direto no artigo." },
};

export const FORM_FIELDS = [
  { key: "name", label: "Nome", locked: true },
  { key: "email", label: "E-mail", locked: false },
  { key: "phone", label: "Telefone", locked: false },
  { key: "company", label: "Empresa", locked: false },
] as const;

const BASE: CtaAttrs = {
  variant: "box",
  title: "",
  text: "",
  buttonLabel: "Fale com a gente",
  linkType: "url",
  linkValue: "",
  message: "",
  imageSrc: "",
  imageAlt: "",
  fields: "name,email,phone",
  successMessage: "Recebemos seus dados. Em breve a FBN entra em contato.",
};

export const CTA_DEFAULTS: Record<CtaVariant, CtaAttrs> = {
  box: {
    ...BASE,
    variant: "box",
    title: "Quer entender o que isso muda para a sua empresa?",
    text: "Peça um estudo sem compromisso. Um só contato da FBN cuida de tudo, da cotação ao pós-venda.",
  },
  banner: {
    ...BASE,
    variant: "banner",
    title: "Proteja sua empresa com quem entende de risco",
    text: "Seguros, benefícios e serviços financeiros sob medida, com um só contato do início ao fim.",
    buttonLabel: "Falar com um especialista",
  },
  image: {
    ...BASE,
    variant: "image",
    title: "Seu seguro empresarial está em dia?",
    text: "Faça uma revisão das suas coberturas e veja se dá para proteger mais gastando menos.",
    buttonLabel: "Solicitar revisão",
  },
  inline: {
    ...BASE,
    variant: "inline",
    title: "Quer uma cotação sem compromisso?",
    buttonLabel: "Fale com a gente",
  },
  form: {
    ...BASE,
    variant: "form",
    title: "Receba um estudo gratuito para a sua empresa",
    text: "Deixe seus dados e a FBN entra em contato.",
    buttonLabel: "Quero receber contato",
  },
};

export function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unesc(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Brazilian numbers typed with or without country code, spaces, dashes...
function dialNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "";
  return digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
}

// Only safe destinations ever reach an href: anything unrecognized becomes
// "#", so a typo can't produce a javascript: link.
export function buildHref(attrs: Pick<CtaAttrs, "linkType" | "linkValue" | "message">): string {
  const value = attrs.linkValue.trim();
  if (!value) return "#";
  switch (attrs.linkType) {
    case "whatsapp": {
      const number = dialNumber(value);
      if (!number) return "#";
      const text = attrs.message.trim();
      return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
    }
    case "phone": {
      const number = dialNumber(value);
      return number ? `tel:+${number}` : "#";
    }
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${value}` : "#";
    default:
      if (/^(https?:\/\/|\/|#)/i.test(value)) return value;
      return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(value) ? `https://${value}` : "#";
  }
}

function safeImage(src: string) {
  return /^(https:\/\/|\/uploads\/)/.test(src.trim()) ? src.trim() : "";
}

export function formFieldKeys(fields: string) {
  const wanted = new Set(fields.split(",").map((key) => key.trim()));
  // Name is always asked: a lead without one is hard to follow up.
  return FORM_FIELDS.filter((field) => field.locked || wanted.has(field.key));
}

type RenderOptions = {
  // Slug of the article the CTA sits in; saved with each lead.
  slug?: string;
  // Editor preview: nothing may submit or navigate, and a <form> can't be
  // nested inside the editor's own form.
  preview?: boolean;
};

function buttonHtml(attrs: CtaAttrs, options: RenderOptions, className = "blog-cta__button") {
  const label = esc(attrs.buttonLabel || "Saiba mais");
  if (options.preview) return `<span class="${className}">${label}</span>`;
  const href = buildHref(attrs);
  const external = href.startsWith("http") ? ' target="_blank" rel="noopener"' : "";
  return `<a class="${className}" href="${esc(href)}"${external}>${label}</a>`;
}

function formHtml(attrs: CtaAttrs, options: RenderOptions) {
  const fields = formFieldKeys(attrs.fields)
    .map((field) => {
      const type = field.key === "email" ? "email" : field.key === "phone" ? "tel" : "text";
      const autocomplete =
        field.key === "name" ? "name" : field.key === "email" ? "email" : field.key === "phone" ? "tel" : "organization";
      const required = field.key === "name" ? " required" : "";
      const disabled = options.preview ? " disabled" : "";
      return `<label class="blog-cta__field"><span>${field.label}</span><input type="${type}" name="${field.key}" autocomplete="${autocomplete}"${required}${disabled}></label>`;
    })
    .join("");
  const button = options.preview
    ? `<span class="blog-cta__button">${esc(attrs.buttonLabel || "Enviar")}</span>`
    : `<button class="blog-cta__button" type="submit">${esc(attrs.buttonLabel || "Enviar")}</button>`;
  const inner = `${fields}${
    options.preview
      ? ""
      : '<input class="blog-cta__trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
  }${button}<p class="blog-cta__status" role="status" hidden></p>`;
  return options.preview
    ? `<div class="blog-cta__form">${inner}</div>`
    : `<form class="blog-cta__form" data-cta-form data-success="${esc(attrs.successMessage)}">${inner}</form>`;
}

export function ctaHtml(attrs: CtaAttrs, options: RenderOptions = {}): string {
  const title = attrs.title ? `<p class="blog-cta__title">${esc(attrs.title)}</p>` : "";
  const text = attrs.text ? `<p class="blog-cta__text">${esc(attrs.text)}</p>` : "";
  const image = safeImage(attrs.imageSrc);
  const picture = image
    ? `<img class="blog-cta__image" src="${esc(image)}" alt="${esc(attrs.imageAlt)}" loading="lazy" decoding="async">`
    : "";
  const source = options.slug ? ` data-source="${esc(options.slug)}"` : "";

  switch (attrs.variant) {
    case "inline":
      return `<aside class="blog-cta blog-cta--inline">${title}${buttonHtml(attrs, options, "blog-cta__link")}</aside>`;
    case "form":
      return `<aside class="blog-cta blog-cta--form"${source} data-title="${esc(attrs.title)}"><div class="blog-cta__body">${title}${text}</div>${formHtml(attrs, options)}</aside>`;
    case "banner":
      return `<aside class="blog-cta blog-cta--banner${image ? " has-image" : ""}"><div class="blog-cta__body">${title}${text}${buttonHtml(attrs, options)}</div>${picture}</aside>`;
    case "image":
      return `<aside class="blog-cta blog-cta--image${image ? " has-image" : ""}">${picture}<div class="blog-cta__body">${title}${text}${buttonHtml(attrs, options)}</div></aside>`;
    default:
      return `<aside class="blog-cta blog-cta--box">${title}${text}${buttonHtml(attrs, options)}</aside>`;
  }
}

// Saved form: <div data-cta data-cta-variant="box" data-cta-title="…"></div>
export function parseCtaTag(tag: string): CtaAttrs {
  const attrs: CtaAttrs = { ...CTA_DEFAULTS.box };
  for (const match of tag.matchAll(/data-cta-([a-z]+)="([^"]*)"/g)) {
    const key = CTA_ATTR_KEYS.find((candidate) => candidate.toLowerCase() === match[1]);
    if (key) (attrs as Record<string, string>)[key] = unesc(match[2]);
  }
  if (!CTA_VARIANTS.includes(attrs.variant)) attrs.variant = "box";
  if (!LINK_TYPES.includes(attrs.linkType)) attrs.linkType = "url";
  return attrs;
}

export function renderCtasInHtml(html: string, options: RenderOptions = {}) {
  // Quoted attribute values may contain ">" (browsers don't escape it), so
  // the tag is matched attribute by attribute instead of with [^>]*.
  const tag = /<div\b(?:[^>"]|"[^"]*")*?\bdata-cta\b(?:[^>"]|"[^"]*")*>\s*<\/div>/g;
  return html.replace(tag, (match) => ctaHtml(parseCtaTag(match), options));
}
