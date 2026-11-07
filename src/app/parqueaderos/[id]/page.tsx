import Link from "next/link";
import { notFound } from "next/navigation";
import LotLive from "@/components/LotLive";
import Offline from "@/components/Offline";
import { ApiError } from "@/lib/api";
import { parqueaderosService } from "@/modules/parqueaderos/services/parqueaderosService";
import { sectoresService } from "@/modules/sectores/services/sectoresService";

// Next 16: params es una Promise (la guía del profesor usa la forma anterior, params.id).
export default async function ParqueaderoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let p, sectores;
  try {
    [p, sectores] = await Promise.all([parqueaderosService.getById(id), sectoresService.getAll({ parqueaderoId: Number(id) })]);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }

  return (
    <div className="wrap pb-24 pt-8 md:pt-12">
      <Link href="/" className="link small">← Todos los parqueaderos</Link>
      <LotLive parqueadero={p} sectoresIniciales={sectores} />
    </div>
  );
}
