import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center text-brand-dark"
    >
      <h1 className="text-4xl font-bold sm:text-5xl">Página não encontrada</h1>
      <p className="max-w-md text-gray-600">
        O endereço que você abriu não existe ou foi movido. Volte para o início e continue por lá.
      </p>
      <Button asChild size="lg">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </main>
  );
}
