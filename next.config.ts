import type { NextConfig } from "next";

// URL del backend NestJS (local o EC2). Es la misma variable que pide la guía del profesor.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  // El backend en EC2 es http:// y Vercel sirve https://. Un navegador bloquea esa mezcla
  // ("mixed content"), así que el navegador le habla a /api/* (mismo dominio, https) y
  // Next reenvía la petición al backend desde el servidor.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
