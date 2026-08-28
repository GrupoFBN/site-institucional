import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaFinal() {
  return (
    <section className="bg-primary px-6 py-20 text-center text-white sm:px-10">
      <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
        Pronto pra oferecer o melhor benefício?
      </h2>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="mt-8 border-white bg-transparent text-white hover:bg-white hover:text-primary"
      >
        <Link href="/contato">Fale com a gente</Link>
      </Button>
    </section>
  );
}
