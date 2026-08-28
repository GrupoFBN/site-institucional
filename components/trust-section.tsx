import { Lock, Layers, Boxes, TrendingUp, Zap } from "lucide-react";

const POINTS = [
  {
    icon: Lock,
    title: "Confiança que você pode contar",
    description: "Corretora registrada e regulamentada pela SUSEP.",
  },
  {
    icon: Layers,
    title: "Confiabilidade de alto nível",
    description: "Atendimento dedicado do orçamento ao sinistro.",
  },
  {
    icon: Boxes,
    title: "Tudo em um só lugar",
    description: "Saúde, odontológico, vida e previdência com um só contato.",
  },
  {
    icon: TrendingUp,
    title: "Otimizações inclusas",
    description: "Negociação ativa para reduzir custo e melhorar cobertura.",
  },
  {
    icon: Zap,
    title: "Fácil de contratar",
    description: "Processo simples, do orçamento à assinatura.",
  },
];

export function TrustSection() {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-16 max-w-2xl text-2xl font-medium leading-snug text-gray-900 sm:text-3xl">
          Gerencie os benefícios da sua empresa com confiança.{" "}
          <span className="text-gray-400">
            A FBN entrega o controle, a confiabilidade e a expertise que sua
            empresa precisa.
          </span>
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg bg-gray-50 p-6 transition hover:bg-gray-100"
            >
              <Icon className="mb-10 h-5 w-5 text-gray-700" />
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
