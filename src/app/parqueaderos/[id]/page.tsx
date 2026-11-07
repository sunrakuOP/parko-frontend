import Link from "next/link";
import { notFound } from "next/navigation";
import LotMap from "@/components/LotMap";
import OccupancyBar from "@/components/OccupancyBar";
import Offline from "@/components/Offline";
import { AddEspacioForm } from "@/components/forms";
import { ApiError } from "@/lib/api";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { espaciosService } from "@/modules/espacios/services/espaciosService";
import { usersService } from "@/modules/users/services/usersService";
import { vehiculosService } from "@/modules/vehiculos/services/vehiculosService";

// Next 16: params es una Promise (la guía del profesor usa la forma anterior, params.id).
export default async function ParqueaderoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let p, espacios, users, vehiculos;
  try {
    [p, espacios, users, vehiculos] = await Promise.all([
      parqueaderosService.getById(id),
      espaciosService.getAll({ parqueaderoId: Number(id) }),
      usersService.getAll(),
      vehiculosService.getAll(),
    ]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  const libres = espacios.filter((e) => e.estado === "disponible").length;

  return (
    <div className="wrap grid gap-10 pt-10 lg:grid-cols-12 lg:pt-14">
      {/* columna izquierda sticky */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-6">
          <Link href="/parqueaderos" className="link label">← Parqueaderos</Link>
          <h1 className="h2 mt-4" data-rise>{p.nombre}</h1>
          <p className="mono mt-1 text-xs" style={{ color: "var(--muted)" }}>{p.direccion}</p>

          <div className="mt-8 border-2 border-ink p-5" style={{ background: "var(--paper-3)" }}>
            <p className="label">Plazas libres ahora</p>
            <p className="mono text-7xl font-bold leading-none" style={{ color: libres === 0 ? "var(--busy)" : "var(--ink)" }}>
              {libres}
              <span className="text-2xl font-medium" style={{ color: "var(--muted)" }}>/{espacios.length}</span>
            </p>
            <div className="mt-4"><OccupancyBar espacios={espacios} /></div>
          </div>

          <details className="mt-6 border-2 border-ink" style={{ background: "var(--paper-3)" }}>
            <summary className="cursor-pointer p-4 font-bold" style={{ fontStretch: "112%" }}>+ Agregar una plaza</summary>
            <div className="border-t-2 border-ink p-5"><AddEspacioForm parqueaderoId={p.id} /></div>
          </details>
        </div>
      </aside>

      <section className="lg:col-span-8" data-rise style={{ "--i": 2 } as React.CSSProperties}>
        <LotMap espacios={espacios} users={users} vehiculos={vehiculos} />
      </section>
    </div>
  );
}
