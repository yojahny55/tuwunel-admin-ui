import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/rooms', label: 'Rooms', icon: '🚪' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/status', label: 'Status', icon: '💚' },
];

export default function Layout() {
  const { userId, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-56 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white">⚔️ Tuwunel Admin</h1>
          <p className="text-xs text-gray-500 mt-1">{userId}</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 border-b border-gray-800 p-3 flex items-center justify-between">
        <h1 className="text-sm font-bold">⚔️ Tuwunel Admin</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900/95 pt-14">
          <nav className="p-4 space-y-2">
            {nav.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-md text-base text-gray-300 hover:bg-gray-800"
              >
                {icon} {label}
              </NavLink>
            ))}
            <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-md text-base text-gray-400 hover:bg-gray-800">
              🚪 Logout
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 md:p-6 p-4 pt-16 md:pt-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
