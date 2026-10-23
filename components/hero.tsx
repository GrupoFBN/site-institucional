import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { HeroImageRoll } from "@/components/hero-image-roll";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] flex-col overflow-hidden text-white md:min-h-screen"
    >
      <HeroImageRoll />
      <Header />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center pointer-events-none">
        {/* No eyebrow/kicker above the headline — the craft floor bans it
            outright (no brief earns it back). The subtitle right below
            already names seguros/benefícios/financeiro in full, so
            nothing the badge said is lost by cutting it. */}
        <h1
          className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
        >
          Confiança não tem preço, tem valor
        </h1>
        <p
          className="max-w-xl text-base text-white/80 sm:text-lg"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}
        >
          Seguros, benefícios corporativos e serviços financeiros sob medida
          para sua empresa, com um só contato do início ao fim.
        </p>
        <Button
          asChild
          size="lg"
          className="pointer-events-auto mt-2 hover:bg-[color-mix(in_oklch,var(--primary),black_15%)]"
        >
          <Link href="#" aria-label="Fale com a gente sobre seguros e benefícios da sua empresa">
            Fale com a gente
          </Link>
        </Button>
      </div>
    </section>
  );
}
