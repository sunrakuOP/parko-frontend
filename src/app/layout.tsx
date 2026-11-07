import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

// Archivo con eje de ancho (wdth): expandido para display, normal para texto.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
// Martian Mono: códigos de plaza, placas y horas.
const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parko — Reserva tu plaza",
  description:
    "Disponibilidad en vivo y reservas de parqueadero. Proyecto de Plataformas Computacionales, Javeriana Cali.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${martian.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
