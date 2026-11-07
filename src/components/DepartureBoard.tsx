"use client";

import { useEffect, useState } from "react";
import Flap from "./Flap";
import { espaciosService } from "@/modules/espacios/services/espaciosService";
import type { Espacio, Parqueadero, TipoEspacio } from "@/types/api";

const TIPOS: { tipo: TipoEspacio; label: string }[] = [
  { tipo: "carro", label: "CARROS" },
  { tipo: "moto", label: "MOTOS" },
  { tipo: "discapacitado", label: "ACCESIBLE" },
];

function estadoDe(libres: number, total: number) {
  if (libres === 0) return { word: "LLENO", tone: "busy" as const };
  if (libres / total <= 0.15) return { word: "POCOS", tone: "held" as const };
  return { word: "LIBRE", tone: "go" as const };
}

/**
 * Tablero de salidas: disponibilidad por parqueadero y tipo de plaza.
 * Recibe los datos del servidor y los refresca cada 20 s (el navegador llama a /api/*).
 */
export default function DepartureBoard({
  parqueaderos,
  espacios: inicial,
}: {
  parqueaderos: Parqueadero[];
  espacios: Espacio[];
}) {
  const [espacios, setEspacios] = useState(inicial);

  useEffect(() => {
    const id = setInterval(() => {
      espaciosService.getAll().then(setEspacios).catch(() => {});
    }, 20000);
    return () => clearInterval(id);
  }, []);

  const grupos = parqueaderos.filter((p) => p.activo).slice(0, 2);

  return (
    <div className="board" role="region" aria-label="Disponibilidad de plazas en vivo">
      <div className="flex items-center justify-between pb-3">
        <span className="label" style={{ color: "#9aa0aa" }}>Salidas · Plazas libres</span>
        <span className="label flex items-center gap-2" style={{ color: "#9aa0aa" }}>
          <i aria-hidden style={{ width: 8, height: 8, background: "var(--go)", display: "inline-block" }} />
          En vivo
        </span>
      </div>

      {grupos.length === 0 && (
        <p className="mono py-6 text-sm" style={{ color: "#9aa0aa" }}>
          Aún no hay parqueaderos creados.
        </p>
      )}

      {grupos.map((p, gi) => {
        const delPark = espacios.filter((e) => e.parqueaderoId === p.id);
        const filas = TIPOS.map(({ tipo, label }) => {
          const deTipo = delPark.filter((e) => e.tipo === tipo);
          return { label, total: deTipo.length, libres: deTipo.filter((e) => e.estado === "disponible").length };
        }).filter((f) => f.total > 0);

        return (
          <div key={p.id} className={gi > 0 ? "mt-5 border-t border-[#2a2f37] pt-4" : ""}>
            <div className="mb-3">
              <Flap text={p.nombre} width={14} large startDelay={gi * 400} />
            </div>
            {filas.length === 0 ? (
              <p className="mono text-sm" style={{ color: "#9aa0aa" }}>
                Sin plazas registradas.
              </p>
            ) : (
              <div className="grid gap-2.5">
                {filas.map((f, i) => {
                  const est = estadoDe(f.libres, f.total);
                  return (
                    <div key={f.label} className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Flap text={f.label} width={9} startDelay={300 + i * 200 + gi * 400} />
                      <Flap
                        text={String(f.libres)}
                        width={3}
                        align="right"
                        tone={est.tone}
                        startDelay={600 + i * 200 + gi * 400}
                      />
                      <span className="mono hidden text-xs sm:inline" style={{ color: "#8d939d" }}>
                        /{f.total}
                      </span>
                      <Flap text={est.word} width={5} tone={est.tone} startDelay={900 + i * 200 + gi * 400} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
