"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/parqueaderos", label: "Parqueaderos" },
  { href: "/reservas", label: "Reservas" },
  { href: "/users", label: "Conductores" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header
      className="border-b-2 border-ink"
      style={{ background: "var(--paper)", zIndex: "var(--z-nav)" }}
    >
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Parko, inicio">
          <Logo />
          <span className="text-xl font-black tracking-tight" style={{ fontStretch: "125%" }}>
            PARKO
          </span>
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-1.5">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
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
