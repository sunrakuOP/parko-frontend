import Offline from "@/components/Offline";
import ParqueaderoCard from "@/components/ParqueaderoCard";
import { CreateParqueaderoForm } from "@/components/forms";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { espaciosService } from "@/modules/espacios/services/espaciosService";

export const metadata = { title: "Parqueaderos — Parko" };

export default async function ParqueaderosPage() {
  let parqueaderos, espacios;
  try {
    [parqueaderos, espacios] = await Promise.all([parqueaderosService.getAll(), espaciosService.getAll()]);
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  const activos = parqueaderos.filter((p) => p.activo);

  return (
    <div className="wrap pt-12 md:pt-16">
      <h1 className="display" data-rise style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>Parqueaderos</h1>
      <p className="lead mt-4" data-rise style={{ "--i": 1 } as React.CSSProperties}>
        Elige uno para ver su plano y reservar una plaza libre.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-12">
        {activos.map((p, i) => (
          <div key={p.id} className={i % 3 === 0 ? "md:col-span-7" : "md:col-span-5"} data-rise style={{ "--i": i + 2 } as React.CSSProperties}>
            <ParqueaderoCard p={p} espacios={espacios} featured={i === 0} />
          </div>
        ))}
        {activos.length === 0 && <p className="md:col-span-12">No hay parqueaderos activos todavía.</p>}
      </div>

      <details className="mt-14 max-w-lg border-2 border-ink" style={{ background: "var(--paper-3)" }}>
        <summary className="cursor-pointer p-4 font-bold" style={{ fontStretch: "112%" }}>
          + Crear un parqueadero
        </summary>
        <div className="border-t-2 border-ink p-5">
          <CreateParqueaderoForm />
        </div>
      </details>
    </div>
  );
}
