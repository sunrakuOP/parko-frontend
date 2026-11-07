import Link from "next/link";
import Offline from "@/components/Offline";
import { reservasService } from "@/modules/reservas/services/reservasService";
import { codigoPlaza, fmtFecha, fmtHora } from "@/lib/format";
import type { EstadoReserva } from "@/types/api";

export const metadata = { title: "Reservas — Parko" };

const FILTROS: { v?: EstadoReserva; t: string }[] = [
  { t: "Todas" },
  { v: "pendiente", t: "Pendientes" },
  { v: "confirmada", t: "Confirmadas" },
  { v: "completada", t: "Completadas" },
  { v: "cancelada", t: "Canceladas" },
];
const VALIDOS = ["pendiente", "confirmada", "completada", "cancelada"];

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const filtro = VALIDOS.includes(estado ?? "") ? (estado as EstadoReserva) : undefined;
  let reservas;
  try {
    reservas = await reservasService.getAll({ estado: filtro });
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  reservas.sort((a, b) => b.id - a.id);

  return (
    <div className="wrap pt-12 md:pt-16">
      <h1 className="display" data-rise style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>Reservas</h1>

      <nav aria-label="Filtrar por estado" className="mt-8 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link key={f.t} href={f.v ? `/reservas?estado=${f.v}` : "/reservas"} className="tab" aria-current={f.v === filtro ? "true" : undefined}>
            {f.t}
          </Link>
        ))}
      </nav>

      <div className="mt-8 border-t-2 border-ink">
        {reservas.length === 0 && (
          <p className="py-10" style={{ color: "var(--ink-2)" }}>
            No hay reservas {filtro ? `${filtro}s` : ""} todavía. Elige una plaza libre en un{" "}
            <Link className="link" href="/parqueaderos">parqueadero</Link>.
          </p>
        )}
        {reservas.map((r, i) => (
          <Link
            key={r.id}
            href={`/reservas/${r.id}`}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-b-2 border-ink py-4 transition-colors duration-150 hover:bg-[var(--paper-2)] md:grid-cols-[7rem_1fr_1fr_auto]"
            data-rise
            style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className="mono text-3xl font-bold">{r.espacio ? codigoPlaza(r.espacio.numero) : `#${r.espacioId}`}</span>
            <span>
              <span className="mono block text-sm font-semibold">{fmtFecha(r.fechaInicio)} · {fmtHora(r.fechaInicio)}–{fmtHora(r.fechaFin)}</span>
              <span className="block text-sm" style={{ color: "var(--ink-2)" }}>{r.usuario?.nombre ?? `Usuario ${r.usuarioId}`}</span>
            </span>
            <span className="mono hidden text-sm md:block">{r.vehiculoPlaca}</span>
            <span className="chip" data-s={r.estado}>{r.estado}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
