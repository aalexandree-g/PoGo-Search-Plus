const Logo = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    role="img"
    aria-label="PoGo Search Plus"
  >
    {/* Outer circle */}
    <circle
      cx="50"
      cy="50"
      r="44"
      fill="var(--logo-bottom)"
      stroke="var(--logo-stroke)"
      strokeWidth="8"
    />

    {/* Top half */}
    <path d="M 9 50 A 30 30 0 0 1 91 50 L 6 50 Z" fill="currentColor" />

    {/* Middle band */}
    <rect x="6" y="46" width="88" height="8" fill="var(--logo-stroke)" />

    {/* Center button */}
    <circle
      cx="50"
      cy="50"
      r="12.5"
      fill="var(--logo-center)"
      stroke="var(--logo-stroke)"
      strokeWidth="6"
    />
  </svg>
)

export default Logo
