import { HeartPulse, Smile, ShieldCheck, PiggyBank } from "lucide-react";

const SERVICES = [
  {
    icon: HeartPulse,
    title: "Saúde",
    description:
      "Planos de saúde empresariais com rede ampla e atendimento ágil.",
  },
  {
    icon: Smile,
    title: "Odontológico",
    description:
      "Cobertura odontológica completa, integrada ao plano de saúde.",
  },
  {
    icon: ShieldCheck,
    title: "Vida",
    description:
      "Seguro de vida em grupo com condições especiais para empresas.",
  },
  {
    icon: PiggyBank,
    title: "Previdência",
    description:
      "Planos de previdência privada para complementar a aposentadoria.",
  },
];

export function ServiceCards() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
          Nossos serviços
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Icon className="mb-4 h-8 w-8 text-[#294799]" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
