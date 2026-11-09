"use client";

import Link from "next/link";
import { libres, nivel, slugParqueadero } from "@/lib/cupos";
import type { Parqueadero, Sector } from "@/types/api";

type Rect = { x: number; y: number; w: number; h: number };
type Lote = { label: { x: number; y: number }; rects: (Rect & { nombre: string })[] };

/*
 * Plano ESQUEMÁTICO (no está a escala), orientado como en el mapa real:
 *  - La Av. Cañasgordas corre recta, de arriba a abajo, a la derecha.
 *  - La universidad es una manzana completa contra la Avenida; detrás, la calle paralela (Cl. 17A).
 *  - Más atrás, otra paralela (Cl. 16). Gualanday queda entre ambas, sobre la Cra. 122.
 *  - La Cra. 122 (vía de la Icesi) cruza la Avenida y sigue; la Icesi queda en la esquina diagonal.
 *  - Almendros queda sobre la paralela Cl. 17A, debajo del campus, junto a la cancha.
 */
const LOTES: Record<"canas" | "almendros" | "gualanday", Lote> = {
  canas: {
    label: { x: 352, y: 118 },
    rects: [
      { nombre: "Palmas", x: 278, y: 70, w: 54, h: 96 },
      { nombre: "Centro", x: 278, y: 172, w: 54, h: 92 },
      { nombre: "Lagos", x: 338, y: 220, w: 252, h: 44 },
    ],
  },
  almendros: {
    label: { x: 252, y: 376 },
    rects: [
      { nombre: "Cedro Rosado", x: 252, y: 392, w: 108, h: 40 },
      { nombre: "Cancha y CDL", x: 368, y: 392, w: 108, h: 40 },
    ],
  },
  gualanday: {
    label: { x: 90, y: 575 },
    rects: [{ nombre: "Lote Gualanday", x: 90, y: 496, w: 128, h: 56 }],
  },
};

const COLOR_NIVEL = { libre: "var(--canopy)", pocos: "var(--amber)", lleno: "var(--brick)" } as const;

/** Reparte `n` celdas dentro de un rectángulo, lo más cuadradas posible. */
function celdas(r: Rect, n: number) {
  const pitch = Math.max(9, Math.floor(Math.sqrt((r.w * r.h) / Math.max(n, 1))));
  const cols = Math.max(1, Math.floor(r.w / pitch));
  const size = pitch - 3;
  return Array.from({ length: n }, (_, i) => ({
    x: r.x + (i % cols) * pitch + 1,
    y: r.y + Math.floor(i / cols) * pitch + 1,
    size,
  })).filter((c) => c.y + c.size <= r.y + r.h + 1);
}

const Calle = ({ d, w }: { d: string; w: number }) => (
  <>
    <path d={d} stroke="var(--paper-2)" strokeWidth={w + 6} fill="none" strokeLinecap="round" />
    <path d={d} stroke="#fff" strokeWidth={w} fill="none" strokeLinecap="round" />
  </>
);

export default function CampusMap({ parqueaderos, sectores }: { parqueaderos: Parqueadero[]; sectores: Sector[] }) {
  const arboles = [
    [400, 64, 13], [452, 88, 17], [510, 60, 12], [566, 96, 15], [420, 150, 18], [490, 168, 13], [560, 170, 16], [372, 188, 11], [596, 140, 11],
  ];

  return (
    <svg viewBox="0 0 800 640" role="group" aria-label="Plano esquemático de los tres parqueaderos de la Javeriana Cali"
      className="h-auto w-full" style={{ fontFamily: "var(--font-body), sans-serif" }}>
      <rect width="800" height="640" rx="28" fill="var(--paper-3)" />

      {/* manzanas */}
      {[[96, 70, 112, 90], [96, 190, 112, 60], [20, 90, 28, 150], [250, 306, 6, 6], [506, 300, 90, 120], [680, 40, 100, 110], [680, 190, 100, 90], [680, 310, 100, 90], [20, 300, 30, 110], [250, 560, 360, 60]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={12} fill="var(--paper-2)" opacity=".6" />
      ))}
      <text x="102" y="120" fontSize="12" fontWeight="700" fill="var(--muted)">Col. Berchmans</text>

      {/* calles paralelas a la Avenida, detrás de la universidad */}
      <Calle d="M236 -10 L230 650" w={22} />
      <Calle d="M66 -10 L60 650" w={22} />
      <text x="224" y="170" transform="rotate(-90 224 170)" fontSize="12" fontWeight="700" fill="var(--muted)" letterSpacing="2">CALLE 17A</text>
      <text x="54" y="170" transform="rotate(-90 54 170)" fontSize="12" fontWeight="700" fill="var(--muted)" letterSpacing="2">CALLE 16</text>

      {/* Av. Cañasgordas (recta) y Cra. 122 / vía de la Icesi, que cruza la Avenida y sigue */}
      <Calle d="M640 -10 C 636 200 632 420 628 650" w={46} />
      <path d="M640 -10 C 636 200 632 420 628 650" stroke="var(--ink)" strokeOpacity=".25" strokeWidth="2" strokeDasharray="12 12" fill="none" />
      <Calle d="M-10 462 C 200 458 420 454 810 448" w={30} />
      <text x="668" y="300" transform="rotate(-90 668 300)" fontSize="15" fontWeight="800" fill="var(--muted)" letterSpacing="2">AV. CAÑASGORDAS</text>
      <text x="250" y="448" fontSize="12" fontWeight="800" fill="var(--muted)" letterSpacing="1.5">CRA. 122 · VÍA DE LA ICESI</text>
      <text x="566" y="632" fontSize="14" fontWeight="800" fill="var(--muted)">↓ Pance</text>

      {/* Icesi: esquina diagonal de la vía con la Avenida */}
      <rect x="668" y="482" width="112" height="124" rx="14" fill="var(--ink)" fillOpacity=".08" stroke="var(--ink)" strokeOpacity=".3" strokeDasharray="6 6" />
      <text x="724" y="548" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ink-2)">Univ. Icesi</text>

      {/* campus: una manzana completa contra la Avenida */}
      <rect x="258" y="34" width="354" height="250" rx="24" fill="var(--canopy)" fillOpacity=".1" stroke="var(--canopy)" strokeOpacity=".45" strokeDasharray="7 7" />
      {arboles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--canopy)" fillOpacity=".22" />
      ))}
      <text x="376" y="56" fontSize="14" fontWeight="800" fill="var(--canopy)" letterSpacing="2">CAMPUS JAVERIANA CALI</text>

      {/* cancha de fútbol (junto a Almendros) */}
      <rect x="500" y="316" width="104" height="50" rx="8" fill="var(--canopy)" fillOpacity=".16" stroke="var(--canopy)" strokeOpacity=".5" />
      <line x1="552" y1="316" x2="552" y2="366" stroke="var(--canopy)" strokeOpacity=".5" />
      <circle cx="552" cy="341" r="10" fill="none" stroke="var(--canopy)" strokeOpacity=".5" />
      <text x="500" y="308" fontSize="12" fontWeight="700" fill="var(--canopy)">cancha de fútbol</text>

      {/* parqueaderos */}
      {parqueaderos.filter((p) => p.activo).map((p) => {
        const slug = slugParqueadero(p);
        if (!slug) return null;
        const lote = LOTES[slug];
        const delLote = sectores.filter((s) => s.parqueaderoId === p.id && s.activo).sort((a, b) => a.id - b.id);
        const usados = new Set<number>();
        const dibujados = delLote.flatMap((s, idx) => {
          let k = lote.rects.findIndex((r, i) => !usados.has(i) && r.nombre.toLowerCase() === s.nombre.toLowerCase());
          if (k < 0) k = lote.rects.findIndex((_, i) => !usados.has(i) && i >= idx);
          if (k < 0) return [];
          usados.add(k);
          return [{ s, r: lote.rects[k] }];
        });
        const totalLibres = delLote.reduce((a, s) => a + libres(s), 0);
        const peor = delLote.length ? nivel({ capacidad: delLote.reduce((a, s) => a + s.capacidad, 0), ocupados: delLote.reduce((a, s) => a + s.ocupados, 0) }) : "libre";
        const w = Math.max(p.nombre.length * 13.5, 150) + 28;

        let orden = 0;
        return (
          <Link key={p.id} href={`/parqueaderos/${p.id}`} aria-label={`${p.nombre}: ${totalLibres} cupos libres. Ver detalle`}>
            <g className="lot-link">
              {dibujados.map(({ s, r }) => {
                const n = Math.min(s.capacidad, 40);
                const llenas = Math.round((n * Math.min(s.ocupados, s.capacidad)) / s.capacidad);
                const colaN = s.fila === "larga" ? 4 : s.fila === "corta" ? 2 : 0;
                return (
                  <g key={s.id}>
                    <title>{`${s.nombre}: ${libres(s)} libres de ${s.capacidad}`}</title>
                    <rect x={r.x - 5} y={r.y - 5} width={r.w + 10} height={r.h + 10} rx="12" fill="#fff" stroke="var(--ink)" strokeOpacity=".55" strokeWidth="1.5" />
                    {celdas(r, n).map((c, i) => {
                      const d = orden++;
                      return (
                        <rect key={i} className="map-cell" style={{ ["--d" as string]: d }} x={c.x} y={c.y} width={c.size} height={c.size} rx="2.5"
                          fill={i < llenas ? "var(--ink)" : "none"} stroke={i < llenas ? "var(--ink)" : "var(--canopy)"} strokeWidth="1.6" />
                      );
                    })}
                    {Array.from({ length: colaN }, (_, q) => (
                      <rect key={`q${q}`} className="queue-car" style={{ ["--q" as string]: q }} x={r.x + 6 + q * 22} y={r.y - 20} width="14" height="9" rx="3" fill="var(--brick)" />
                    ))}
                  </g>
                );
              })}
              <rect x={lote.label.x} y={lote.label.y - 22} width={w} height="34" rx="17" fill="var(--ink)" />
              <circle cx={lote.label.x + 17} cy={lote.label.y - 5} r="6" fill={COLOR_NIVEL[peor]} />
              <text x={lote.label.x + 30} y={lote.label.y + 1} fontSize="17" fontWeight="800" fill="var(--paper-3)">{p.nombre}</text>
              <text x={lote.label.x + w + 8} y={lote.label.y + 2} fontSize="22" fontWeight="800" fill="var(--ink)" style={{ fontFamily: "var(--font-display), sans-serif" }}>{totalLibres}</text>
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
