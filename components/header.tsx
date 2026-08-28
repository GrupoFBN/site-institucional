import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "#", label: "Sobre" },
  { href: "#", label: "Serviços" },
  { href: "#", label: "Contato" },
];

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="text-xl font-bold tracking-tight">
        FBN
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-white/70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Button
        asChild
        variant="outline"
        className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        <Link href="#">Fale conosco</Link>
      </Button>
    </header>
  );
}
