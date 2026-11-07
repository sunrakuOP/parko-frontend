import { FILA_TEXTO, NIVEL_TEXTO, type Nivel } from "@/lib/cupos";
import type { EstadoFila } from "@/types/api";

export const NivelChip = ({ nivel }: { nivel: Nivel }) => (
  <span className="chip" data-tone={nivel}>{NIVEL_TEXTO[nivel]}</span>
);

const TONO_FILA: Record<EstadoFila, Nivel> = { sin_fila: "libre", corta: "pocos", larga: "lleno" };
export const FilaChip = ({ fila }: { fila: EstadoFila }) => (
  <span className="chip" data-tone={TONO_FILA[fila]}>{FILA_TEXTO[fila]}</span>
);
