import { apiClient } from "@/lib/api";
import type { Vehiculo, CreateVehiculoDto } from "@/types/api";

export const vehiculosService = {
  getAll: () => apiClient.get<Vehiculo[]>("/vehiculos"),
  getByPlaca: (placa: string) => apiClient.get<Vehiculo>(`/vehiculos/${placa}`),
  create: (data: CreateVehiculoDto) => apiClient.post<Vehiculo>("/vehiculos", data),
  update: (placa: string, data: Partial<Pick<Vehiculo, "marca" | "modelo" | "tipo">>) =>
    apiClient.put<Vehiculo>(`/vehiculos/${placa}`, data),
  delete: (placa: string) => apiClient.delete<Vehiculo>(`/vehiculos/${placa}`),
};
