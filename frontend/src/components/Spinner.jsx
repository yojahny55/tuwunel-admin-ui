export default function Spinner({ size = 16, className = '' }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        className="animate-spin"
      >
        <circle
          cx="8"
          cy="8"
          r="6.5"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />
        <circle
          cx="8"
          cy="8"
          r="6.5"
          fill="none"
          stroke="#5e6ad2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="10 31"
        />
      </svg>
    </div>
  );
}
