/**
 * Motivo de Parko: una celda por cupo (hasta `max`), llena si está ocupado.
 * Con capacidades grandes cada celda representa varios cupos, y se dice en el aria-label.
 */
export default function Cells({ capacidad, ocupados, max = 40 }: { capacidad: number; ocupados: number; max?: number }) {
  const n = Math.min(capacidad, max);
  const llenas = Math.round((n * Math.min(ocupados, capacidad)) / Math.max(capacidad, 1));
  return (
    <div className="cells" role="img" aria-label={`${ocupados} de ${capacidad} cupos ocupados`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="cell" data-on={i < llenas ? "1" : "0"} />
      ))}
    </div>
  );
}
