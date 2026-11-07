import Link from "next/link";
import DepartureBoard from "@/components/DepartureBoard";
import Ticket from "@/components/Ticket";
import ParqueaderoCard from "@/components/ParqueaderoCard";
import Offline from "@/components/Offline";
import AerialBand from "@/components/AerialBand";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { espaciosService } from "@/modules/espacios/services/espaciosService";
import { reservasService } from "@/modules/reservas/services/reservasService";

export default async function Home() {
  let data;
  try {
    const [parqueaderos, espacios, reservas] = await Promise.all([
      parqueaderosService.getAll(),
      espaciosService.getAll(),
      reservasService.getAll(),
    ]);
    data = { parqueaderos, espacios, reservas };
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  const { parqueaderos, espacios, reservas } = data;
  const activos = parqueaderos.filter((p) => p.activo);
  const ultima = [...reservas].sort((a, b) => b.id - a.id)[0];
  const nombreDe = (id?: number) => parqueaderos.find((p) => p.id === id)?.nombre;

  return (
    <>
      {/* HERO: H1 a 7/12 contra el margen; el tablero sangra fuera del viewport a la derecha */}
      <section className="overflow-x-clip">
        <div className="wrap grid items-center gap-10 pb-16 pt-12 md:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="display" data-rise style={{ "--i": 0 } as React.CSSProperties}>
              Tu plaza,
              <br />
              antes de llegar.
            </h1>
            <p className="lead mt-6" data-rise style={{ "--i": 1 } as React.CSSProperties}>
              Mira cuántas plazas libres hay ahora en cada parqueadero y reserva la tuya en menos de un minuto.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" data-rise style={{ "--i": 2 } as React.CSSProperties}>
              <Link href="/parqueaderos" className="btn">Ver parqueaderos →</Link>
              <Link href="/reservas" className="link">Mis reservas</Link>
            </div>
          </div>
          <div
            className="lg:col-span-5"
            data-rise
            style={{ "--i": 3, marginRight: "min(0px, calc(-1 * ((100vw - 84rem) / 2 + 2rem)))" } as React.CSSProperties}
          >
            <DepartureBoard parqueaderos={parqueaderos} espacios={espacios} />
          </div>
        </div>
      </section>

      <div className="stripes" aria-hidden />

      {/* TIQUETE: la reserva como objeto físico */}
      <section className="wrap grid gap-10 pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {ultima ? (
            <Ticket reserva={ultima} parqueadero={nombreDe(ultima.espacio?.parqueaderoId)} />
          ) : (
            <div className="border-2 border-dashed border-ink p-8">
              <h2 className="h3">Todavía no hay reservas.</h2>
              <p className="mt-2" style={{ color: "var(--ink-2)" }}>
                Elige una plaza libre en el plano y tu tiquete aparece aquí.
              </p>
            </div>
          )}
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:mt-14">
          <h2 className="h2">Cada reserva es un tiquete.</h2>
          <p className="mt-4" style={{ color: "var(--ink-2)" }}>
            Tiene tu plaza, tu placa y la hora de entrada y salida. Se confirma, se completa o se cancela desde su página.
          </p>
          <Link href="/reservas" className="link mt-5 inline-block">Ver todas las reservas</Link>
        </div>
      </section>

      <AerialBand libres={espacios.filter((e) => e.estado === "disponible")} total={espacios.length} />

      {/* PARQUEADEROS: la primera tarjeta rompe el ritmo (oscura y más grande) */}
      <section className="wrap pt-20">
        <h2 className="h2 max-w-xl">Elige dónde estacionar.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-12">
          {activos.length === 0 && (
            <p className="md:col-span-12" style={{ color: "var(--ink-2)" }}>
              No hay parqueaderos activos. <Link className="link" href="/parqueaderos">Crea el primero.</Link>
            </p>
          )}
          {activos.slice(0, 3).map((p, i) => (
            <div key={p.id} className={i === 0 ? "md:col-span-7" : "md:col-span-5"}>
              <ParqueaderoCard p={p} espacios={espacios} featured={i === 0} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
