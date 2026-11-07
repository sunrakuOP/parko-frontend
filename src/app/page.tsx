import Link from "next/link";
import HomeLive from "@/components/HomeLive";
import Offline from "@/components/Offline";
import Ticket from "@/components/Ticket";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { sectoresService } from "@/modules/sectores/services/sectoresService";

export default async function Home() {
  let data;
  try {
    const [parqueaderos, sectores] = await Promise.all([parqueaderosService.getAll(), sectoresService.getAll()]);
    data = { parqueaderos, sectores };
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }

  return (
    <>
      <HomeLive parqueaderos={data.parqueaderos} sectoresIniciales={data.sectores} />

      {/* TIQUETE: la sección que rompe el ritmo (oscura, con el papel real del parqueadero) */}
      <section className="mt-24 border-t-2 border-ink" style={{ background: "var(--ink)", color: "var(--paper-3)" }}>
        <div className="wrap grid items-center gap-10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:pr-10">
            <h2 className="h2">Cada cupo que baja sale de un tiquete.</h2>
            <p className="mt-5 max-w-lg" style={{ color: "#c7d1cb" }}>
              En la portería, cada vehículo que entra o sale se marca con un toque y los números de arriba se
              actualizan solos cada 15 segundos. El tiquete es el de papel de siempre: solo la placa, con su QR.
            </p>
            <p className="mt-3 max-w-lg text-sm" style={{ color: "#9fb0a6" }}>
              Hoy el portero ajusta el conteo a mano. Más adelante, el QR del tiquete puede marcar la entrada y la
              salida automáticamente, y el pago por día o por mensualidad entra en la siguiente entrega.
            </p>
            <Link href="/operador" className="btn mt-7" style={{ background: "var(--paper-3)", color: "var(--ink)", borderColor: "var(--paper-3)" }}>
              Abrir el panel de portería
            </Link>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Ticket ejemplo placa="ABC123" parqueadero="Cañas Gordas" sector="Lagos" fecha="2026-11-09T13:20:00-05:00" />
          </div>
        </div>
      </section>
    </>
  );
}
