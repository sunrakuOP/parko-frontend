import type { EstadoFila, Parqueadero, Sector } from "@/types/api";

export type Nivel = "libre" | "pocos" | "lleno";

export const libres = (s: Pick<Sector, "capacidad" | "ocupados">) => Math.max(0, s.capacidad - s.ocupados);

/** Menos del 15% libre = "quedan pocos"; 0 = lleno. */
export function nivel(s: Pick<Sector, "capacidad" | "ocupados">): Nivel {
  const l = libres(s);
  if (l === 0) return "lleno";
  return l / s.capacidad < 0.15 ? "pocos" : "libre";
}

export const NIVEL_TEXTO: Record<Nivel, string> = { libre: "Hay cupo", pocos: "Quedan pocos", lleno: "Lleno" };
export const FILA_TEXTO: Record<EstadoFila, string> = { sin_fila: "Sin fila", corta: "Fila corta", larga: "Fila larga" };

export function totales(sectores: Sector[]) {
  const activos = sectores.filter((s) => s.activo);
  const capacidad = activos.reduce((a, s) => a + s.capacidad, 0);
  const ocupados = activos.reduce((a, s) => a + s.ocupados, 0);
  return { capacidad, ocupados, libres: Math.max(0, capacidad - ocupados) };
}

/** Fila más larga entre los sectores: lo que vive quien llega a la entrada. */
export function filaDelParqueadero(sectores: Sector[]): EstadoFila {
  if (sectores.some((s) => s.fila === "larga")) return "larga";
  if (sectores.some((s) => s.fila === "corta")) return "corta";
  return "sin_fila";
}

/** Slug estable para dibujar cada parqueadero en el plano (el nombre viene de la base de datos). */
export function slugParqueadero(p: Pick<Parqueadero, "nombre">): "canas" | "almendros" | "gualanday" | null {
  const n = p.nombre.toLowerCase();
  if (n.includes("cañas") || n.includes("canas")) return "canas";
  if (n.includes("almendro")) return "almendros";
  if (n.includes("gualanday")) return "gualanday";
  return null;
}
