"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Cupos" },
  { href: "/operador", label: "Portería" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b-2 border-ink" style={{ background: "var(--paper)", zIndex: "var(--z-nav)" }}>
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Parko, inicio">
          <Logo />
          <span className="num text-2xl" style={{ letterSpacing: "-0.04em" }}>parko</span>
        </Link>
        <nav aria-label="Principal" className="flex gap-2">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" || pathname.startsWith("/parqueaderos") : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className="tab" aria-current={active ? "true" : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
