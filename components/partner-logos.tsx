const PARTNERS = [
  "Seguradora A",
  "Seguradora B",
  "Seguradora C",
  "Seguradora D",
  "Seguradora E",
];

export function PartnerLogos() {
  return (
    <section className="bg-gray-50 px-6 py-12 sm:px-10">
      <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-gray-500">
        Seguradoras parceiras
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {PARTNERS.map((partner) => (
          <span
            key={partner}
            className="text-lg font-semibold text-gray-400 grayscale"
          >
            {partner}
          </span>
        ))}
      </div>
    </section>
  );
}
