import Link from "next/link";
import Offline from "@/components/Offline";
import { CreateUserForm } from "@/components/forms";
import { usersService } from "@/modules/users/services/usersService";

export const metadata = { title: "Conductores — Parko" };

export default async function UsersPage() {
  let users;
  try {
    users = await usersService.getAll();
  } catch (e) {
    return <Offline detail={e instanceof Error ? e.message : undefined} />;
  }
  const activos = users.filter((u) => u.activo);

  return (
    <div className="wrap grid gap-12 pt-12 md:pt-16 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <h1 className="display" data-rise style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>Conductores</h1>
        <div className="mt-10 border-t-2 border-ink">
          {activos.length === 0 && <p className="py-8">Aún no hay conductores. Registra el primero.</p>}
          {activos.map((u, i) => (
            <Link
              key={u.id}
              href={`/users/${u.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-ink py-4 transition-colors duration-150 hover:bg-[var(--paper-2)]"
              data-rise
              style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
            >
              <span>
                <span className="h3 block">{u.nombre}</span>
                <span className="mono text-xs" style={{ color: "var(--muted)" }}>{u.email} · {u.telefono}</span>
              </span>
              <span className="chip" data-s={u.rol === "conductor" ? "disponible" : "reservado"}>{u.rol}</span>
            </Link>
          ))}
        </div>
      </section>
      <aside className="lg:col-span-4 lg:col-start-9 lg:mt-24">
        <div className="border-2 border-ink p-5" style={{ background: "var(--paper-3)" }}>
          <h2 className="h3 mb-4">Registrar conductor</h2>
          <CreateUserForm />
        </div>
      </aside>
    </div>
  );
}
