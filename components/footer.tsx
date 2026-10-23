import Image from "next/image";
import Link from "next/link";

// Real address/phone/email, pulled from grupofbn.com.br's own footer
// (confirmed live, 2026-10-01) — not invented. "Serviços" reuses the
// header's four nav sections (sourced from grupofbn.com.br/servicos/)
// instead of the old site's own slightly different footer categories, to
// keep one taxonomy across this site rather than importing a second one.
const COLUMNS = [
  {
    title: "Empresa",
    links: [
      { href: "/", label: "Início" },
      { href: "#", label: "Quem somos" },
      { href: "#", label: "Trabalhe conosco" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { href: "#", label: "Para você" },
      { href: "#", label: "Para sua empresa" },
      { href: "#", label: "Franquia protegida" },
      { href: "#", label: "Financeiro" },
    ],
  },
  {
    title: "Contato",
    links: [{ href: "#", label: "Fale com a gente" }],
  },
];

const ADDRESS = "Rua João Domingues de Oliveira, 66, Centro - Ribeirão Pires, CEP: 09400-130";
const PHONE = "(11) 4825-6060";
const EMAIL = "contato@grupofbn.com.br";

export function Footer() {
  return (
    <footer id="site-footer" className="bg-brand-dark px-6 py-16 text-white sm:px-10">
      {/* Logo flattened to white (`brightness-0 invert`) — its real blue and
          gray would vanish into the navy. Same tagline crop as the header:
          the 715x336 source has the "Confiança não tem preço" line baked in
          below the mark, so the shorter parent clips it. 120px wide shows
          the image at 120x56; the parent keeps the top 46px (ratio 2.59). */}
      <div className="mx-auto mb-12 max-w-7xl">
        <Link
          href="/"
          aria-label="Grupo FBN — página inicial"
          className="relative block h-[46px] w-[120px] overflow-hidden"
        >
          <Image
            src="/fbn-logo.png"
            alt=""
            width={240}
            height={113}
            className="absolute left-0 top-0 h-[56px] w-[120px] brightness-0 invert"
          />
        </Link>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 sm:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {column.links.map((link, index) => (
                <li key={`${column.title}-${index}`}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Fale com a gente
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{ADDRESS}</li>
            <li>
              <a href={`tel:+55${PHONE.replace(/\D/g, "")}`} className="hover:text-white">
                {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-white">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-white/40">
        © {new Date().getFullYear()} FBN. Todos os direitos reservados.
      </p>
    </footer>
  );
}
