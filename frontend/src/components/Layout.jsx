import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/status', label: 'Status', icon: Activity },
];

export default function Layout({ children }) {
  const { userId, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium tracking-[-0.01em] transition-all duration-150 ${
      isActive
        ? 'bg-white/[0.06] text-text-primary'
        : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.03]'
    }`;

  const Sidebar = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-[13px] font-semibold text-text-primary tracking-[-0.01em]">
              Tuwunel
            </h1>
            <p className="text-[10px] text-text-quaternary leading-none mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="px-3 py-1.5 mb-1.5">
          <p className="text-[11px] text-text-quaternary truncate font-mono">{userId}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-text-quaternary hover:text-text-secondary hover:bg-white/[0.03] transition-all duration-150"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-surface-1 border-r border-white/[0.05] flex-col">
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-surface-1/95 backdrop-blur-md border-b border-white/[0.05] px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center">
            <Shield size={12} className="text-white" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">Tuwunel</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-tertiary hover:text-text-primary transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-20 bg-black/60 overlay-enter"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-20 w-56 bg-surface-1 overlay-enter">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 md:p-8 p-4 pt-16 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
