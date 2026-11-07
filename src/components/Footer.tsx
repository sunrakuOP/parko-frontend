import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24" style={{ background: "var(--asphalt)", color: "var(--line)" }}>
      <div className="stripes-light" />
      <div className="wrap grid gap-8 py-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo size={30} />
            <span className="text-lg font-black" style={{ fontStretch: "125%" }}>
              PARKO
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm" style={{ color: "#aeb3bb" }}>
            Reserva de parqueaderos para el campus. Proyecto de Plataformas Computacionales,
            Ingeniería de Sistemas, Pontificia Universidad Javeriana Cali.
          </p>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="label" style={{ color: "#8d939d" }}>Código de la sede</p>
          <p className="mono mt-1 text-5xl font-bold" style={{ color: "var(--go)" }}>
            P-01
          </p>
          <p className="mono mt-2 text-xs" style={{ color: "#8d939d" }}>
            Calle 18 # 118-250 · Cali
          </p>
        </div>
      </div>
    </footer>
  );
}
