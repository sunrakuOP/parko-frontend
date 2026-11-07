import { apiClient } from "@/lib/api";
import type { Parqueadero, CreateParqueaderoDto } from "@/types/api";

export const parqueaderosService = {
  getAll: () => apiClient.get<Parqueadero[]>("/parqueaderos"),
  getById: (id: number | string) => apiClient.get<Parqueadero>(`/parqueaderos/${id}`),
  create: (data: CreateParqueaderoDto) => apiClient.post<Parqueadero>("/parqueaderos", data),
  update: (id: number, data: Partial<CreateParqueaderoDto>) =>
    apiClient.put<Parqueadero>(`/parqueaderos/${id}`, data),
  delete: (id: number) => apiClient.delete<Parqueadero>(`/parqueaderos/${id}`),
};
