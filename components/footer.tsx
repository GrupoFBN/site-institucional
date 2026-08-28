import Link from "next/link";

const COLUMNS = [
  {
    title: "Empresa",
    links: [
      { href: "#", label: "Sobre nós" },
      { href: "/", label: "Início" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { href: "#", label: "Saúde" },
      { href: "#", label: "Odontológico" },
      { href: "#", label: "Vida" },
      { href: "#", label: "Previdência" },
    ],
  },
  {
    title: "Contato",
    links: [{ href: "#", label: "Fale conosco" }],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark px-6 py-16 text-white sm:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 sm:grid-cols-3">
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
      </div>
      <p className="mx-auto mt-12 max-w-5xl text-xs text-white/40">
        © {new Date().getFullYear()} FBN. Todos os direitos reservados.
      </p>
    </footer>
  );
}
