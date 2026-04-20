export default function Card({ title, children, className = '', action }) {
  return (
    <div
      className={`bg-white/[0.02] border border-border-subtle rounded-lg p-4 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="text-[12px] font-medium uppercase tracking-[0.04em] text-text-quaternary">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
