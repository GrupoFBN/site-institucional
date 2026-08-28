const PARTNERS = [
  "Seguradora A",
  "Seguradora B",
  "Seguradora C",
  "Seguradora D",
  "Seguradora E",
];

export function PartnerLogos() {
  return (
    <div className="relative z-10 border-t border-white/15 px-6 py-6 pointer-events-none sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {PARTNERS.map((partner) => (
          <span
            key={partner}
            className="text-sm font-semibold uppercase tracking-wide text-white/70"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
