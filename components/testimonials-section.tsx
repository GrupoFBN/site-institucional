import Image from "next/image";

// Real client quotes and headshots pulled from grupofbn.com.br's own "O
// que dizem os clientes" section (confirmed live, 2026-10-01) — not
// invented. Two obvious typos in the source copy are silently corrected
// ("mistigação" -> "mitigação" for Flaya/Dupps); everything else is
// verbatim. "Solargoup" is spelled that way on the source site itself
// (not "Solargroup") — kept as published rather than guessed at. Photos
// are hotlinked from their original grupofbn.com.br URLs rather than
// copied locally, same source these quotes already came from.
const TESTIMONIALS = [
  {
    name: "Ivan",
    company: "Sorridents",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/cadqle5aoaj-_1_.webp",
    quote:
      "Venho aqui expressar a minha gratidão a FBN. Resolveu um caso que parecia perdido para a seguradora. Só tenho a agradecer o profissionalismo da FBN, e divulgar o trabalho deles para todos vocês.",
  },
  {
    name: "Silvana",
    company: "GiO",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/rdkcc0jxuqe-1.png",
    quote:
      "Sou franqueada das marcas Sorridents e Gio. Fiz a contratação do seguro empresarial e responsabilidade civil, queria compartilhar que o atendimento além de ser ótimo, existe muita experiência da equipe, nesse ramo. Obrigado FBN.",
  },
  {
    name: "Patricia Siebra",
    company: "COO, Buddha Spa",
    photo:
      "https://grupofbn.com.br/wp-content/uploads/2025/05/Patricia-Siebra-COO-Budddha-Spa-_1_.webp",
    quote:
      "Tivemos um sinistro em um equipamento essencial para o negócio. Pedi ajuda para a FBN, que, na ocasião, ainda não era nosso parceiro, mas prestou total suporte e forneceu orientações sobre o caso.",
  },
  {
    name: "Fabiana Barros",
    company: "Além do Olhar",
    photo:
      "https://grupofbn.com.br/wp-content/uploads/2025/05/Fabiana-Odontoclinic.jpeg-_1_.webp",
    quote:
      "Que satisfação renovar essa parceria com a FBN. Sempre pude contar com um time comprometido, esclarecedor e pronto para ajudar. A FBN vai além do suporte — eles fazem realmente a diferença.",
  },
  {
    name: "Juliana",
    company: "Hurst",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/juliana-1.jpg",
    quote:
      "Desde que cheguei aqui na Hurst, sou muito bem atendida pelo time da FBN. O time além de ser sensacional, é extremamente dedicado e atencioso. Sempre que há um problema, resolvem tudo de forma ágil e eficaz.",
  },
  {
    name: "Ronaldo",
    company: "Solargoup",
    photo:
      "https://grupofbn.com.br/wp-content/uploads/2025/05/WhatsApp-Image-2023-08-23-at-14.51.25-1.jpeg",
    quote:
      "Gostaria de dizer que sou cliente da FBN há mais de 10 anos. Vivo tranquilo e certo de que estou bem assessorado, tendo apoio sempre que preciso.",
  },
  {
    name: "Gisele",
    company: "Nordex",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/gisele-1-1.png",
    quote:
      "A minha experiência com a FBN é sempre ótima. O atendimento é muito próximo e atencioso. Sempre consigo esclarecer minhas dúvidas, por isto gosto e indico, sem ressalvas.",
  },
  {
    name: "Dra. Fernanda",
    company: "Médica",
    photo:
      "https://grupofbn.com.br/wp-content/uploads/2025/05/WhatsApp-Image-2023-08-23-at-08.07.56-1.jpeg",
    quote:
      "Sou cliente da FBN, sempre fui muito bem assistida, quando precisei. A equipe sempre me apresenta as melhores propostas, dentro daquilo que procuro, e me tiram as dúvidas.",
  },
  {
    name: "Flaya",
    company: "Dupps",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/Flaya-1-1.jpg",
    quote:
      "A equipe da FBN é muito comprometida. Existe um acompanhamento bem próximo, esforçam-se verdadeiramente para o melhor cenário, com decisões estratégicas e mitigação de riscos.",
  },
  {
    name: "Guilherme",
    company: "Liga Ventures",
    photo: "https://grupofbn.com.br/wp-content/uploads/2025/05/424ad08-1-1.png",
    quote:
      "A FBN foi fundamental para a Liga Ventures dar um salto na retenção de talentos, na avaliação das melhores opções de seguros do mercado, com olhar experiente, qualificado e atento à nossa realidade.",
  },
] as const;

// Real, confirmed live on grupofbn.com.br (2026-10-01) — see PRODUCT.md
// "Evidence on Hand". Used here instead of a generic star rating: a star
// icon is a consumer-review convention that carries no information of its
// own (every quote on the source site is already 5/5), while this number
// is specific proof that belongs to this testimony list, not decoration.
const TRUSTED_BY_COUNT = "+1.200";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials-section"
      className="border-t border-gray-200 bg-white px-6 py-16 sm:px-10 lg:py-24"
    >
      {/* Same recurring mechanism as trust-section.tsx / cta-final.tsx /
          next-section.tsx: a sticky-pinned heading in its own containing
          block, releasing into the content that proves it — rather than a
          one-off horizontal card carousel found nowhere else on the page.
          Ten real, named statements read more like a dossier being laid
          out than a review-widget grid, so the index number (01-10) is
          earned here — it's genuinely a sequential list, not a generic
          counter bolted onto unordered content. */}
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        <div className="max-w-sm">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              O que dizem os clientes
            </h2>
            <p className="mt-4 text-gray-600">
              {TRUSTED_BY_COUNT} empresas confiam a gestão dos seus benefícios
              à FBN. Aqui estão as palavras de algumas delas.
            </p>
          </div>
          <div className="hidden h-[20vh] lg:block" />
        </div>

        <ul className="border-t border-gray-200">
          {TESTIMONIALS.map((item, i) => (
            <li
              key={`${item.name}-${item.company}`}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-gray-200 py-8 sm:grid-cols-[3rem_1fr]"
            >
              <span className="pt-1 text-sm font-semibold tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <blockquote className="max-w-2xl text-lg font-medium leading-snug text-gray-900 sm:text-xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <Image
                    src={item.photo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover grayscale"
                  />
                  <p className="text-sm">
                    <span className="font-semibold text-brand-dark">{item.name}</span>
                    <span className="block text-gray-500">{item.company}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
