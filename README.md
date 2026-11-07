# Parko Frontend

Frontend de **Parko**: cupos en vivo de los tres parqueaderos de la Javeriana Cali (Cañas Gordas,
Almendros y Gualanday), por sector y con el estado de la fila. Proyecto de Plataformas Computacionales,
Pontificia Universidad Javeriana Cali. Next.js 16 (App Router) + TypeScript + Tailwind 4, siguiendo la
estructura de la guía del profesor (`frontend-nextjs-seed`): `lib/api.ts` con `apiClient`, tipos en
`types/api.ts` y un `modules/*/services` por recurso. Consume
[parko-backend](https://github.com/sunrakuOP/parko-backend).

**Enfoque:** en los parqueaderos de la U no se reserva; se mira cuántos cupos quedan, dónde y si hay fila.
Por eso la interfaz muestra cupos (no plazas) y la portería los actualiza con +1 / −1.
Dirección de arte: [`docs/direccion-arte.md`](./docs/direccion-arte.md).

## Rutas

| Ruta | Qué hace |
| --- | --- |
| `/` | Plano esquemático de los tres parqueaderos, cupos libres en vivo (cada 15 s) y detalle por sector |
| `/parqueaderos/[id]` | Un parqueadero: cupos por sector, fila y capacidad (ruta dinámica) |
| `/operador` | Portería: +1 / −1 por sector, estado de la fila, ajuste de capacidad y emisión de tiquete con QR |

En Next 16 `params` es una `Promise` y se lee con `await` (la guía usa la forma anterior).

## Datos

- Ubicaciones reales (Google Maps). Las **capacidades son estimadas** (marcadas con `*`) hasta contar con
  el dato oficial; se pueden corregir desde `/operador` → "Ajustar capacidad".
- Los valores de ocupación del seed son de demostración.
- `/operador` no tiene inicio de sesión en esta entrega.
- El tiquete usa el logo oficial de la web de la Javeriana Cali (`public/img/logo-javeriana-cali.svg`) con fines
  académicos; no es un recibo oficial.

## Variables de entorno

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000   # backend local
# producción: NEXT_PUBLIC_API_URL=http://18.119.140.37:3000
```

**Por qué hay un proxy `/api`:** el backend en EC2 es `http://` y Vercel sirve `https://`; el navegador
bloquea esa mezcla. `next.config.ts` reenvía `/api/*` al backend. El código de servidor llama al backend
directo y el de navegador a `/api` (ver `src/lib/api.ts`). La variable se lee al **construir**, así que debe
estar definida antes del primer deploy.

## Desarrollo

```bash
npm install
# terminal 1: backend en :3000 (rama con el módulo /sectores)
NEXT_PUBLIC_API_URL=http://localhost:3000 PORT=3001 npm run dev   # http://localhost:3001
npm run lint && npm run build
```

## Despliegue en Vercel

1. Importar el repo en Vercel (framework Next.js, sin configuración extra).
2. Variable de entorno `NEXT_PUBLIC_API_URL` = URL del backend (EC2).
3. Deploy. Cada push a `main` redespliega.
