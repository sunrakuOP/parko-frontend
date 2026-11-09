import type { EstadoFila } from "@/types/api";

const CARROS: Record<EstadoFila, number> = { sin_fila: 0, corta: 3, larga: 6 };
const COLOR: Record<EstadoFila, string> = { sin_fila: "var(--canopy)", corta: "var(--amber)", larga: "var(--brick)" };
const TITULO: Record<EstadoFila, string> = { sin_fila: "Sin fila", corta: "Fila corta", larga: "Fila larga" };
const SUB: Record<EstadoFila, string> = { sin_fila: "Entras directo", corta: "Espera corta", larga: "Espera larga" };

/**
 * Fila en la entrada: un carril con carros en cola frente a la barrera. Sin fila, la barrera
 * está arriba y el carril libre; con fila, la barrera baja y se acumulan carros.
 */
export default function FilaLane({ fila, compact = false }: { fila: EstadoFila; compact?: boolean }) {
  const n = CARROS[fila];
  const color = COLOR[fila];
  const abierta = fila === "sin_fila";
  const w = compact ? 132 : 168;
  return (
    <div className="flex flex-col gap-1.5" role="img" aria-label={`${TITULO[fila]}: ${SUB[fila]}`}>
      <svg width={w} height="44" viewBox="0 0 168 44" aria-hidden>
        <rect x="0" y="6" width="168" height="32" rx="16" fill="var(--paper-2)" />
        <line x1="16" y1="22" x2="112" y2="22" stroke="var(--ink)" strokeOpacity=".16" strokeWidth="2" strokeDasharray="5 7" />
        {Array.from({ length: n }, (_, i) => (
          <g key={i} className="lane-car" style={{ ["--c" as string]: i }}>
            <rect x={122 - i * 19} y="16.5" width="16" height="11" rx="4" fill={color} />
            <rect x={133 - i * 19} y="18.5" width="3.5" height="7" rx="1.5" fill="#fff" opacity=".7" />
          </g>
        ))}
        {/* barrera: poste + brazo (arriba = abierta) */}
        <rect x="143" y="9" width="7" height="26" rx="3.5" fill="var(--ink)" />
        <rect className="gate-arm" x="148" y="20.2" width="17" height="3.6" rx="1.8" fill={abierta ? "var(--canopy)" : "var(--brick)"}
          style={{ transform: abierta ? "rotate(-62deg)" : "none" }} />
      </svg>
      <p className="leading-tight">
        <span className="block text-[0.95rem] font-extrabold" style={{ color: `var(--ink-${abierta ? "libre" : fila === "corta" ? "pocos" : "lleno"})` }}>{TITULO[fila]}</span>
        <span className="small">{SUB[fila]}</span>
      </p>
    </div>
  );
}
