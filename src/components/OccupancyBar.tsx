import type { Espacio } from "@/types/api";

/** Barra segmentada: una celda por plaza (máx. 60 celdas), coloreada por estado. */
export default function OccupancyBar({ espacios }: { espacios: Espacio[] }) {
  const n = espacios.length;
  const count = (s: string) => espacios.filter((e) => e.estado === s).length;
  const segs = [
    { s: "disponible", c: "var(--go)", n: count("disponible") },
    { s: "reservado", c: "var(--held)", n: count("reservado") },
    { s: "ocupado", c: "var(--busy)", n: count("ocupado") },
    { s: "mantenimiento", c: "var(--off)", n: count("mantenimiento") },
  ].filter((x) => x.n > 0);
  if (n === 0) return <div className="h-3 border-2 border-ink" style={{ background: "var(--paper-2)" }} />;
  return (
    <div className="flex h-3 border-2 border-ink" role="img"
      aria-label={segs.map((x) => `${x.n} ${x.s}`).join(", ")}>
      {segs.map((x) => (
        <i key={x.s} style={{ flex: x.n, background: x.c }} />
      ))}
    </div>
  );
}
