export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>}
      {children}
    </div>
  );
}
