import OperatorPanel from "@/components/OperatorPanel";
import Offline from "@/components/Offline";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { sectoresService } from "@/modules/sectores/services/sectoresService";

export const metadata = { title: "Portería — Parko" };

export default async function OperadorPage() {
  let parqueaderos, sectores;
  try {
    [parqueaderos, sectores] = await Promise.all([parqueaderosService.getAll(), sectoresService.getAll()]);
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  return (
    <div className="wrap pb-24 pt-8 md:pt-12">
      <h1 className="display" data-rise style={{ fontSize: "clamp(2.4rem,5.5vw,4.5rem)" }}>Panel de portería</h1>
      <p className="lead mt-4 mb-10" data-rise style={{ "--i": 1 } as React.CSSProperties}>
        Marca cada entrada y salida. Los cupos que ve todo el mundo se actualizan en segundos.
      </p>
      <OperatorPanel parqueaderos={parqueaderos} sectoresIniciales={sectores} />
    </div>
  );
}
