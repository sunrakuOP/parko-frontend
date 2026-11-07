/** Marca: una grilla de 4 celdas de plaza, una libre (contorno) y tres ocupadas. */
export default function Logo({ size = 30, ink = "var(--ink)" }: { size?: number; ink?: string }) {
  const c = size * 0.38;
  const g = size * 0.1;
  const cell = (x: number, y: number, on: boolean) => (
    <rect key={`${x}${y}`} x={x} y={y} width={c} height={c} rx={size * 0.1}
      fill={on ? ink : "none"} stroke={ink} strokeWidth={size * 0.07} />
  );
  const o = size * 0.04;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {cell(o, o, true)}
      {cell(o + c + g, o, true)}
      {cell(o, o + c + g, true)}
      <rect x={o + c + g} y={o + c + g} width={c} height={c} rx={size * 0.1} fill="var(--canopy)" />
    </svg>
  );
}
