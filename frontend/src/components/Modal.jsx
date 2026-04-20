import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, children, wide }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 overlay-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-surface-1 border border-border-standard rounded-xl shadow-dialog modal-enter overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-0">
          <div>
            <h3 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[13px] text-text-tertiary mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-quaternary hover:text-text-secondary hover:bg-white/[0.05] transition-colors"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
