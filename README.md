# Parko Frontend

Frontend de **Parko** (gestión y reserva de parqueaderos) para Plataformas Computacionales,
Pontificia Universidad Javeriana Cali. Next.js 16 (App Router) + TypeScript + Tailwind 4, siguiendo la
estructura de la guía del profesor (`frontend-nextjs-seed`): `lib/api.ts` con `apiClient`, tipos en
`types/api.ts` y un `modules/*/services` por recurso. Consume el backend NestJS de
[parko-backend](https://github.com/sunrakuOP/parko-backend).

Dirección de arte (tablero de salidas, estilo señalética): [`docs/direccion-arte.md`](./docs/direccion-arte.md).

## Rutas

| Ruta | Qué hace |
| --- | --- |
| `/` | Tablero split-flap con disponibilidad en vivo (se refresca cada 20 s), último tiquete y parqueaderos |
| `/parqueaderos` | Lista y creación de parqueaderos |
| `/parqueaderos/[id]` | Plano del parqueadero; una plaza libre abre el panel de reserva; agregar plazas |
| `/reservas?estado=` | Lista con filtro por estado |
| `/reservas/[id]` | Tiquete; confirmar, completar o cancelar (solo transiciones válidas) |
| `/users`, `/users/[id]` | Conductores, sus vehículos y sus reservas |

En Next 16 `params` y `searchParams` son `Promise`: se leen con `await` (la guía usa la forma anterior).

## Variables de entorno

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000   # backend local
# producción: NEXT_PUBLIC_API_URL=http://18.119.140.37:3000
```

**Por qué hay un proxy `/api`:** el backend en EC2 es `http://` y Vercel sirve `https://`; el navegador
bloquea esa mezcla. `next.config.ts` reenvía `/api/*` al backend, así el navegador solo habla con el
dominio del frontend. El código de servidor llama al backend directo; el de navegador, a `/api`
(ver `src/lib/api.ts`).

## Desarrollo

```bash
npm install
# terminal 1: backend en :3000   |   terminal 2:
NEXT_PUBLIC_API_URL=http://localhost:3000 PORT=3001 npm run dev   # http://localhost:3001
npm run lint && npm run build
```

## Despliegue en Vercel

1. Importar el repo en Vercel (framework Next.js, sin configuración extra).
2. Variable de entorno: `NEXT_PUBLIC_API_URL` = URL del backend (EC2).
3. Deploy. Cada push a `main` redespliega.
