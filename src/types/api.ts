/**
 * Tipos compartidos con el backend NestJS de Parko.
 * Espejo de las entities y DTOs del backend (nombres de campo en español, decisión del equipo).
 */

export type UserRole = "admin" | "operador" | "conductor";
export type TipoVehiculo = "carro" | "moto";
export type TipoEspacio = "carro" | "moto" | "discapacitado";
export type EstadoEspacio = "disponible" | "ocupado" | "reservado" | "mantenimiento";
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada" | "completada";

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: UserRole;
  activo: boolean;
}
export interface CreateUserDto {
  nombre: string;
  email: string;
  telefono: string;
  rol?: UserRole;
}
export type UpdateUserDto = Partial<CreateUserDto>;

export interface Vehiculo {
  placa: string;
  marca: string;
  modelo: string;
  tipo: TipoVehiculo;
  usuarioId: number;
  activo: boolean;
}
export interface CreateVehiculoDto {
  placa: string;
  marca: string;
  modelo: string;
  tipo: TipoVehiculo;
  usuarioId: number;
}

export interface Parqueadero {
  id: number;
  nombre: string;
  direccion: string;
  capacidadTotal: number;
  activo: boolean;
}
export interface CreateParqueaderoDto {
  nombre: string;
  direccion: string;
  capacidadTotal: number;
}

export interface Espacio {
  id: number;
  parqueaderoId: number;
  numero: string;
  tipo: TipoEspacio;
  estado: EstadoEspacio;
}
export interface CreateEspacioDto {
  parqueaderoId: number;
  numero: string;
  tipo: TipoEspacio;
}
/** `reservado` solo lo asigna el backend al crear una reserva. */
export interface UpdateEspacioDto {
  tipo?: TipoEspacio;
  estado?: Exclude<EstadoEspacio, "reservado">;
}

export interface Reserva {
  id: number;
  usuarioId: number;
  vehiculoPlaca: string;
  espacioId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoReserva;
  usuario?: User;
  vehiculo?: Vehiculo;
  espacio?: Espacio;
}
export interface CreateReservaDto {
  usuarioId: number;
  vehiculoPlaca: string;
  espacioId: number;
  fechaInicio: string;
  fechaFin: string;
}
