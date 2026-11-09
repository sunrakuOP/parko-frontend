import { NIVEL_TEXTO, type Nivel } from "@/lib/cupos";

/** Estado del cupo en una pastilla suave (sin borde), con punto de color. */
export const NivelBadge = ({ nivel }: { nivel: Nivel }) => (
  <span className="badge" data-tone={nivel}>{NIVEL_TEXTO[nivel]}</span>
);
