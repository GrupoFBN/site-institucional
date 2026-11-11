import Link from "next/link";

// Last band before the footer, modeled on adyen.com's "If you're building
// for scale, there's no alternative": a full-width flat color field with one
// centered headline and one white button. Adyen's is green (their brand);
// this one takes FBN's primary blue.
//
// PLACEHOLDER COPY: the headline is an adaptation of the reference and has
// not been approved. Keep it in sync with the copy-review list.
export function ClosingCta() {
  return (
    <section
      id="cta-fechamento"
      className="flex min-h-[36rem] items-center justify-center bg-primary px-6 py-24 text-center text-white"
    >
      <div className="flex max-w-6xl flex-col items-center gap-8">
        <h2 className="max-w-4xl text-balance text-[clamp(2.25rem,3.3vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Se você está construindo para crescer, não existe alternativa
        </h2>
        <Link
          href="#contato"
          className="inline-flex h-12 items-center rounded-lg bg-white px-6 text-sm font-semibold text-brand-dark transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Fale com a gente
        </Link>
      </div>
    </section>
  );
}
