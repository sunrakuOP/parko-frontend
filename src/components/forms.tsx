"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { usersService } from "@/modules/users/services/usersService";
import { vehiculosService } from "@/modules/vehiculos/services/vehiculosService";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { espaciosService } from "@/modules/espacios/services/espaciosService";
import { reservasService } from "@/modules/reservas/services/reservasService";
import type { EstadoReserva, TipoEspacio, TipoVehiculo, UserRole } from "@/types/api";

/** Envuelve el patrón común: enviar → mostrar error → refrescar los datos del servidor. */
function useAccion(onOk?: () => void) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function run(fn: () => Promise<unknown>) {
    setError(null);
    setBusy(true);
    try {
      await fn();
      onOk?.();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo completar la acción. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }
  return { error, busy, run };
}

const Err = ({ msg }: { msg: string | null }) =>
  msg ? (
    <p role="alert" className="border-2 border-ink p-2.5 text-sm font-semibold" style={{ background: "#f3c9c9" }}>
      {msg}
    </p>
  ) : null;

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="label field-label">{label}</label>
    {children}
  </div>
);

export function CreateUserForm() {
  const { error, busy, run } = useAccion();
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const d = new FormData(f);
        run(async () => {
          await usersService.create({
            nombre: String(d.get("nombre")),
            email: String(d.get("email")),
            telefono: String(d.get("telefono")),
            rol: d.get("rol") as UserRole,
          });
          f.reset();
        });
      }}
    >
      <Field id="u-nombre" label="Nombre completo">
        <input id="u-nombre" name="nombre" className="field" required maxLength={100} />
      </Field>
      <Field id="u-email" label="Correo">
        <input id="u-email" name="email" type="email" className="field" required />
      </Field>
      <Field id="u-tel" label="Teléfono">
        <input id="u-tel" name="telefono" className="field mono" required placeholder="+57 310 123 4567" />
      </Field>
      <Field id="u-rol" label="Rol">
        <select id="u-rol" name="rol" className="field" defaultValue="conductor">
          <option value="conductor">Conductor</option>
          <option value="operador">Operador</option>
          <option value="admin">Administrador</option>
        </select>
      </Field>
      <Err msg={error} />
      <button className="btn" disabled={busy}>{busy ? "Guardando…" : "Registrar conductor"}</button>
    </form>
  );
}

export function AddVehiculoForm({ usuarioId }: { usuarioId: number }) {
  const { error, busy, run } = useAccion();
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const d = new FormData(f);
        run(async () => {
          await vehiculosService.create({
            placa: String(d.get("placa")).toUpperCase(),
            marca: String(d.get("marca")),
            modelo: String(d.get("modelo")),
            tipo: d.get("tipo") as TipoVehiculo,
            usuarioId,
          });
          f.reset();
        });
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field id="v-placa" label="Placa">
          <input id="v-placa" name="placa" className="field mono uppercase" required maxLength={8} placeholder="ABC123" />
        </Field>
        <Field id="v-tipo" label="Tipo">
          <select id="v-tipo" name="tipo" className="field" defaultValue="carro">
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
          </select>
        </Field>
        <Field id="v-marca" label="Marca">
          <input id="v-marca" name="marca" className="field" required maxLength={50} />
        </Field>
        <Field id="v-modelo" label="Modelo">
          <input id="v-modelo" name="modelo" className="field" required maxLength={50} />
        </Field>
      </div>
      <Err msg={error} />
      <button className="btn" disabled={busy}>{busy ? "Guardando…" : "Agregar vehículo"}</button>
    </form>
  );
}

export function CreateParqueaderoForm() {
  const { error, busy, run } = useAccion();
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const d = new FormData(f);
        run(async () => {
          await parqueaderosService.create({
            nombre: String(d.get("nombre")),
            direccion: String(d.get("direccion")),
            capacidadTotal: Number(d.get("capacidadTotal")),
          });
          f.reset();
        });
      }}
    >
      <Field id="p-nombre" label="Nombre">
        <input id="p-nombre" name="nombre" className="field" required maxLength={100} />
      </Field>
      <Field id="p-dir" label="Dirección">
        <input id="p-dir" name="direccion" className="field" required maxLength={200} />
      </Field>
      <Field id="p-cap" label="Capacidad total (plazas)">
        <input id="p-cap" name="capacidadTotal" type="number" min={1} className="field mono" required />
      </Field>
      <Err msg={error} />
      <button className="btn" disabled={busy}>{busy ? "Guardando…" : "Crear parqueadero"}</button>
    </form>
  );
}

export function AddEspacioForm({ parqueaderoId }: { parqueaderoId: number }) {
  const { error, busy, run } = useAccion();
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const d = new FormData(f);
        run(async () => {
          await espaciosService.create({
            parqueaderoId,
            numero: String(d.get("numero")).toUpperCase(),
            tipo: d.get("tipo") as TipoEspacio,
          });
          f.reset();
        });
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field id="e-num" label="Código">
          <input id="e-num" name="numero" className="field mono uppercase" required maxLength={10} placeholder="A-15" />
        </Field>
        <Field id="e-tipo" label="Tipo">
          <select id="e-tipo" name="tipo" className="field" defaultValue="carro">
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
            <option value="discapacitado">Accesible</option>
          </select>
        </Field>
      </div>
      <Err msg={error} />
      <button className="btn btn-ink" disabled={busy}>{busy ? "Agregando…" : "Agregar plaza"}</button>
    </form>
  );
}

/** Acciones válidas según el estado actual (el backend valida las mismas transiciones). */
const SIGUIENTE: Record<EstadoReserva, { estado: EstadoReserva; label: string; kind: string }[]> = {
  pendiente: [
    { estado: "confirmada", label: "Confirmar reserva", kind: "" },
    { estado: "cancelada", label: "Cancelar", kind: "btn-danger" },
  ],
  confirmada: [
    { estado: "completada", label: "Marcar como completada", kind: "" },
    { estado: "cancelada", label: "Cancelar", kind: "btn-danger" },
  ],
  cancelada: [],
  completada: [],
};

export function ReservaActions({ id, estado }: { id: number; estado: EstadoReserva }) {
  const { error, busy, run } = useAccion();
  const acciones = SIGUIENTE[estado];
  if (acciones.length === 0) {
    return (
      <p className="label">
        Esta reserva está {estado}. Ya no admite cambios.
      </p>
    );
  }
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        {acciones.map((a) => (
          <button key={a.estado} className={`btn ${a.kind}`} disabled={busy} onClick={() => run(() => reservasService.cambiarEstado(id, a.estado))}>
            {a.label}
          </button>
        ))}
      </div>
      <Err msg={error} />
    </div>
  );
}
