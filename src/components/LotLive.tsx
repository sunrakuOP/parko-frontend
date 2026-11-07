"use client";

import SectorRow from "./SectorRow";
import { FilaChip, NivelChip } from "./Chips";
import { filaDelParqueadero, libres, nivel, slugParqueadero, totales } from "@/lib/cupos";
import { INFO_LOTES } from "@/lib/lotes";
import { useSectores } from "@/hooks/useSectores";
import type { Parqueadero, Sector } from "@/types/api";

export default function LotLive({ parqueadero: p, sectoresIniciales }: { parqueadero: Parqueadero; sectoresIniciales: Sector[] }) {
  const { sectores } = useSectores(sectoresIniciales);
  const suyos = sectores.filter((s) => s.parqueaderoId === p.id && s.activo).sort((a, b) => a.id - b.id);
  const t = totales(suyos);
  const slug = slugParqueadero(p);
  const info = slug ? INFO_LOTES[slug] : null;

  return (
    <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-12">
      <header className="lg:col-span-5">
        <p className="small" data-rise>{info?.corto ?? "Parqueadero"}</p>
        <h1 className="display mt-1" data-rise style={{ fontSize: "clamp(2.6rem,6vw,5rem)", "--i": 1 } as React.CSSProperties}>{p.nombre}</h1>
        {info && <p className="lead mt-5" data-rise style={{ "--i": 2 } as React.CSSProperties}>{info.descripcion}</p>}
        <p className="small mt-3">{p.direccion}</p>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <NivelChip nivel={nivel({ capacidad: t.capacidad || 1, ocupados: t.ocupados })} />
          <FilaChip fila={filaDelParqueadero(suyos)} />
        </div>
        <p className="mt-6">
          <span className="num text-[clamp(5rem,12vw,9rem)]" aria-live="polite">{suyos.reduce((a, s) => a + libres(s), 0)}</span>
          <span className="small block">cupos libres de {t.capacidad}* · se actualiza solo</span>
        </p>
      </header>
      <section className="lg:col-span-7" aria-label="Sectores">
        <h2 className="h3 mb-1">Por sector</h2>
        {suyos.length === 0 ? (
          <p className="py-6" style={{ color: "var(--ink-2)" }}>Este parqueadero todavía no tiene sectores registrados.</p>
        ) : (
          suyos.map((s) => <SectorRow key={s.id} sector={s} />)
        )}
        <p className="small mt-4">* Capacidad estimada hasta contar con el dato oficial de la universidad.</p>
      </section>
    </div>
  );
}
