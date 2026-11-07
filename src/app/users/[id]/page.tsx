import Link from "next/link";
import { notFound } from "next/navigation";
import Offline from "@/components/Offline";
import { AddVehiculoForm } from "@/components/forms";
import { ApiError } from "@/lib/api";
import { codigoPlaza, fmtFecha, fmtHora } from "@/lib/format";
import { usersService } from "@/modules/users/services/usersService";
import { vehiculosService } from "@/modules/vehiculos/services/vehiculosService";
import { reservasService } from "@/modules/reservas/services/reservasService";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let user, vehiculos, reservas;
  try {
    [user, vehiculos, reservas] = await Promise.all([
      usersService.getById(id),
      vehiculosService.getAll(),
      reservasService.getAll({ usuarioId: Number(id) }),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  const mios = vehiculos.filter((v) => v.usuarioId === user.id && v.activo);

  return (
    <div className="wrap grid gap-12 pt-10 lg:grid-cols-12 lg:pt-14">
      <section className="lg:col-span-7">
        <Link href="/users" className="link label">← Conductores</Link>
        <h1 className="h2 mt-4" data-rise>{user.nombre}</h1>
        <p className="mono mt-1 text-xs" style={{ color: "var(--muted)" }}>{user.email} · {user.telefono}</p>

        <h2 className="h3 mt-10">Vehículos</h2>
        <div className="mt-3 border-t-2 border-ink">
          {mios.length === 0 && <p className="py-5" style={{ color: "var(--ink-2)" }}>Sin vehículos. Agrega uno para poder reservar.</p>}
          {mios.map((v) => (
            <div key={v.placa} className="flex items-center justify-between border-b-2 border-ink py-3">
              <span className="mono text-2xl font-bold">{v.placa}</span>
              <span className="text-sm">{v.marca} {v.modelo} · {v.tipo}</span>
            </div>
          ))}
        </div>

        <h2 className="h3 mt-10">Reservas</h2>
        <div className="mt-3 border-t-2 border-ink">
          {reservas.length === 0 && <p className="py-5" style={{ color: "var(--ink-2)" }}>Todavía no ha reservado.</p>}
          {reservas.map((r) => (
            <Link key={r.id} href={`/reservas/${r.id}`} className="flex items-center justify-between gap-3 border-b-2 border-ink py-3 hover:bg-[var(--paper-2)]">
              <span className="mono text-xl font-bold">{r.espacio ? codigoPlaza(r.espacio.numero) : `#${r.espacioId}`}</span>
              <span className="mono text-sm">{fmtFecha(r.fechaInicio)} · {fmtHora(r.fechaInicio)}</span>
              <span className="chip" data-s={r.estado}>{r.estado}</span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="lg:col-span-4 lg:col-start-9 lg:mt-12">
        <div className="border-2 border-ink p-5" style={{ background: "var(--paper-3)" }}>
          <h2 className="h3 mb-4">Agregar vehículo</h2>
          <AddVehiculoForm usuarioId={user.id} />
        </div>
      </aside>
    </div>
  );
}
