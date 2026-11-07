"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Car from "./Car";
import ReserveDrawer from "./ReserveDrawer";
import { agruparPorFila, codigoPlaza } from "@/lib/format";
import type { Espacio, EstadoEspacio, User, Vehiculo } from "@/types/api";

const LEYENDA: { s: EstadoEspacio; t: string }[] = [
  { s: "disponible", t: "Libre" },
  { s: "reservado", t: "Reservada" },
  { s: "ocupado", t: "Ocupada" },
  { s: "mantenimiento", t: "Mantenimiento" },
];
const TONO: Record<string, string> = { ocupado: "#d64545", reservado: "#e0a100" };

/** Plano del parqueadero: cada plaza es un botón; las libres abren el panel de reserva. */
export default function LotMap({
  espacios,
  users,
  vehiculos,
}: {
  espacios: Espacio[];
  users: User[];
  vehiculos: Vehiculo[];
}) {
  const router = useRouter();
  const [sel, setSel] = useState<Espacio | null>(null);
  const filas = useMemo(() => agruparPorFila(espacios), [espacios]);
  const maxFila = Math.max(1, ...filas.map((f) => f.items.length));

  if (espacios.length === 0) {
    return (
      <div className="lot">
        <p className="mono text-sm" style={{ color: "#aeb3bb" }}>
          Este parqueadero todavía no tiene plazas. Agrega la primera con el formulario de la izquierda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="lot">
        <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Leyenda">
          {LEYENDA.map((l) => (
            <li key={l.s} className="label flex items-center gap-2" style={{ color: "#aeb3bb" }}>
              <i
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  display: "inline-block",
                  background:
                    l.s === "disponible" ? "var(--go)" : l.s === "reservado" ? "var(--held)" : l.s === "ocupado" ? "var(--busy)" : "var(--off)",
                }}
              />
              {l.t}
            </li>
          ))}
        </ul>

        {filas.map(({ fila, items }, idx) => (
          <div key={fila}>
            {idx > 0 && (
              <div className="lane" aria-hidden>
                <span>Vía</span>
              </div>
            )}
            <p className="label mb-1.5 mt-2" style={{ color: "#8d939d" }}>
              Fila {fila}
            </p>
            <div className="lot-row" style={{ width: `${(items.length / maxFila) * 100}%` }}>
              {items.map((e) => {
                const libre = e.estado === "disponible";
                return (
                  <button
                    key={e.id}
                    type="button"
                    className="plaza"
                    data-s={e.estado}
                    disabled={!libre}
                    aria-pressed={sel?.id === e.id}
                    aria-label={`Plaza ${codigoPlaza(e.numero)}, ${e.estado}${libre ? ". Reservar" : ""}`}
                    onClick={() => setSel(e)}
                  >
                    <span className="code">{codigoPlaza(e.numero)}</span>
                    {TONO[e.estado] ? <Car tone={TONO[e.estado]} moto={e.tipo === "moto"} /> : <span />}
                    <span className="meta">{e.tipo === "discapacitado" ? "Acces." : e.tipo === "moto" ? "Moto" : libre ? "Libre" : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ReserveDrawer
        espacio={sel}
        users={users}
        vehiculos={vehiculos}
        onClose={() => setSel(null)}
        onCreated={(id) => router.push(`/reservas/${id}`)}
      />
    </>
  );
}
