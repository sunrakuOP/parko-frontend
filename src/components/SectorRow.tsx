import FilaLane from "./FilaLane";
import Ring from "./Ring";
import { NivelBadge } from "./Chips";
import { libres, nivel } from "@/lib/cupos";
import type { Sector } from "@/types/api";

/** Un sector como tarjeta de app: anillo de cupo + estado + carril de fila. */
export default function SectorRow({ sector }: { sector: Sector }) {
  const l = libres(sector);
  const nv = nivel(sector);
  const ocupacion = Math.round((sector.ocupados / Math.max(sector.capacidad, 1)) * 100);
  return (
    <div className="sector-card grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 sm:grid-cols-[auto_1fr_auto]" data-tone={nv} style={{ ["--tone" as string]: `var(--tone-${nv})` }}>
      <Ring libres={l} capacidad={sector.capacidad} nivel={nv} />
      <div className="min-w-0">
        <h4 className="h3">{sector.nombre}</h4>
        <p className="small mt-0.5">
          {l} libres de {sector.capacidad}{sector.capacidadEstimada ? "*" : ""}
        </p>
        <div className="mt-2.5"><NivelBadge nivel={nv} /></div>
        <div className="bar mt-3 max-w-[16rem]" role="img" aria-label={`${ocupacion}% ocupado`}><i style={{ width: `${ocupacion}%` }} /></div>
      </div>
      <div className="col-span-2 border-t border-[color:var(--paper-2)] pt-3 sm:col-span-1 sm:border-0 sm:pt-0">
        <FilaLane fila={sector.fila} />
      </div>
    </div>
  );
}
