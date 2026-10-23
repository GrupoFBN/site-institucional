import { BRAZIL_STATES } from "@/lib/brazil-states";

const PULSING_STATES = new Set([
  "SP", "RJ", "ES", "MG", "PR", "SC", "SE", "RS", "DF", "GO",
  "CE", "RN", "BA", "PA", "MT", "MS", "PE", "MA", "AL", "RO",
  "PB", "AC",
]);

// Real state borders (see lib/brazil-states.ts for the projection/source),
// rendered as one stroked path per state so the internal divisions show up,
// not just the country's outer coastline. The highlighted states pulse with
// a fake 3D rise (translateY + scale + drop-shadow, all CSS) — painted last
// so the "lifted" state visually overlaps its neighbors instead of being
// clipped under them.
export function BrazilOrbit() {
  const rest = BRAZIL_STATES.filter((s) => !PULSING_STATES.has(s.sigla));
  const pulsing = BRAZIL_STATES.filter((s) => PULSING_STATES.has(s.sigla));

  return (
    <div className="pointer-events-none mx-auto aspect-square w-full max-w-lg opacity-90 sm:max-w-2xl">
      <svg viewBox="0 0 1000 1000" className="h-full w-full" fill="none">
        {rest.map((state) => (
          <path
            key={state.sigla}
            d={state.d}
            fill="white"
            fillOpacity="0.05"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {pulsing.map((state) => (
          <path
            key={state.sigla}
            d={state.d}
            fill="#5b7cd6"
            stroke="#5b7cd6"
            strokeWidth="1.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              animation: "state-pulse 2.6s ease-in-out infinite",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
