import { LogOut, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../../app/providers/AuthProvider';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success('Sesión cerrada.');
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="brand-mark brand-mark-small"><ShoppingCart size={19} /></span>
          <span className="font-bold text-slate-900">VentasLite</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <button className="logout-button" onClick={handleLogout} type="button">
            <LogOut size={16} /> <span>Salir</span>
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Sesión validada</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Bienvenido, {user?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          La conexión con Laravel y Sanctum está lista. Continuaremos con el dashboard y los módulos del prototipo paso a paso.
        </p>
      </section>
    </main>
  );
}
