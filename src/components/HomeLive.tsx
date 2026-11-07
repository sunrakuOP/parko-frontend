"use client";

import Link from "next/link";
import CampusMap from "./CampusMap";
import SectorRow from "./SectorRow";
import { FilaChip, NivelChip } from "./Chips";
import { filaDelParqueadero, libres, nivel, slugParqueadero, totales } from "@/lib/cupos";
import { INFO_LOTES } from "@/lib/lotes";
import { useSectores } from "@/hooks/useSectores";
import type { Parqueadero, Sector } from "@/types/api";

export default function HomeLive({ parqueaderos, sectoresIniciales }: { parqueaderos: Parqueadero[]; sectoresIniciales: Sector[] }) {
  const { sectores } = useSectores(sectoresIniciales);
  const activos = parqueaderos.filter((p) => p.activo);
  const t = totales(sectores.filter((s) => activos.some((p) => p.id === s.parqueaderoId)));

  return (
    <>
      {/* HERO: el plano ocupa 2/3 y sangra a la izquierda; el texto es una columna angosta */}
      <section className="overflow-x-clip">
        <div className="wrap grid items-center gap-8 pb-14 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:order-2 lg:col-span-4">
            <h1 className="display" data-rise style={{ fontSize: "clamp(2.4rem, 4.6vw, 4.2rem)" }}>
              ¿Dónde hay cupo para parquear hoy?
            </h1>
            <p className="lead mt-5" data-rise style={{ "--i": 1 } as React.CSSProperties}>
              Cupos en vivo de los tres parqueaderos de la Javeriana Cali, con la fila de cada entrada.
            </p>
            <p className="mt-7" data-rise style={{ "--i": 2 } as React.CSSProperties}>
              <span className="num text-[clamp(4rem,9vw,6.5rem)]" aria-live="polite">{t.libres}</span>
              <span className="small block">cupos libres ahora, de {t.capacidad}* en total</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3" data-rise style={{ "--i": 3 } as React.CSSProperties}>
              <a href="#parqueaderos" className="btn btn-go">Ver cupos por sector</a>
              <Link href="/operador" className="link">Soy de portería</Link>
            </div>
          </div>
          <div className="lg:order-1 lg:col-span-8 lg:-ml-8" data-rise style={{ "--i": 2 } as React.CSSProperties}>
            <CampusMap parqueaderos={activos} sectores={sectores} />
            <ul className="small mt-3 flex flex-wrap gap-x-6 gap-y-1">
              <li>Celda con borde verde: cupo libre</li>
              <li>Celda negra: cupo ocupado</li>
              <li>Carros rojos que avanzan: hay fila</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PARQUEADEROS: filas editoriales de ancho completo, no tarjetas iguales */}
      <section id="parqueaderos" className="wrap scroll-mt-6 pt-12">
        <h2 className="h2 max-w-2xl">Los tres parqueaderos, sector por sector.</h2>
        <div className="mt-8">
          {activos.map((p) => {
            const slug = slugParqueadero(p);
            const info = slug ? INFO_LOTES[slug] : null;
            const suyos = sectores.filter((s) => s.parqueaderoId === p.id && s.activo).sort((a, b) => a.id - b.id);
            const tt = totales(suyos);
            return (
              <article key={p.id} className="grid gap-x-10 gap-y-4 border-t-2 border-ink py-8 lg:grid-cols-12">
                <header className="lg:col-span-4">
                  <p className="small">{info?.corto ?? "Parqueadero"}</p>
                  <h3 className="h2 mt-1" style={{ fontSize: "clamp(1.7rem,3vw,2.5rem)" }}>{p.nombre}</h3>
                  {info && <p className="mt-3 text-[0.97rem]" style={{ color: "var(--ink-2)" }}>{info.descripcion}</p>}
                  <p className="small mt-2">{p.direccion}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <NivelChip nivel={nivel({ capacidad: tt.capacidad || 1, ocupados: tt.ocupados })} />
                    <FilaChip fila={filaDelParqueadero(suyos)} />
                  </div>
                  <p className="mt-5">
                    <span className="num text-[4.2rem]">{suyos.reduce((a, s) => a + libres(s), 0)}</span>
                    <span className="small block">libres de {tt.capacidad}*</span>
                  </p>
                  <Link href={`/parqueaderos/${p.id}`} className="link mt-3 inline-block">Ver este parqueadero →</Link>
                </header>
                <div className="lg:col-span-8">
                  {suyos.length === 0 ? (
                    <p style={{ color: "var(--ink-2)" }}>Este parqueadero todavía no tiene sectores registrados.</p>
                  ) : (
                    suyos.map((s) => <SectorRow key={s.id} sector={s} />)
                  )}
                </div>
              </article>
            );
          })}
          {activos.length === 0 && <p style={{ color: "var(--ink-2)" }}>No hay parqueaderos activos todavía.</p>}
        </div>
      </section>
    </>
  );
}
