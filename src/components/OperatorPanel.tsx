"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Cells from "./Cells";
import Ticket from "./Ticket";
import { FilaChip, NivelChip } from "./Chips";
import { ApiError } from "@/lib/api";
import { libres, nivel } from "@/lib/cupos";
import { useSectores } from "@/hooks/useSectores";
import { sectoresService } from "@/modules/sectores/services/sectoresService";
import type { EstadoFila, Parqueadero, Sector } from "@/types/api";

const FILAS: { v: EstadoFila; t: string }[] = [
  { v: "sin_fila", t: "Sin fila" },
  { v: "corta", t: "Fila corta" },
  { v: "larga", t: "Fila larga" },
];
// Placa colombiana: 3 letras + 3 números (carro) o 3 letras + 2 números + 1 letra (moto).
const PLACA = /^[A-Z]{3}\d{2}[A-Z0-9]$/;

export default function OperatorPanel({ parqueaderos, sectoresIniciales }: { parqueaderos: Parqueadero[]; sectoresIniciales: Sector[] }) {
  const { sectores, setSectores } = useSectores(sectoresIniciales, 10000);
  const activos = parqueaderos.filter((p) => p.activo);
  const [lotId, setLotId] = useState(activos[0]?.id ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [placa, setPlaca] = useState("");
  const [sectorId, setSectorId] = useState<number | "">("");
  const [ticket, setTicket] = useState<{ placa: string; parqueadero: string; sector: string; fecha: string } | null>(null);

  const lot = activos.find((p) => p.id === lotId);
  const suyos = sectores.filter((s) => s.parqueaderoId === lotId && s.activo).sort((a, b) => a.id - b.id);
  const sectorElegido = suyos.find((s) => s.id === (sectorId || suyos[0]?.id));
  const reemplazar = (n: Sector) => setSectores((prev) => prev.map((s) => (s.id === n.id ? n : s)));

  async function hacer(id: number, fn: () => Promise<Sector>) {
    setError(null);
    setBusy(id);
    try {
      reemplazar(await fn());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo guardar el cambio. Intenta de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  async function emitir(e: React.FormEvent) {
    e.preventDefault();
    if (!sectorElegido || !lot) return;
    const p = placa.trim().toUpperCase();
    if (!PLACA.test(p)) {
      setError("La placa debe tener 3 letras y 3 números (carro) o 3 letras, 2 números y 1 letra (moto). Ejemplo: ABC123.");
      return;
    }
    setError(null);
    setBusy(sectorElegido.id);
    try {
      reemplazar(await sectoresService.ajustarOcupacion(sectorElegido.id, 1));
      setTicket({ placa: p, parqueadero: lot.nombre, sector: sectorElegido.nombre, fecha: new Date().toISOString() });
      setPlaca("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo registrar la entrada.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Parqueadero">
          {activos.map((p) => (
            <button key={p.id} role="tab" aria-selected={p.id === lotId} className="tab" aria-current={p.id === lotId ? "true" : undefined} onClick={() => setLotId(p.id)}>
              {p.nombre}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border-2 border-ink p-3 text-sm font-bold" style={{ background: "#f0cfc6" }}>{error}</p>
        )}

        <div className="mt-6 grid gap-5">
          {suyos.map((s) => (
            <article key={s.id} className="rounded-[var(--r)] border-2 border-ink p-5" style={{ background: "var(--paper-3)" }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="h3">{s.nombre}</h3>
                  <div className="mt-2 flex flex-wrap gap-2"><NivelChip nivel={nivel(s)} /><FilaChip fila={s.fila} /></div>
                </div>
                <p className="text-right">
                  <span className="num text-6xl">{libres(s)}</span>
                  <span className="small block">libres de {s.capacidad}{s.capacidadEstimada ? "*" : ""}</span>
                </p>
              </div>
              <div className="mt-4"><Cells capacidad={s.capacidad} ocupados={s.ocupados} /></div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="btn btn-brick" disabled={busy === s.id || libres(s) === 0} onClick={() => hacer(s.id, () => sectoresService.ajustarOcupacion(s.id, 1))}>
                  Entra un vehículo (+1)
                </button>
                <button className="btn btn-go" disabled={busy === s.id || s.ocupados === 0} onClick={() => hacer(s.id, () => sectoresService.ajustarOcupacion(s.id, -1))}>
                  Sale un vehículo (−1)
                </button>
              </div>

              <fieldset className="mt-5">
                <legend className="small mb-2">Fila en la entrada</legend>
                <div className="flex flex-wrap gap-2">
                  {FILAS.map((f) => (
                    <button key={f.v} className="tab" aria-pressed={s.fila === f.v} aria-current={s.fila === f.v ? "true" : undefined} disabled={busy === s.id}
                      onClick={() => hacer(s.id, () => sectoresService.update(s.id, { fila: f.v }))}>
                      {f.t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <details className="mt-5">
                <summary className="small cursor-pointer">Ajustar capacidad</summary>
                <form className="mt-3 flex flex-wrap items-end gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const d = new FormData(e.currentTarget);
                    hacer(s.id, () => sectoresService.update(s.id, { capacidad: Number(d.get("capacidad")), capacidadEstimada: d.get("oficial") !== "on" }));
                  }}>
                  <div>
                    <label className="small field-label" htmlFor={`cap-${s.id}`}>Capacidad</label>
                    <input id={`cap-${s.id}`} name="capacidad" type="number" min={Math.max(1, s.ocupados)} max={5000} defaultValue={s.capacidad} className="field" style={{ width: "8rem" }} required />
                  </div>
                  <label className="small flex items-center gap-2 pb-3"><input type="checkbox" name="oficial" defaultChecked={!s.capacidadEstimada} /> Es el dato oficial</label>
                  <button className="btn btn-line btn-sm mb-1.5" disabled={busy === s.id}>Guardar</button>
                </form>
              </details>
            </article>
          ))}
          {suyos.length === 0 && <p style={{ color: "var(--ink-2)" }}>Este parqueadero no tiene sectores registrados.</p>}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <form onSubmit={emitir} className="rounded-[var(--r)] border-2 border-ink p-5 lg:sticky lg:top-6" style={{ background: "var(--paper-3)" }}>
          <h2 className="h3">Entrada con tiquete</h2>
          <p className="small mt-1">Registra el vehículo, suma un cupo y genera el tiquete.</p>
          <div className="mt-4">
            <label className="small field-label" htmlFor="pl">Placa</label>
            <input id="pl" className="field" value={placa} maxLength={6} autoCapitalize="characters" placeholder="ABC123"
              onChange={(e) => setPlaca(e.target.value.toUpperCase())} style={{ letterSpacing: "0.08em", fontWeight: 700 }} />
          </div>
          <div className="mt-4">
            <label className="small field-label" htmlFor="sec">Sector</label>
            <select id="sec" className="field" value={sectorElegido?.id ?? ""} onChange={(e) => setSectorId(Number(e.target.value))}>
              {suyos.map((s) => <option key={s.id} value={s.id}>{s.nombre} ({libres(s)} libres)</option>)}
            </select>
          </div>
          <button className="btn btn-go mt-5 w-full" disabled={!sectorElegido || busy !== null || (sectorElegido ? libres(sectorElegido) === 0 : true)}>
            Registrar entrada y generar tiquete
          </button>
          <p className="small mt-4">Panel sin inicio de sesión en esta entrega. Cualquiera con el enlace puede modificar los cupos.</p>
        </form>
      </aside>

      {ticket &&
        createPortal(
          <>
            <div className="no-print fixed inset-0" style={{ background: "rgba(21,35,28,.6)", zIndex: "var(--z-dialog-backdrop)" }} onClick={() => setTicket(null)} aria-hidden />
            <div role="dialog" aria-modal="true" aria-label="Tiquete generado" className="fixed inset-x-0 top-0 mx-auto flex max-h-dvh w-full max-w-md flex-col items-center gap-4 overflow-y-auto p-5" style={{ zIndex: "var(--z-dialog)" }}>
              <Ticket {...ticket} />
              <div className="no-print flex gap-3">
                <button className="btn btn-go" onClick={() => window.print()}>Imprimir</button>
                <button className="btn" style={{ background: "var(--paper-3)", color: "var(--ink)" }} onClick={() => setTicket(null)}>Cerrar</button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
