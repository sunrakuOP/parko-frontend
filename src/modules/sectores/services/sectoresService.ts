import { apiClient } from "@/lib/api";
import type { Sector, UpdateSectorDto } from "@/types/api";

export const sectoresService = {
  // Filtro por query param: ?parqueaderoId=
  getAll: (filter?: { parqueaderoId?: number }) => apiClient.get<Sector[]>("/sectores", filter),
  getById: (id: number | string) => apiClient.get<Sector>(`/sectores/${id}`),
  update: (id: number, data: UpdateSectorDto) => apiClient.put<Sector>(`/sectores/${id}`, data),
  /** +1 entra un vehículo, -1 sale uno. El backend lo hace atómico y no deja salirse de 0..capacidad. */
  ajustarOcupacion: (id: number, delta: number) =>
    apiClient.patch<Sector>(`/sectores/${id}/ocupacion`, { delta }),
};
