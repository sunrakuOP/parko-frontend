/** Estado de error cuando el backend no responde: dice qué pasó y qué hacer. */
export default function Offline({ detail }: { detail?: string }) {
  return (
    <div className="wrap py-20">
      <div className="max-w-xl rounded-[var(--r)] border-2 border-ink p-6" style={{ background: "var(--paper-3)" }}>
        <p className="small" style={{ color: "var(--brick)" }}>Sin conexión con el servidor</p>
        <h1 className="h2 mt-2">No pudimos leer los cupos.</h1>
        <p className="mt-3 text-[0.95rem]" style={{ color: "var(--ink-2)" }}>
          El backend no respondió. Revisa que esté encendido y que <code>NEXT_PUBLIC_API_URL</code> apunte a su
          dirección, y recarga la página.
        </p>
        {detail && <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>{detail}</p>}
      </div>
    </div>
  );
}
