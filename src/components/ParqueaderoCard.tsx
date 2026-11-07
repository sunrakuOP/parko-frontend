import Link from "next/link";
import OccupancyBar from "./OccupancyBar";
import type { Espacio, Parqueadero } from "@/types/api";

export default function ParqueaderoCard({
  p,
  espacios,
  featured = false,
}: {
  p: Parqueadero;
  espacios: Espacio[];
  featured?: boolean;
}) {
  const mios = espacios.filter((e) => e.parqueaderoId === p.id);
  const libres = mios.filter((e) => e.estado === "disponible").length;
  return (
    <Link
      href={`/parqueaderos/${p.id}`}
      className="group block border-2 border-ink p-5 transition-transform duration-300 [transition-timing-function:var(--ease-out-back)] hover:-translate-y-1 md:p-7"
      style={{ background: featured ? "var(--ink)" : "var(--paper-3)", color: featured ? "var(--paper)" : "var(--ink)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={featured ? "h2" : "h3"}>{p.nombre}</h3>
          <p className="mono mt-1 text-xs" style={{ color: featured ? "#aeb3bb" : "var(--muted)" }}>{p.direccion}</p>
        </div>
        <div className="text-right">
          <p className="mono font-bold leading-none" style={{ fontSize: featured ? "3.5rem" : "2.25rem", color: featured ? "var(--go)" : "var(--ink)" }}>
            {libres}
          </p>
          <p className="label" style={{ color: featured ? "#aeb3bb" : undefined }}>libres de {mios.length || p.capacidadTotal}</p>
        </div>
      </div>
      <div className="mt-6">
        <OccupancyBar espacios={mios} />
      </div>
      <p className="mt-4 text-sm font-bold">
        Ver plano y reservar <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      </p>
    </Link>
  );
}
