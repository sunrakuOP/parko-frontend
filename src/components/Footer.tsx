import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink" style={{ background: "var(--ink)", color: "var(--paper-3)" }}>
      <div className="wrap grid gap-8 py-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="flex items-center gap-2.5">
            <Logo size={28} ink="#f1f2ee" />
            <span className="num text-2xl">parko</span>
          </div>
          <p className="mt-4 max-w-md text-sm" style={{ color: "#b9c4bd" }}>
            Proyecto de Plataformas Computacionales, Ingeniería de Sistemas, Pontificia Universidad Javeriana Cali.
            Proyecto académico: no es un servicio oficial de la universidad.
          </p>
        </div>
        <p className="text-sm md:col-span-4 md:col-start-9" style={{ color: "#b9c4bd" }}>
          Campus: Cl. 18 # 118-250, Cali.
          <br />
          Ubicaciones tomadas de Google Maps. Las capacidades marcadas con * son estimadas.
        </p>
      </div>
    </footer>
  );
}
