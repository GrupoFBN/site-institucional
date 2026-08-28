const STATS = [
  { value: "+15 anos", label: "de mercado" },
  { value: "+500", label: "empresas atendidas" },
  { value: "+98%", label: "satisfação dos clientes" },
  { value: "+20", label: "seguradoras parceiras" },
];

export function Stats() {
  return (
    <section className="bg-[#0B1440] px-6 py-20 text-white sm:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 text-center sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
