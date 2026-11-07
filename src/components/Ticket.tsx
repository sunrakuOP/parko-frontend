import Barcode from "./Barcode";
import { codigoPlaza, fmtFecha, fmtHora } from "@/lib/format";
import type { Reserva } from "@/types/api";

/** La reserva como tiquete físico: cuerpo + talón perforado con el código de plaza. */
export default function Ticket({ reserva, parqueadero }: { reserva: Reserva; parqueadero?: string }) {
  const codigo = reserva.espacio ? codigoPlaza(reserva.espacio.numero) : `#${reserva.espacioId}`;
  const folio = String(reserva.id).padStart(4, "0");
  return (
    <article className="ticket" aria-label={`Reserva ${folio}, plaza ${codigo}`}>
      <div className="ticket-main">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label">Tiquete de reserva · {folio}</p>
          <span className="chip" data-s={reserva.estado}>{reserva.estado}</span>
        </div>
        {parqueadero && <h2 className="h3 mt-3">{parqueadero}</h2>}

        <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-end gap-x-4 gap-y-1">
          <div>
            <p className="label">Entrada</p>
            <p className="mono text-3xl font-bold leading-tight">{fmtHora(reserva.fechaInicio)}</p>
            <p className="mono text-xs" style={{ color: "var(--muted)" }}>{fmtFecha(reserva.fechaInicio)}</p>
          </div>
          <div aria-hidden className="mb-3 h-0 border-t-2 border-dashed border-ink" />
          <div className="text-right">
            <p className="label">Salida</p>
            <p className="mono text-3xl font-bold leading-tight">{fmtHora(reserva.fechaFin)}</p>
            <p className="mono text-xs" style={{ color: "var(--muted)" }}>{fmtFecha(reserva.fechaFin)}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="label">Conductor</dt>
            <dd className="font-bold">{reserva.usuario?.nombre ?? `Usuario ${reserva.usuarioId}`}</dd>
          </div>
          <div>
            <dt className="label">Vehículo</dt>
            <dd className="font-bold">
              <span className="mono">{reserva.vehiculoPlaca}</span>
              {reserva.vehiculo && (
                <span className="font-normal" style={{ color: "var(--ink-2)" }}>
                  {" "}· {reserva.vehiculo.marca} {reserva.vehiculo.modelo}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="ticket-stub">
        <div>
          <p className="label">Plaza</p>
          <p className="mono text-6xl font-bold leading-none">{codigo}</p>
        </div>
        <Barcode value={`${reserva.vehiculoPlaca}${folio}`} />
      </div>
    </article>
  );
}
