import Image from "next/image";
import { Medal, ShieldCheck, ThumbsUp } from "lucide-react";

// "Quem somos": a featured photo pinned on one side, the three highlight
// cards from the current Franquia Protegida site stacked on the other.
// Booth photo kept in color (the brand blue and the logos are the point).
const FEATURED_IMAGE = "/stand-fbn-abf.jpg";
const CARD = "bg-[linear-gradient(22deg,#2065F1_0%,#13192C_100%)]";

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: "Protegendo desde 1996." },
  { icon: Medal, text: "Homologada pela ABF desde 2022." },
  { icon: ThumbsUp, text: "Reconhecidos por inovar e propor soluções que resolvem" },
];

export function FpStories() {
  return (
    <section id="proposta" className="bg-[#F6F5F4] px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1140px]">
        <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight text-[#13192C] sm:text-4xl">
          O primeiro programa de proteção e prevenção feito sob medida para redes de franquia no Brasil.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="lg:order-2">
            <figure
              style={{ aspectRatio: "1039 / 1514" }}
              className="relative overflow-hidden bg-gray-100 lg:sticky lg:top-[calc(4.75rem-4px)]"
            >
              <Image
                src={FEATURED_IMAGE}
                alt="Equipe do Grupo FBN no estande Franquia Protegida, com a marca da FBN e o selo ABF"
                fill
                sizes="(min-width: 1024px) 570px, 100vw"
                className="object-cover"
              />
            </figure>
          </div>

          {/* The cards share the photo's height: three equal rows. */}
          <ul className="grid gap-5 lg:order-1 lg:grid-rows-3 lg:gap-8">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className={`flex flex-col justify-between rounded-[25px] px-8 pb-8 pt-9 text-white ${CARD}`}
              >
                <Icon aria-hidden="true" className="h-10 w-10" strokeWidth={2} />
                <p className="mt-10 text-2xl font-semibold leading-snug lg:mt-0">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
