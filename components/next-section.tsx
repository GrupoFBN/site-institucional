"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

// Real category names (per user instruction, 2026-10-01). Descriptions
// for the first three are built only from confirmed real items/claims on
// grupofbn.com.br (not invented): "Benefícios" and "Ramos elementares"
// from the exact service lists on /servicos/, "Franquia protegida" from
// the homepage's own "DESENVOLVEMOS PROJETOS CUSTOMIZADOS PARA
// FRANQUEADORES" claim. "Monetiza" has no confirmed description anywhere
// on the old site beyond the name itself (it's a bare nav link there
// too) — kept deliberately short rather than inventing specifics; ask the
// user for real copy before shipping. The old "PARCEIRO 1-12" badges
// were removed outright instead of relabeled: grupofbn.com.br has no
// named insurance-carrier partners (confirmed), so there was nothing
// real to put in them.
const CATEGORIES = [
  {
    title: "Benefícios",
    href: "#contato",
    description:
      "Planos de saúde, odontológico, vida e previdência pra você, sua família e o seu time.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Ramos elementares",
    href: "#contato",
    description:
      "Seguro empresarial, de frota, de carga, D&O, E&O e riscos cibernéticos, entre outros, pra proteger o patrimônio e a operação da sua empresa.",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Franquia protegida",
    href: "/franquia-protegida",
    description: "Projetos customizados de proteção pra franqueadores e suas unidades franqueadas.",
    image:
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Monetiza",
    href: "#contato",
    description: "Conheça o programa Monetiza da FBN.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop",
  },
];

export function NextSection() {
  const [openIndex, setOpenIndex] = useState(CATEGORIES.length - 1);
  // Which category's image+badges show on the right — kept separate from
  // openIndex so closing an accordion item doesn't blank the image out;
  // it only changes when a DIFFERENT item is opened.
  const [activeIndex, setActiveIndex] = useState(CATEGORIES.length - 1);

  return (
    <section id="servicos" className="bg-white text-brand-dark">
      <div className="grid lg:grid-cols-2">
        <div className="py-16 pl-6 pr-6 sm:pl-10 lg:py-24">
          {/* Heading gets its own containing block (heading + spacer only)
              so it can actually pin — same pattern as trust-section.tsx and
              cta-final.tsx. The accordion below is a separate containing
              block, so it just starts wherever normal flow puts it once
              the heading has released, instead of scrolling up underneath
              a heading it shares a containing block with. */}
          <div className="max-w-xl">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Seguros e benefícios sob medida pra cada parte da sua empresa.
              </h2>
            </div>
            <div className="hidden h-[30vh] lg:block" />
          </div>

          <div className="mt-12 border-t border-gray-200">
            {CATEGORIES.map((category, i) => {
              const open = i === openIndex;
              const panelId = `category-panel-${category.title}`;
              return (
                <div key={category.title} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenIndex(open ? -1 : i);
                      setActiveIndex(i);
                    }}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span
                      className={`text-lg ${open ? "font-semibold text-brand-dark" : "text-gray-500"}`}
                    >
                      {category.title}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    />
                  </button>
                  <div
                    id={panelId}
                    inert={!open ? true : undefined}
                    className={`grid overflow-hidden transition-all duration-300 ${open ? "pb-6" : ""}`}
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0">
                      <p className="text-pretty text-gray-600">{category.description}</p>
                      <Link
                        href={category.href}
                        aria-label={`Saiba mais sobre ${category.title}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:underline"
                      >
                        Saiba mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mr-2 mb-16 h-[435px] overflow-hidden bg-gray-100 sm:mr-3 lg:mb-24 lg:mt-64 lg:h-[895px]">
          {CATEGORIES.map((category, i) => (
            <div
              key={category.title}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-primary mix-blend-color" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
