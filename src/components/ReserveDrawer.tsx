"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { reservasService } from "@/modules/reservas/services/reservasService";
import { ApiError } from "@/lib/api";
import { codigoPlaza, toLocalInput } from "@/lib/format";
import type { Espacio, User, Vehiculo } from "@/types/api";

function defaults() {
  const ini = new Date();
  ini.setMinutes(Math.ceil(ini.getMinutes() / 15) * 15, 0, 0);
  const fin = new Date(ini.getTime() + 2 * 3600 * 1000);
  return { ini: toLocalInput(ini), fin: toLocalInput(fin) };
}

/** Panel lateral: reserva la plaza elegida en el plano. */
export default function ReserveDrawer({
  espacio,
  users,
  vehiculos,
  onClose,
  onCreated,
}: {
  espacio: Espacio | null;
  users: User[];
  vehiculos: Vehiculo[];
  onClose: () => void;
  onCreated: (reservaId: number) => void;
}) {
  const conductores = users.filter((u) => u.activo);
  const [usuarioId, setUsuarioId] = useState<number | "">(conductores[0]?.id ?? "");
  const [placa, setPlaca] = useState("");
  const [{ ini, fin }, setRango] = useState(defaults);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Una moto va en plaza de moto; un carro en plaza de carro o accesible.
  const compatibles = useMemo(
    () =>
      vehiculos.filter(
        (v) =>
          v.activo &&
          v.usuarioId === usuarioId &&
          (espacio?.tipo === "moto" ? v.tipo === "moto" : v.tipo === "carro"),
      ),
    [vehiculos, usuarioId, espacio],
  );
  const placaValida = compatibles.some((v) => v.placa === placa) ? placa : (compatibles[0]?.placa ?? "");

  useEffect(() => {
    if (!espacio) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [espacio, onClose]);

  if (!espacio) return null;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!espacio || usuarioId === "" || !placaValida) return;
    setError(null);
    if (new Date(fin) <= new Date(ini)) {
      setError("La hora de salida debe ser posterior a la de entrada.");
      return;
    }
    setEnviando(true);
    try {
      const r = await reservasService.create({
        usuarioId,
        vehiculoPlaca: placaValida,
        espacioId: espacio.id,
        fechaInicio: new Date(ini).toISOString(),
        fechaFin: new Date(fin).toISOString(),
      });
      onCreated(r.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear la reserva. Intenta de nuevo.");
      setEnviando(false);
    }
  }

  // Portal: un ancestro con animación de transform haría que `fixed` se ancle a él, no a la ventana.
  return createPortal(
    <>
      <div
        className="fixed inset-0"
        style={{ background: "rgba(14,17,22,.55)", zIndex: "var(--z-drawer-backdrop)" }}
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Reservar plaza ${codigoPlaza(espacio.numero)}`}
        className="fixed right-0 top-0 flex h-dvh w-full max-w-md flex-col overflow-y-auto border-l-2 border-ink"
        style={{ background: "var(--paper)", zIndex: "var(--z-drawer)" }}
      >
        <div className="stripes" />
        <form onSubmit={enviar} className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label">Reservar plaza</p>
              <p className="mono text-6xl font-bold leading-none" style={{ color: "var(--ink)" }}>
                {codigoPlaza(espacio.numero)}
              </p>
            </div>
            <button type="button" className="btn btn-line btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          {conductores.length === 0 ? (
            <p className="border-2 border-ink p-4 text-sm" style={{ background: "var(--paper-3)" }}>
              Primero registra un conductor y su vehículo en{" "}
              <Link className="link" href="/users">Conductores</Link>.
            </p>
          ) : (
            <>
              <div>
                <label className="label field-label" htmlFor="usr">Conductor</label>
                <select id="usr" className="field" value={usuarioId} onChange={(e) => setUsuarioId(Number(e.target.value))}>
                  {conductores.map((u) => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label field-label" htmlFor="veh">Vehículo</label>
                {compatibles.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--busy)" }}>
                    Este conductor no tiene un {espacio.tipo === "moto" ? "moto" : "carro"} registrado.{" "}
                    <Link className="link" href={`/users/${usuarioId}`}>Agregar vehículo</Link>
                  </p>
                ) : (
                  <select id="veh" className="field mono" value={placaValida} onChange={(e) => setPlaca(e.target.value)}>
                    {compatibles.map((v) => (
                      <option key={v.placa} value={v.placa}>
                        {v.placa} · {v.marca} {v.modelo}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label field-label" htmlFor="ini">Entrada</label>
                  <input id="ini" type="datetime-local" className="field mono" value={ini} required
                    onChange={(e) => setRango((r) => ({ ...r, ini: e.target.value }))} />
                </div>
                <div>
                  <label className="label field-label" htmlFor="fin">Salida</label>
                  <input id="fin" type="datetime-local" className="field mono" value={fin} required
                    onChange={(e) => setRango((r) => ({ ...r, fin: e.target.value }))} />
                </div>
              </div>
            </>
          )}

          {error && (
            <p role="alert" className="border-2 border-ink p-3 text-sm font-semibold" style={{ background: "#f3c9c9" }}>
              {error}
            </p>
          )}

          <div className="mt-auto">
            <button type="submit" className="btn w-full justify-center" disabled={enviando || !placaValida || usuarioId === ""}>
              {enviando ? "Reservando…" : `Reservar plaza ${codigoPlaza(espacio.numero)}`}
            </button>
          </div>
        </form>
      </aside>
    </>,
    document.body,
  );
}
