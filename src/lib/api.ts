/**
 * apiClient — capa base para hablar con el backend NestJS (fetch nativo, tipado).
 *
 * Dos caminos, una sola función:
 *  - En el SERVIDOR (Server Components) se llama directo a NEXT_PUBLIC_API_URL.
 *  - En el NAVEGADOR se llama a /api/*, que next.config.ts reenvía al backend. Así
 *    funciona desde Vercel (https) aunque el backend esté en http (EC2).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const BASE = typeof window === "undefined" ? API_URL : "/api";

export class ApiError extends Error {
  public status: number;
  public data: unknown;
  constructor(status: number, data: unknown) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? Array.isArray((data as { message: unknown }).message)
          ? (data as { message: string[] }).message.join(", ")
          : String((data as { message: unknown }).message)
        : `Error ${status}`;
    super(msg);
    this.status = status;
    this.data = data;
  }
}

type Params = Record<string, string | number | undefined>;

function buildUrl(path: string, params?: Params) {
  const qs = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    }
  }
  const query = qs.toString();
  return `${BASE}${path}${query ? `?${query}` : ""}`;
}

async function request<T>(path: string, init?: RequestInit, params?: Params): Promise<T> {
  const res = await fetch(buildUrl(path, params), { cache: "no-store", ...init });
  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => ({ message: res.statusText })));
  }
  return res.json().catch(() => undefined as T);
}

const json = (method: string, data: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const apiClient = {
  get: <T>(path: string, params?: Params) => request<T>(path, undefined, params),
  post: <T>(path: string, data: unknown) => request<T>(path, json("POST", data)),
  put: <T>(path: string, data: unknown) => request<T>(path, json("PUT", data)),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { API_URL };
