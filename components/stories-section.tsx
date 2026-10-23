import Image from "next/image";

// Layout copied from adyen.com's "When certainty matters, Adyen's the
// platform of choice" block: one large featured story pinned on the left
// while a two-column grid of square logo cards scrolls on the right.
//
// The featured card is a placeholder for FBN's trophies photo plus a
// punchy headline (per the user) — both the caption text and the Unsplash
// image below get replaced once the real assets exist.
//
// Every caption in STORIES is a close paraphrase of a real testimonial
// already published on grupofbn.com.br (see testimonials-section.tsx) — no
// invented outcomes or numbers. The cards show the company name as text
// because the old site publishes no client logo files, only headshots.
// "Solargoup" is spelled as the source site spells it.
const FEATURED = {
  caption: "Imagem dos troféus da FBN e título impactante",
  image:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop",
};

// `image` is the hover reveal (same behavior as the trust-section cards:
// grayscale + blue duotone fills the whole card). Placeholder Unsplash
// photos, reused from elsewhere on the site, until real ones exist.
const STORIES = [
  {
    company: "Sorridents",
    caption: "Sorridents teve resolvido um caso que parecia perdido para a seguradora.",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&auto=format&fit=crop",
  },
  {
    company: "GiO",
    caption: "A GiO contratou seguro empresarial e responsabilidade civil com a FBN.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
  },
  {
    company: "Buddha Spa",
    caption: "A Buddha Spa recebeu suporte da FBN em um sinistro antes mesmo de ser parceira.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    company: "Além do Olhar",
    caption: "A Além do Olhar renovou a parceria para proteger o crescimento das unidades franqueadas.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
  },
  {
    company: "Hurst",
    caption: "A Hurst resolve problemas de forma ágil e eficaz com o time da FBN.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
  },
  {
    company: "Solargoup",
    caption: "A Solargoup é cliente da FBN há mais de 10 anos.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80&auto=format&fit=crop",
  },
] as const;

export function StoriesSection() {
  return (
    <section className="bg-[#F6F5F4] px-6 py-16 sm:px-10 lg:py-24">
      {/* No max-width cap on purpose: Adyen's reference (measured off their
          screenshot at ~1900px wide) runs nearly edge to edge — ~2% side
          margin, featured card ~49% of the width, two right-hand columns
          ~23.5% each, gaps ~1.75% — so capping at max-w-7xl squeezed every
          proportion on wide screens. */}
      <div>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Quando confiança importa, a{" "}
          {/* The "fbn" lettering cropped out of the logo (public/fbn-wordmark.png,
              434x189 — no icon, no "grupo"). `unoptimized` serves the file as
              is: Next's optimizer would resample a 434px source up to its
              640px srcset step for no gain. Height is in em so it tracks the
              heading size; the image bottom is the letters' baseline (no
              descenders), so default baseline alignment sits it on the text
              line. */}
          <Image
            src="/fbn-wordmark.png"
            alt="FBN"
            width={434}
            height={189}
            unoptimized
            className="inline-block h-[0.78em] w-auto"
          />{" "}
          é a certeza
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* The grid cell stretches to the full row height; the figure
              inside it is what sticks, so it stays put while the right
              column scrolls past (same separate-containing-block pattern
              as the other pinned sections). */}
          <div>
            <figure className="relative h-[34rem] overflow-hidden bg-gray-100 lg:sticky lg:top-[calc(4.75rem-4px)] lg:h-[calc(100vh-4.75rem+4px)] lg:min-h-[32rem]">
              <Image
                src={FEATURED.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-primary mix-blend-color" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
                <p className="max-w-md text-lg font-medium leading-snug lg:text-2xl">{FEATURED.caption}</p>
              </figcaption>
            </figure>
          </div>

          <ul className="grid grid-cols-2 content-start gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-14">
            {STORIES.map((story) => (
              <li key={story.company}>
                <div className="group relative flex aspect-square items-center justify-center overflow-hidden bg-[#E6E4E2] px-4">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover grayscale opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-primary opacity-0 mix-blend-color transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative text-center text-xl font-semibold tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-white lg:text-2xl">
                    {story.company}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-snug text-gray-700 lg:mt-4 lg:text-lg">{story.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
