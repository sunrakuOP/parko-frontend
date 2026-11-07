/** Cuadro "P" — el signo de parqueadero es el motivo de marca. */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center bg-go font-black text-ink"
      style={{
        width: size,
        height: size,
        border: "2px solid var(--ink)",
        borderRadius: 2,
        fontStretch: "125%",
        fontSize: size * 0.62,
        lineHeight: 1,
      }}
    >
      P
    </span>
  );
}
