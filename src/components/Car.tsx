/** Carro visto desde arriba. `tone` colorea la carrocería. */
export default function Car({ tone = "#d64545", moto = false }: { tone?: string; moto?: boolean }) {
  if (moto) {
    return (
      <svg width="16" height="46" viewBox="0 0 16 46" aria-hidden>
        <rect x="6" y="0" width="4" height="10" rx="2" fill="#2a2f37" />
        <rect x="5" y="10" width="6" height="26" rx="3" fill={tone} />
        <rect x="6" y="36" width="4" height="10" rx="2" fill="#2a2f37" />
      </svg>
    );
  }
  return (
    <svg width="34" height="64" viewBox="0 0 34 64" aria-hidden>
      <rect x="0" y="9" width="5" height="12" rx="1.5" fill="#2a2f37" />
      <rect x="29" y="9" width="5" height="12" rx="1.5" fill="#2a2f37" />
      <rect x="0" y="43" width="5" height="12" rx="1.5" fill="#2a2f37" />
      <rect x="29" y="43" width="5" height="12" rx="1.5" fill="#2a2f37" />
      <rect x="3" y="2" width="28" height="60" rx="9" fill={tone} />
      <rect x="7" y="16" width="20" height="11" rx="2.5" fill="#14171c" opacity=".85" />
      <rect x="7" y="40" width="20" height="9" rx="2.5" fill="#14171c" opacity=".85" />
      <rect x="9" y="29" width="16" height="9" rx="1.5" fill="#000" opacity=".18" />
    </svg>
  );
}
