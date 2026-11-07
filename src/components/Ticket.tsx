"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Tiquete de papel del parqueadero: solo la placa, el lugar y la hora (sin nombre ni modelo).
 * El QR codifica "PARKO|placa|parqueadero|sector|fecha-ISO". El pago queda fuera de esta entrega.
 */
export default function Ticket({
  placa,
  parqueadero,
  sector,
  fecha,
  ejemplo = false,
}: {
  placa: string;
  parqueadero: string;
  sector: string;
  fecha: string;
  ejemplo?: boolean;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const texto = `PARKO|${placa}|${parqueadero}|${sector}|${fecha}`;

  useEffect(() => {
    let vivo = true;
    QRCode.toDataURL(texto, { margin: 1, width: 240, color: { dark: "#111111", light: "#fbfbf8" } }).then((u) => vivo && setQr(u));
    return () => {
      vivo = false;
    };
  }, [texto]);

  const d = new Date(fecha);
  const dia = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", weekday: "short", day: "2-digit", month: "short" }).format(d);
  const hora = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", hour12: true }).format(d);

  return (
    <article className="paper-ticket" aria-label={`Tiquete de parqueadero, placa ${placa}`}>
      {/* logo oficial (blanco en origen): se oscurece con un filtro porque el papel es claro */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo-javeriana-cali.svg" alt="Pontificia Universidad Javeriana Cali" width={150} height={58} style={{ filter: "brightness(0)", height: "auto" }} />
      <p className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.3em]" style={{ color: "#555" }}>Parqueadero</p>

      <div className="my-5 text-center">
        <span className="plate">{placa}</span>
      </div>

      <div className="mx-auto h-[150px] w-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {qr ? <img src={qr} alt="Código QR del tiquete" width={150} height={150} /> : null}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-wider" style={{ color: "#555" }}>Parqueadero</dt>
          <dd className="font-bold leading-tight">{parqueadero}</dd>
        </div>
        <div>
          <dt className="text-[0.66rem] font-bold uppercase tracking-wider" style={{ color: "#555" }}>Sector</dt>
          <dd className="font-bold leading-tight">{sector}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.66rem] font-bold uppercase tracking-wider" style={{ color: "#555" }}>Entrada</dt>
          <dd className="font-bold first-letter:uppercase">{dia} · {hora}</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-dashed border-[#111] pt-3 text-[0.68rem] leading-snug" style={{ color: "#555" }}>
        {ejemplo ? "Ejemplo ilustrativo. " : ""}Proyecto académico de Parko: no es un recibo oficial ni sirve para el cobro.
      </p>
    </article>
  );
}
