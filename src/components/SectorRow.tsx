import Cells from "./Cells";
import { FilaChip, NivelChip } from "./Chips";
import { libres, nivel } from "@/lib/cupos";
import type { Sector } from "@/types/api";

export default function SectorRow({ sector }: { sector: Sector }) {
  const l = libres(sector);
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-[color:var(--paper-2)] py-5 sm:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h4 className="h3">{sector.nombre}</h4>
          <NivelChip nivel={nivel(sector)} />
          <FilaChip fila={sector.fila} />
        </div>
        <div className="mt-3 max-w-xl">
          <Cells capacidad={sector.capacidad} ocupados={sector.ocupados} />
        </div>
      </div>
      <p className="sm:text-right">
        <span className="num text-5xl">{l}</span>
        <span className="small block">
          libres de {sector.capacidad}
          {sector.capacidadEstimada ? "*" : ""}
        </span>
      </p>
    </div>
  );
}
