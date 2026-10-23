"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="conteudo"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center text-brand-dark"
    >
      <h1 className="text-4xl font-bold sm:text-5xl">Algo deu errado</h1>
      <p className="max-w-md text-gray-600">
        Não conseguimos carregar esta página agora. Tente de novo ou volte para o início.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" onClick={reset}>
          Tentar de novo
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </main>
  );
}
