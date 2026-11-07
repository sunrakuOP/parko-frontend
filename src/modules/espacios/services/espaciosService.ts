import { apiClient } from "@/lib/api";
import type { Espacio, CreateEspacioDto, UpdateEspacioDto, EstadoEspacio } from "@/types/api";

export const espaciosService = {
  // Filtros por query params: ?parqueaderoId=&estado=
  getAll: (filter?: { parqueaderoId?: number; estado?: EstadoEspacio }) =>
    apiClient.get<Espacio[]>("/espacios", filter),
  getById: (id: number | string) => apiClient.get<Espacio>(`/espacios/${id}`),
  create: (data: CreateEspacioDto) => apiClient.post<Espacio>("/espacios", data),
  update: (id: number, data: UpdateEspacioDto) => apiClient.put<Espacio>(`/espacios/${id}`, data),
  delete: (id: number) => apiClient.delete<Espacio>(`/espacios/${id}`),
};
