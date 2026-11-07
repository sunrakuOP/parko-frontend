"use client";

import Link from "next/link";
import { libres, nivel, slugParqueadero } from "@/lib/cupos";
import type { Parqueadero, Sector } from "@/types/api";

type Rect = { x: number; y: number; w: number; h: number };
type Lote = { label: { x: number; y: number }; rects: (Rect & { nombre: string })[] };

// Plano ESQUEMÁTICO (no está a escala). Cañas Gordas en L (Palmas → Lagos) dentro del campus,
// Almendros atrás junto a la cancha y el CDL, Gualanday más abajo sobre la vía de la Icesi.
const LOTES: Record<"canas" | "almendros" | "gualanday", Lote> = {
  canas: {
    label: { x: 128, y: 112 },
    rects: [
      { nombre: "Palmas", x: 58, y: 70, w: 54, h: 100 },
      { nombre: "Centro", x: 58, y: 176, w: 54, h: 94 },
      { nombre: "Lagos", x: 118, y: 222, w: 262, h: 48 },
    ],
  },
  almendros: {
    label: { x: 126, y: 396 },
    rects: [
      { nombre: "Cedro Rosado", x: 126, y: 408, w: 88, h: 72 },
      { nombre: "Cancha y CDL", x: 222, y: 408, w: 88, h: 72 },
    ],
  },
  gualanday: {
    label: { x: 126, y: 534 },
    rects: [{ nombre: "Lote Gualanday", x: 126, y: 546, w: 196, h: 54 }],
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

export default function CampusMap({ parqueaderos, sectores }: { parqueaderos: Parqueadero[]; sectores: Sector[] }) {
  // árboles decorativos del campus (posiciones fijas, deterministas)
  const arboles = [
    [150, 60, 14], [200, 80, 18], [260, 55, 12], [330, 90, 16], [370, 60, 12], [175, 130, 12],
    [250, 150, 20], [320, 160, 14], [380, 130, 12], [150, 190, 11],
  ];

  return (
    <svg viewBox="0 0 800 640" role="group" aria-label="Plano esquemático de los tres parqueaderos de la Javeriana Cali"
      className="h-auto w-full" style={{ fontFamily: "var(--font-body), sans-serif" }}>
      <rect width="800" height="640" rx="28" fill="var(--paper-3)" />

      {/* manzanas de la ciudad */}
      {[[470, 40, 130, 90], [630, 60, 120, 130], [480, 170, 90, 110], [610, 240, 140, 100], [490, 330, 110, 150], [640, 380, 110, 90], [40, 330, 70, 150], [340, 330, 60, 60]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={14} fill="var(--paper-2)" opacity=".7" />
      ))}

      {/* Avenida Cañasgordas y vía de la Icesi */}
      <path d="M452 -10 C 446 200 430 420 426 650" stroke="var(--paper-2)" strokeWidth="44" fill="none" strokeLinecap="round" />
      <path d="M452 -10 C 446 200 430 420 426 650" stroke="#fff" strokeWidth="38" fill="none" strokeLinecap="round" />
      <path d="M452 -10 C 446 200 430 420 426 650" stroke="var(--ink)" strokeOpacity=".25" strokeWidth="2" strokeDasharray="12 12" fill="none" />
      <path d="M430 478 C 340 500 250 505 118 520 C 90 523 80 560 100 612" stroke="var(--paper-2)" strokeWidth="30" fill="none" strokeLinecap="round" />
      <path d="M430 478 C 340 500 250 505 118 520 C 90 523 80 560 100 612" stroke="#fff" strokeWidth="24" fill="none" strokeLinecap="round" />
      <text x="474" y="320" transform="rotate(-92 474 320)" fontSize="17" fontWeight="700" fill="var(--muted)" letterSpacing="2">AV. CAÑASGORDAS</text>
      <text x="322" y="504" fontSize="12" fontWeight="700" fill="var(--muted)" letterSpacing="1">VÍA DE LA ICESI</text>
      <text x="446" y="626" fontSize="15" fontWeight="700" fill="var(--muted)">↓ Pance</text>
      <text x="520" y="590" fontSize="15" fontWeight="700" fill="var(--muted)">Univ. Icesi</text>

      {/* campus */}
      <rect x="34" y="32" width="380" height="262" rx="26" fill="var(--canopy)" fillOpacity=".1" stroke="var(--canopy)" strokeOpacity=".45" strokeDasharray="7 7" />
      {arboles.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--canopy)" fillOpacity=".22" />
      ))}
      <text x="54" y="54" fontSize="15" fontWeight="800" fill="var(--canopy)" letterSpacing="2">CAMPUS JAVERIANA CALI</text>

      {/* cancha de fútbol (junto a Almendros) */}
      <rect x="140" y="326" width="160" height="56" rx="8" fill="var(--canopy)" fillOpacity=".16" stroke="var(--canopy)" strokeOpacity=".5" />
      <line x1="220" y1="326" x2="220" y2="382" stroke="var(--canopy)" strokeOpacity=".5" />
      <circle cx="220" cy="354" r="11" fill="none" stroke="var(--canopy)" strokeOpacity=".5" />
      <text x="140" y="318" fontSize="14" fontWeight="700" fill="var(--canopy)">cancha de fútbol</text>

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
                const n = Math.min(s.capacidad, 60);
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
