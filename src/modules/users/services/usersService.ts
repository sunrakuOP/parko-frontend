/**
 * usersService — capa de servicio para Users (conductores, operadores, admins).
 * Cada módulo tiene su services/ y usa apiClient de lib/api.ts.
 */
import { apiClient } from "@/lib/api";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/api";

export const usersService = {
  getAll: () => apiClient.get<User[]>("/users"),
  getById: (id: number | string) => apiClient.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => apiClient.post<User>("/users", data),
  update: (id: number, data: UpdateUserDto) => apiClient.put<User>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete<User>(`/users/${id}`),
};
