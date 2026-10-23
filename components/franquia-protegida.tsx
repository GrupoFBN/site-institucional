import { Sora } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { House, Mail } from "lucide-react";
import { FpTestimonials, type FpQuote } from "@/components/fp-carousel";
import { FpHeader } from "@/components/fp-header";
import { FpGallery, type FpPhoto } from "@/components/fp-gallery";

// Server-rendered pieces of the Franquia Protegida page. Copy and assets come
// from the program's current site (franquiaprotegida.com.br); nothing here is
// invented. Images are hotlinked from there, as the home page does with
// grupofbn.com.br.
export const UPLOADS = "https://franquiaprotegida.com.br/wp-content/uploads";

const buttonClass =
  "inline-flex h-12 items-center rounded-lg bg-white px-6 text-sm font-semibold text-brand-dark transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function FpHero() {
  return (
    <section id="inicio" className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-brand-dark text-white">
      {/* Unsplash photo of a team at work, given the same gray + brand-blue
          treatment as the photos on the home page (grayscale under a
          `mix-blend-color` layer), so it reads as one family with the site.
          Placeholder until the program has its own photography. */}
      <Image
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&q=80&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_60%] grayscale"
      />
      <div className="absolute inset-0 bg-primary mix-blend-color" />
      {/* Keeps the text legible where the photo is bright, without hiding it. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/35 to-brand-dark/10" />

      <FpHeader logoSrc={`${UPLOADS}/2025/03/fbn_escrito-_1_-1.webp`} />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-24 pt-24 sm:px-6 lg:pt-[clamp(84px,6.5vw,123px)]">
        <div className="max-w-2xl">
          <h1 className="text-balance text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            O Risk Manager de sua rede
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg text-white/85">
            O primeiro programa de prevenção e proteção para franqueadores e franqueados.
          </p>
          <a href="#contato" className={`${buttonClass} mt-10`}>
            Quero conhecer
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Everything below the hero follows the current site's own design: Sora type,
// a #F8F8FF page, outlined blue labels, blue-to-navy gradient cards and a
// 1140px column. Only the hero above was redesigned.
// ---------------------------------------------------------------------------

export const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const INK = "text-[#13192C]";
const CARD = "bg-[linear-gradient(22deg,#2065F1_0%,#13192C_100%)]";
const H2 = `text-balance text-center text-[clamp(1.75rem,2.5vw,2.25rem)] font-semibold leading-[1.4] ${INK}`;

// The outlined label above each section heading.
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#267ED7] px-[22px] py-[10px] text-[15px] font-semibold leading-[21px] text-[#2065F1]">
      {children}
    </span>
  );
}

// Hairline between sections, fading out at both ends.
function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px max-w-[1140px] bg-gradient-to-r from-transparent via-[#2065F1]/30 to-transparent"
    />
  );
}

export function FpAbout() {
  return (
    <>
      <section id="premio" className="bg-[#F8F8FF] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-[1140px] items-center gap-8 md:grid-cols-[565px_minmax(0,1fr)] md:gap-[50px]">
          <div className="overflow-hidden rounded-md">
            <Image
              src={`${UPLOADS}/2026/04/premio-abccom.jpg`}
              alt="Representantes do Franquia Protegida com o troféu do Prêmio ABC"
              width={800}
              height={840}
              className="h-auto w-full"
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <Pill>Prêmio ABC</Pill>
            <div className="flex flex-col gap-4 text-base leading-[22.4px] text-black">
              <p>
                Em dezembro de 2024, durante o evento do Prêmio ABC, que é um dos, se não o evento mais aguardado do
                ano em nossa região, o projeto Franquia Protegida teve o seu mérito devidamente reconhecido na
                categoria “melhores projetos com novas tecnologias”, e como resultado, recebeu o prestigioso “Troféu
                Lobo de Bronze”.
              </p>
              <p>
                Essa conquista, por sua vez, reafirma que nosso objetivo vai além de simplesmente oferecer proteção;
                desejamos transformar a relação entre franqueadores e seus negócios, ao mesmo tempo proporcionando
                segurança e tranquilidade necessárias para o crescimento sustentável. Além disso, o troféu simboliza o
                início de uma jornada repleta de desafios que estamos completamente preparados para enfrentar.
                Acreditamos que, com dedicação e inovação, podemos continuar a impactar positivamente o futuro do
                franchising.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8FF] px-4 pb-10 pt-6 sm:px-6">
        <div
          className={`mx-auto flex max-w-[1200px] flex-col items-center rounded-[25px] px-6 py-[50px] text-center text-white ${CARD}`}
        >
          <h2 className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-semibold leading-[1.2]">O que entregamos</h2>
          <p className="mt-4 max-w-[700px] text-pretty text-base font-medium leading-6">
            Entregamos prevenção e consultoria permanente para os franqueados e franqueador. Customizamos produtos e
            serviços de acordo com a matriz de riscos da rede. Protegemos a operação desde a implementação à jornada
            do cliente.
          </p>
          <a
            href="#contato"
            className="mt-6 inline-flex h-14 items-center rounded-full bg-[#13192C] px-[15px] text-base text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Saiba mais
          </a>
        </div>
      </section>
    </>
  );
}

// `file` lives on the program's current site; `url` is a file kept in this
// project. Sorrix, Odontoclinic and Oral Unic use the logos from the
// Sorridents self-contracting site's own assets (`redes/`): cropped tight to
// the mark, unlike the padded 256px squares on the current site.
export const CLIENTS: { name: string; file?: string; url?: string }[] = [
  { name: "Maislaser", file: "2025/03/maislaser-256x256-1.png" },
  { name: "Além do Olhar", file: "2025/03/alem-do-olhar-256x256-1.png" },
  { name: "OdontoSpecial", file: "2025/03/odontospecial-256x256-1.png" },
  { name: "Odontoclinic", url: "/clients/odontoclinic.png" },
  { name: "Onodera", file: "2025/03/onodera-256x256-1.png" },
  { name: "Market4u", file: "2025/03/market4u-256x256-1.png" },
  { name: "Oral Unic", url: "/clients/oral-unic.png" },
  { name: "LAAV", file: "2025/12/LAAV-LOGO.png" },
  { name: "DryWash", file: "2026/08/DryWash-2.png" },
  { name: "Sorridents", file: "2025/03/sorridents-256x256-1.png" },
  { name: "GIO Estética Avançada", file: "2025/03/giolaser-256x256-1.png" },
  { name: "Amo Vacinas", file: "2025/03/amo-vacinas-256x256-1.png" },
  { name: "Olhar Certo", file: "2025/03/olhar-certo-256x256-1.png" },
  { name: "Sorrix", url: "/clients/sorrix.png" },
];

export const clientSrc = (client: (typeof CLIENTS)[number]) => client.url ?? `${UPLOADS}/${client.file}`;

export function FpClients() {
  return (
    <section id="clientes" className="bg-[#F8F8FF] pt-10 text-center">
      <Divider />
      <div className="px-4 pt-[70px] sm:px-6">
        <Pill>MARCAS</Pill>
        <h2 className={`mt-4 ${H2}`}>Conheça nossos clientes</h2>
      </div>
      {/* The strip runs the full width of the page; the second list is a
          copy for the endless loop and is hidden from assistive tech. */}
      <div className="fp-marquee mt-6 overflow-hidden pb-[60px]">
        <div className="fp-marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0">
              {CLIENTS.map((client) => (
                <li key={client.name} className="flex w-[251px] shrink-0 items-center justify-center">
                  <Image
                    src={clientSrc(client)}
                    alt={copy === 0 ? client.name : ""}
                    width={150}
                    height={150}
                    className="h-[150px] w-[150px] object-contain"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUOTES: FpQuote[] = [
  {
    name: "Ivan",
    company: "Sorridents",
    photo: `${UPLOADS}/2025/05/cadqle5aoaj-_1_.webp`,
    quote:
      "Venho aqui expressar a minha gratidão a FBN. Resolveu um caso que parecia perdido para a seguradora. Só tenho a agradecer o profissionalismo da FBN, e divulgar o trabalho deles para todos vocês.",
  },
  {
    name: "Silvana",
    company: "GiO",
    photo: `${UPLOADS}/2025/05/rdkcc0jxuqe-1.png`,
    quote:
      "Sou franqueada das marcas Sorridents e Gio. Fiz a contratação do seguro empresarial e responsabilidade civil, queria compartilhar que o atendimento além de ser ótimo, existe muita experiência da equipe, nesse ramo. Obrigado FBN",
  },
  {
    name: "Patricia Siebra",
    company: "COO - Buddha Spa",
    photo: `${UPLOADS}/2025/05/Patricia-Siebra-COO-Budddha-Spa-_1_.webp`,
    quote:
      "Em uma situação no passado, eu estava em outro grupo que ainda não tinha a visão de homologar um parceiro para a área de prevenção de riscos. Tivemos um sinistro em um equipamento essencial para o negócio. Peguei a apólice do franqueado para conferir e pedi ajuda para a FBN, que, na ocasião, ainda não era nosso parceiro, mas prestou total suporte e forneceu orientações sobre o caso.",
  },
  {
    name: "Fabiana Barros",
    company: "Além do Olhar",
    photo: `${UPLOADS}/2025/05/Fabiana-Odontoclinic.jpeg-_1_-1.webp`,
    quote:
      "Que satisfação renovar essa parceria com a FBN. Tive a oportunidade de trabalhar com eles na minha empresa anterior e sempre pude contar com um time comprometido, esclarecedor e pronto para ajudar. Agora, nesta nova jornada, sei que essa parceria continuará sendo essencial para garantir a segurança e o crescimento das unidades franqueados. A FBN vai além do suporte, eles fazem realmente a diferença.",
  },
];

const VIDEOS = [
  { id: "ZpthXDo2bqw", title: "Case de cliente do Franquia Protegida, vídeo 1" },
  { id: "72v0Kjhzwpc", title: "Case de cliente do Franquia Protegida, vídeo 2" },
];

export function FpCases() {
  return (
    <section id="cases" className="bg-[#F6F5F4] pb-[70px] pt-10 text-center">
      <Divider />
      <div className="px-4 pt-[70px] sm:px-6">
        <h2 className={H2}>O que dizem os nossos clientes</h2>
        <div className="mt-8">
          <FpTestimonials items={QUOTES} />
        </div>

        <h2 className={`mt-14 ${H2}`}>Assista aos cases do Franquia Protegida</h2>
        <div className="mx-auto mt-8 grid max-w-[1092px] gap-5 md:grid-cols-2">
          {VIDEOS.map((video) => (
            <div key={video.id} className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                title={video.title}
                loading="lazy"
                allow="encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Width / height of each photo as the current site lays them out.
const ROWS: FpPhoto[][] = [
  [
    { src: "2025/03/Time-com-Cleber-e-Lucy-_1__1-1-scaled-1.webp", ratio: 1.331 },
    { src: "2025/03/Time-com-Carla-e-Mario-_1_-1-scaled-e1739543844390.webp", ratio: 0.752 },
    { src: "2025/03/Patricia-Siebra-_1_-1-scaled-1.webp", ratio: 0.752 },
  ],
  [
    { src: "2025/03/Imagem-do-WhatsApp-de-2025-02-14-a_s_-19.24.52_65e7c5c2.webp", ratio: 0.749 },
    { src: "2025/03/Imagem-do-WhatsApp-de-2025-02-17-a_s_-14.35.57_2c23f665.webp", ratio: 0.559 },
    { src: "2025/05/Franquia-protegida-_Nadim-Oral-Unic_-scaled-1.webp", ratio: 1.159 },
  ],
  [
    { src: "2025/05/Franquia-protegida_Fred-Bruna_-Oral-Unic-scaled-1.webp", ratio: 1.208 },
    { src: "2025/07/market4u-scaled.webp", ratio: 0.751 },
    { src: "2025/07/Market4u-eduardo-e-o-sandro-scaled.webp", ratio: 0.751 },
  ],
  [
    { src: "2026/02/Kleber-Gabriela-Cleber-Salus-convencao2026-scaled.jpg", ratio: 1.78 },
    { src: "2026/05/odontoclinic-Hilton-Carlos-Claudia.jpeg", ratio: 1.333 },
  ],
  [
    { src: "2026/08/laav-6.png", ratio: 0.8 },
    { src: "2026/08/Maislaser-CNF-Fev.-2025-_-_1459-1-scaled.jpg", ratio: 1.5 },
  ],
].map((row) => row.map((photo) => ({ ...photo, src: `${UPLOADS}/${photo.src}` })));

export function FpMoments() {
  return (
    <section id="galeria" className="bg-[#F6F5F4] pt-10 text-center">
      <Divider />
      <div className="px-4 pt-[70px] sm:px-6">
        <div className="mx-auto max-w-[1140px]">
          <h2 className={H2}>Franquia Protegida está sempre presente</h2>
          <FpGallery rows={ROWS} />
        </div>
      </div>
    </section>
  );
}

const PEOPLE = [
  {
    name: "Kleber de Paula",
    role: "CEO Founder",
    photo: `${UPLOADS}/2025/03/kleber-pagina-_1_-_1_.webp`,
    linkedin: "https://www.linkedin.com/in/kleberdepaula/",
  },
  {
    name: "Gabriela Carvalho",
    role: "Diretora Comercial",
    photo: `${UPLOADS}/2025/03/1728921548305-1.webp`,
    linkedin: "https://www.linkedin.com/in/gabrielacarvalhofbn/",
  },
];

const pillLink =
  "flex h-14 items-center justify-center gap-3 rounded-full bg-white/[0.07] px-[15px] text-base font-light text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function FpContact() {
  return (
    <section id="contato" className="bg-[#F8F8FF] px-4 pb-[60px] pt-10 text-center sm:px-6">
      <Divider />
      <div className="pt-[70px]">
        <Pill>CONTATO</Pill>
        <div
          className={`mx-auto mt-8 max-w-[600px] rounded-lg border border-white/10 px-6 pb-8 pt-10 text-white sm:px-10 sm:pb-10 sm:pt-[60px] ${CARD}`}
        >
          <h2 className="text-2xl font-medium leading-[1.3]">Nossos canais de atendimento:</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {PEOPLE.map((person) => (
              <li key={person.name} className="flex flex-col items-center">
                <Image
                  src={person.photo}
                  alt=""
                  width={150}
                  height={150}
                  className="h-[150px] w-[150px] rounded-full border-[4.67px] border-white object-cover"
                />
                <p className="mt-[27px] text-base font-semibold leading-[19.2px]">{person.name}</p>
                <p className="mt-1 text-base font-light leading-6">{person.role}</p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener"
                  className={`${pillLink} mt-5 w-full max-w-[214px]`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://cdn.simpleicons.org/linkedin/ffffff" alt="" width={18} height={18} />
                  Linkedin
                </a>
              </li>
            ))}
          </ul>
          <a href="mailto:franquiaprotegida@grupofbn.com.br" className={`${pillLink} mt-[30px] w-full`}>
            <Mail aria-hidden="true" className="h-[18px] w-[18px]" />
            <span className="font-medium">E-mail: franquiaprotegida@grupofbn.com.br</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/grupofbn/posts/?feedView=all", slug: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/franquiaprotegida", slug: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@grupofbn", slug: "youtube" },
];

export function FpFooter() {
  return (
    <footer className="bg-[#2065F1] bg-[radial-gradient(circle_at_54%_0%,#6D9BF8_0%,#3E7BF5_20%,#1E64F0_55%,#1E489C_82.5%,#193D85_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-center gap-x-16 gap-y-6">
        <Image
          src={`${UPLOADS}/2025/03/Grupo-FBN_LOGO-FD-1024x502-1-300x147-1.webp`}
          alt="Grupo FBN"
          width={130}
          height={64}
          className="h-16 w-[130px] object-contain"
        />
        <Image
          src={`${UPLOADS}/2025/07/ABF_LOGO2023_ASSOCIADO_H_RGB_Negativo_Final.webp`}
          alt="ABF, Associação Brasileira de Franchising"
          width={163}
          height={44}
          className="h-11 w-[163px] object-contain"
        />
        <ul className="flex gap-[5px]">
          {SOCIAL.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:bg-[#F8F8FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://cdn.simpleicons.org/${item.slug}/2065F1`} alt="" width={18} height={18} />
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/"
              aria-label="Grupo FBN"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2065F1] transition hover:bg-[#F8F8FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <House aria-hidden="true" className="h-[18px] w-[18px]" />
            </Link>
          </li>
        </ul>
      </div>
      <p className="mt-6 text-center text-base">© Todos os direitos reservados</p>
    </footer>
  );
}
