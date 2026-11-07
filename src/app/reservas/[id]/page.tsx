import Link from "next/link";
import { notFound } from "next/navigation";
import Ticket from "@/components/Ticket";
import Offline from "@/components/Offline";
import { ReservaActions } from "@/components/forms";
import { ApiError } from "@/lib/api";
import { reservasService } from "@/modules/reservas/services/reservasService";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";

export default async function ReservaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let reserva, parqueadero;
  try {
    reserva = await reservasService.getById(id);
    if (reserva.espacio) parqueadero = await parqueaderosService.getById(reserva.espacio.parqueaderoId);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }

  return (
    <div className="wrap pt-10 lg:pt-14">
      <Link href="/reservas" className="link label">← Reservas</Link>
      <div className="mt-6 max-w-3xl" data-rise>
        <Ticket reserva={reserva} parqueadero={parqueadero?.nombre} />
      </div>
      <div className="mt-8 max-w-3xl" data-rise style={{ "--i": 2 } as React.CSSProperties}>
        <ReservaActions id={reserva.id} estado={reserva.estado} />
      </div>
    </div>
  );
}
