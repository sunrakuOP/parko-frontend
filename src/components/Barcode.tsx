/** Código de barras decorativo derivado de un texto (placa + id): mismo texto, mismo código. */
export default function Barcode({ value, height = 38 }: { value: string; height?: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of value.toUpperCase()) {
    const c = ch.charCodeAt(0);
    for (let b = 0; b < 5; b++) {
      const w = ((c >> b) & 1) + 1;
      if (b % 2 === 0) bars.push({ x, w });
      x += w + 1;
    }
    x += 2;
  }
  return (
    <svg width={Math.min(x, 150)} height={height} viewBox={`0 0 ${x} ${height}`} preserveAspectRatio="none" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="var(--ink)" />
      ))}
    </svg>
  );
}
