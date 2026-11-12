/** Antique-gold line ornaments (inline SVG, no raster needed). */

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`gold-divider ${className}`}
      viewBox="0 0 260 24"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gd-l" x1="0" x2="1">
          <stop offset="0" stopColor="#B69A64" stopOpacity="0" />
          <stop offset="1" stopColor="#B69A64" />
        </linearGradient>
        <linearGradient id="gd-r" x1="1" x2="0">
          <stop offset="0" stopColor="#B69A64" stopOpacity="0" />
          <stop offset="1" stopColor="#B69A64" />
        </linearGradient>
      </defs>
      <path d="M4 12H104" stroke="url(#gd-l)" strokeWidth="1" />
      <path d="M156 12H256" stroke="url(#gd-r)" strokeWidth="1" />
      {/* center diamond & leaves */}
      <path d="M130 5l7 7-7 7-7-7z" fill="none" stroke="#B69A64" strokeWidth="1.1" />
      <circle cx="130" cy="12" r="1.8" fill="#B69A64" />
      <path d="M118 12c-4-5-9-5-12-2 4 1 8 1 12 2zM142 12c4-5 9-5 12-2-4 1-8 1-12 2z" fill="#B69A64" opacity=".75" />
      <path d="M118 12c-4 5-9 5-12 2 4-1 8-1 12-2zM142 12c4 5 9 5 12 2-4-1-8-1-12-2z" fill="#B69A64" opacity=".5" />
    </svg>
  );
}

/** Four filigree corners to place inside a `position: relative` frame. */
export function FrameCorners() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <svg key={c} className={`frame-corner frame-corner--${c}`} viewBox="0 0 44 44" aria-hidden="true">
          <path d="M2 42V12C2 6 6 2 12 2h30" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9 42V17c0-5 3-8 8-8h25" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".7" />
          <path d="M14 14c4 0 7 3 7 7-4 0-7-3-7-7z" fill="currentColor" opacity=".8" />
          <circle cx="2.5" cy="2.5" r="2.3" fill="currentColor" />
        </svg>
      ))}
    </>
  );
}
