import { codigoPlaza } from "@/lib/format";
import type { Espacio } from "@/types/api";

// Posiciones sobre la imagen donde caen plazas visibles (decorativas; los códigos sí son reales).
const SPOTS = [
  { left: "22%", top: "38%" },
  { left: "47%", top: "62%" },
  { left: "71%", top: "30%" },
];

/** Banda a sangre con vista cenital. Los marcadores muestran plazas libres reales. */
export default function AerialBand({ libres, total }: { libres: Espacio[]; total: number }) {
  const marcadas = libres.slice(0, SPOTS.length);
  return (
    <section className="relative isolate mt-24 overflow-hidden border-y-2 border-ink" aria-label="Vista cenital del parqueadero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/lote-cenital.jpg"
        alt="Vista aérea de un parqueadero universitario con plazas pintadas y árboles"
        width={1344}
        height={768}
        loading="lazy"
        decoding="async"
        className="aerial-img h-[22rem] w-full object-cover md:h-[26rem]"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(14,17,22,.78) 0%, rgba(14,17,22,.15) 60%)" }} />

      {marcadas.map((e, i) => (
        <span key={e.id} className="pin absolute" style={{ ...SPOTS[i], animationDelay: `${i * 0.6}s` }}>
          <i aria-hidden />
          <b className="mono">{codigoPlaza(e.numero)}</b>
        </span>
      ))}

      <div className="wrap absolute inset-x-0 bottom-0 pb-6" style={{ color: "var(--line)" }}>
        <p className="label" style={{ color: "#aeb3bb" }}>Libres ahora en toda la red</p>
        <p className="mono text-6xl font-bold leading-none md:text-7xl">
          {libres.length}
          <span className="text-2xl font-medium" style={{ color: "#aeb3bb" }}>/{total}</span>
        </p>
        <p className="mono mt-2 text-[0.65rem]" style={{ color: "#8d939d" }}>Imagen ilustrativa generada con IA</p>
      </div>
    </section>
  );
}
