import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { HeroImageRoll } from "@/components/hero-image-roll";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col overflow-hidden text-white">
      <HeroImageRoll />
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center pointer-events-none">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
          Corretora de benefícios
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Benefícios que cuidam de quem importa
        </h1>
        <p className="max-w-xl text-base text-white/80 sm:text-lg">
          Planos de saúde, odontológico, vida e previdência sob medida para
          sua empresa, com atendimento próximo do início ao fim.
        </p>
        <Button
          asChild
          size="lg"
          className="pointer-events-auto mt-2 hover:bg-[color-mix(in_oklch,var(--primary),black_15%)]"
        >
          <Link href="#">Fale com a gente</Link>
        </Button>
      </div>
    </section>
  );
}
