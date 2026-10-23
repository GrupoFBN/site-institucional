import Image from "next/image";

// "O que é": the claim and its support line on the left, the booth photo
// (kept in color: the brand blue and the logos are the point) on the right.
export function FpWhatIs() {
  return (
    <section id="o-que-e" className="bg-[#F6F5F4] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-[1140px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16">
        <div>
          <h2 className="text-balance text-[clamp(1.875rem,3.2vw,3rem)] font-semibold leading-[1.15] text-[#13192C]">
            O primeiro programa de proteção e prevenção feito sob medida para redes de franquia no Brasil.
          </h2>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-[1.6] text-[#13192C]/80 lg:text-xl">
            Desde 2014 atuando como Risk Manager de redes, cuidando para que cada unidade continue operando,
            aconteça o que acontecer.
          </p>
        </div>
        <figure
          style={{ aspectRatio: "1039 / 1514" }}
          className="relative mx-auto w-full max-w-[460px] overflow-hidden bg-gray-100 lg:mx-0"
        >
          <Image
            src="/stand-fbn-abf.jpg"
            alt="Equipe do Grupo FBN no estande Franquia Protegida, com a marca da FBN e o selo ABF"
            fill
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
