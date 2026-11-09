import type { Nivel } from "@/lib/cupos";

const COLOR: Record<Nivel, string> = { libre: "var(--canopy)", pocos: "var(--amber)", lleno: "var(--brick)" };

/** Anillo de cupo libre (como el de una app de batería o actividad): el arco es la parte libre. */
export default function Ring({ libres, capacidad, nivel, size = 96 }: { libres: number; capacidad: number; nivel: Nivel; size?: number }) {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  const frac = capacidad > 0 ? libres / capacidad : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${libres} cupos libres de ${capacidad}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--paper-2)" strokeWidth="9" />
        <circle className="ring-arc" cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLOR[nivel]} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="num" style={{ fontSize: size * 0.3 }}>{libres}</span>
        <span className="small" style={{ fontSize: size * 0.115, marginTop: 3 }}>libres</span>
      </div>
    </div>
  );
}
