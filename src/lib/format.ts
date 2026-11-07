const TZ = "America/Bogota";

export const fmtFecha = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { timeZone: TZ, day: "2-digit", month: "short" })
    .format(new Date(iso))
    .replace(".", "")
    .toUpperCase();

export const fmtHora = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(iso),
  );

export const fmtFechaHora = (iso: string) => `${fmtFecha(iso)} · ${fmtHora(iso)}`;

/** Código de plaza visible: "A-14" ya viene del backend, solo se normaliza. */
export const codigoPlaza = (numero: string) => numero.toUpperCase();

/** Agrupa plazas por fila: "A-14" → fila "A". Sin guion, todo cae en la fila "·". */
export function agruparPorFila<T extends { numero: string }>(espacios: T[]) {
  const filas = new Map<string, T[]>();
  for (const e of espacios) {
    const fila = e.numero.includes("-") ? e.numero.split("-")[0].toUpperCase() : "·";
    if (!filas.has(fila)) filas.set(fila, []);
    filas.get(fila)!.push(e);
  }
  const num = (n: string) => parseInt(n.split("-")[1] ?? n, 10) || 0;
  return [...filas.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fila, items]) => ({ fila, items: items.sort((x, y) => num(x.numero) - num(y.numero)) }));
}

/** Pasa un Date local al formato que espera <input type="datetime-local">. */
export const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
