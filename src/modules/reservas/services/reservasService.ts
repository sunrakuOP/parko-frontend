import { apiClient } from "@/lib/api";
import type { Reserva, CreateReservaDto, EstadoReserva } from "@/types/api";

export const reservasService = {
  // Filtros por query params: ?estado=&usuarioId=&espacioId=
  getAll: (filter?: { estado?: EstadoReserva; usuarioId?: number; espacioId?: number }) =>
    apiClient.get<Reserva[]>("/reservas", filter),
  getById: (id: number | string) => apiClient.get<Reserva>(`/reservas/${id}`),
  create: (data: CreateReservaDto) => apiClient.post<Reserva>("/reservas", data),
  // pendiente→confirmada|cancelada · confirmada→completada|cancelada (el backend valida)
  cambiarEstado: (id: number, estado: EstadoReserva) =>
    apiClient.put<Reserva>(`/reservas/${id}`, { estado }),
  cancelar: (id: number) => apiClient.delete<Reserva>(`/reservas/${id}`),
};
