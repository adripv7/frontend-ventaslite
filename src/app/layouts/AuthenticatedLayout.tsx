import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, ReceiptText, ShoppingCart, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../providers/AuthProvider';
import './layout.css';

const navigation = [
  { to: '/dashboard', label: 'Dashboard y Reportes', permission: 'reports.view', icon: LayoutDashboard },
  { to: '/pos', label: 'Punto de Venta', permission: 'sales.create', icon: ShoppingCart },
  { to: '/sales', label: 'Historial de Ventas', permission: 'sales.view_all', alternatePermission: 'sales.view_own', icon: ReceiptText },
];

function AppNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const visibleNavigation = navigation.filter((item) =>
    user?.permissions.includes(item.permission) ||
    ('alternatePermission' in item && Boolean(item.alternatePermission && user?.permissions.includes(item.alternatePermission))),
  );

  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-1.5">
      {visibleNavigation.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) => `app-nav-link ${isActive ? 'app-nav-link-active' : ''}`}
        >
          <Icon aria-hidden="true" size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5">
      <span className="brand-mark brand-mark-small"><ShoppingCart size={19} /></span>
      <span className="leading-tight">
        <strong className="block text-sm font-bold text-white">VentasLite</strong>
        <small className="mt-1 block text-[11px] text-slate-400">ERP & Punto de Venta</small>
      </span>
    </div>
  );
}

export function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const title = location.pathname.startsWith('/dashboard')
    ? 'Dashboard y Reportes'
    : location.pathname.startsWith('/pos') ? 'Punto de Venta' : 'Historial de Ventas';

  async function handleLogout() {
    try {
      await logout();
      toast.success('Sesión cerrada correctamente.');
    } catch {
      toast.warning('Se cerró la sesión local, pero no se pudo confirmar con el servidor.');
    } finally {
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="app-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col md:flex">
        <Brand />
        <div className="px-3 py-4"><AppNavigation /></div>
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl bg-slate-800/80 p-3 text-xs">
            <p className="font-semibold text-white">VentasLite conectado</p>
            <p className="mt-1 text-slate-400">API Laravel + Sanctum</p>
            <p className="mt-2 flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sesión activa</p>
          </div>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="app-topbar sticky top-0 z-20 flex h-[4.5rem] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="app-icon-button md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <span className="text-[11px] uppercase tracking-wide text-indigo-600">{user?.role}</span>
            </div>
            <button className="logout-button" onClick={handleLogout} type="button">
              <LogOut size={16} /><span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-[4.5rem] z-30 border-b border-slate-200 bg-slate-950 p-3 shadow-xl md:hidden">
            <AppNavigation onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        )}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
