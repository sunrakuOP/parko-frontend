"use client";

import { useCallback, useEffect, useState } from "react";
import { sectoresService } from "@/modules/sectores/services/sectoresService";
import type { Sector } from "@/types/api";

/**
 * Mantiene los sectores al día: parte de lo que trajo el servidor y los vuelve a pedir
 * cada `cada` ms (el navegador llama a /api/*, que next.config.ts reenvía al backend).
 * Se pausa con la pestaña oculta para no gastar peticiones.
 */
export function useSectores(inicial: Sector[], cada = 15000) {
  const [sectores, setSectores] = useState(inicial);
  const [actualizado, setActualizado] = useState<number | null>(null);

  const refrescar = useCallback(async () => {
    try {
      setSectores(await sectoresService.getAll());
      setActualizado(Date.now());
    } catch {
      /* si falla un ciclo, se conserva lo último que se vio */
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refrescar();
    }, cada);
    return () => clearInterval(id);
  }, [cada, refrescar]);

  return { sectores, setSectores, actualizado, refrescar };
}
