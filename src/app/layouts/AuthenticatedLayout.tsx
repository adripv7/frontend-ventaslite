import { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, Menu, Moon, ReceiptText, ShoppingCart, Sun, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../providers/AuthProvider';
import { reportsApi } from '../../features/dashboard/api/reportsApi';
import type { AssistantStatus } from '../../features/dashboard/types';
import { useTheme } from '../providers/ThemeProvider';
import './layout.css';

const navigation = [
  { to: '/dashboard', label: 'Dashboard y Reportes', permission: 'reports.view', icon: LayoutDashboard },
  { to: '/pos', label: 'Punto de Venta', permission: 'sales.create', icon: ShoppingCart },
  { to: '/sales', label: 'Historial de Ventas', permission: 'sales.view_all', alternatePermission: 'sales.view_own', icon: ReceiptText },
];

function AppNavigation({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
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
          title={collapsed ? label : undefined}
          aria-label={collapsed ? label : undefined}
        >
          <Icon aria-hidden="true" size={19} />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`brand-row flex h-[4.5rem] items-center gap-3 border-b border-white/10 px-5 ${collapsed ? 'brand-row-collapsed' : ''}`}>
      <span className="brand-mark brand-mark-small"><ShoppingCart size={19} /></span>
      {!collapsed && <span className="leading-tight">
        <strong className="block text-sm font-bold text-white">VentasLite</strong>
        <small className="mt-1 block text-[11px] text-slate-400">ERP & Punto de Venta</small>
      </span>}
    </div>
  );
}

function SidebarStatus({ aiStatus }: { aiStatus: AssistantStatus | null | false }) {
  const canViewReports = useAuth().user?.permissions.includes('reports.view') ?? false;
  return (
    <div className="rounded-xl bg-slate-800/80 p-3 text-xs">
      <p className="font-semibold text-white">VentasLite conectado</p>
      <p className="mt-1 text-slate-400">API Laravel + Sanctum</p>
      <p className="mt-2 flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Sesión activa</p>
      {canViewReports && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className={`flex items-center gap-1.5 font-medium ${aiStatus && aiStatus !== false && aiStatus.connected ? 'text-emerald-400' : 'text-rose-300'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${aiStatus && aiStatus !== false && aiStatus.connected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            IA {aiStatus === null ? 'verificando…' : aiStatus === false ? 'estado no disponible' : aiStatus.connected ? 'conectada' : 'desconectada'}
          </p>
          {aiStatus && aiStatus !== false && <><p className="mt-1 truncate text-[10px] text-slate-400">{aiStatus.provider} · {aiStatus.model || 'sin modelo'}</p><p className="mt-1 text-[10px] text-slate-300">Tokens este mes: {aiStatus.usage.total_tokens.toLocaleString('es-MX')}</p><p className="text-[10px] text-slate-400">Entrada {aiStatus.usage.input_tokens.toLocaleString('es-MX')} · salida {aiStatus.usage.output_tokens.toLocaleString('es-MX')}</p></>}
        </div>
      )}
    </div>
  );
}

export function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [aiStatus, setAiStatus] = useState<AssistantStatus | null | false>(null);
  const title = location.pathname.startsWith('/dashboard')
    ? 'Dashboard y Reportes'
    : location.pathname.startsWith('/pos') ? 'Punto de Venta' : 'Historial de Ventas';

  useEffect(() => {
    if (!user?.permissions.includes('reports.view')) return;
    const controller = new AbortController();
    const refresh = () => reportsApi.assistantStatus(controller.signal).then(setAiStatus).catch(() => {
      if (!controller.signal.aborted) setAiStatus(false);
    });
    void refresh();
    const interval = window.setInterval(() => void refresh(), 90_000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [user?.permissions]);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

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
    <div className="app-shell min-h-screen bg-slate-50 text-slate-900">
      <aside className={`app-sidebar fixed inset-y-0 left-0 z-30 hidden flex-col md:flex ${desktopCollapsed ? 'app-sidebar-collapsed w-[4.75rem]' : 'w-64'}`}>
        <Brand collapsed={desktopCollapsed} />
        <div className={`py-4 ${desktopCollapsed ? 'px-2' : 'px-3'}`}><AppNavigation collapsed={desktopCollapsed} /></div>
        <div className={`mt-auto border-t border-white/10 ${desktopCollapsed ? 'p-2' : 'p-4'}`}>{desktopCollapsed ? <span className="sidebar-health-dot" title="API y sesión activas" /> : <SidebarStatus aiStatus={aiStatus} />}</div>
      </aside>

      <div className={desktopCollapsed ? 'md:pl-[4.75rem]' : 'md:pl-64'}>
        <header className="app-topbar sticky top-0 z-20 flex h-[4.5rem] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-expanded={window.matchMedia('(min-width: 768px)').matches ? !desktopCollapsed : mobileMenuOpen}
              aria-label={window.matchMedia('(min-width: 768px)').matches ? (desktopCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral') : (mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú')}
              className="app-icon-button"
              onClick={() => {
                if (window.matchMedia('(min-width: 768px)').matches) setDesktopCollapsed((collapsed) => !collapsed);
                else setMobileMenuOpen((open) => !open);
              }}
              type="button"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h1>
          </div>
          <div className="topbar-actions flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="topbar-user min-w-0 text-right">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
              <span className="topbar-role text-[10px] uppercase tracking-wide text-indigo-600">{user?.role}</span>
            </div>
            <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`} title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`} aria-pressed={theme === 'dark'}>
              <span className="theme-toggle-icon">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</span>
              <span className="theme-toggle-label">{theme === 'light' ? 'Oscuro' : 'Claro'}</span>
            </button>
            <button className="logout-button" onClick={handleLogout} type="button">
              <LogOut size={16} /><span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {mobileMenuOpen && <><button aria-label="Cerrar menú" className="mobile-nav-backdrop md:hidden" onClick={() => setMobileMenuOpen(false)} type="button" /><aside aria-label="Menú de navegación" className="mobile-nav-drawer md:hidden"><div className="flex items-center justify-between border-b border-white/10 pr-3"><Brand /><button aria-label="Cerrar menú" className="app-icon-button" onClick={() => setMobileMenuOpen(false)} type="button"><X size={19} /></button></div><div className="px-3 py-4"><AppNavigation onNavigate={() => setMobileMenuOpen(false)} /></div><div className="mt-auto border-t border-white/10 p-4"><SidebarStatus aiStatus={aiStatus} /></div></aside></>}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
