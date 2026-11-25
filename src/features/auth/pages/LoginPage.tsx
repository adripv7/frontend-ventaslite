import { ShoppingCart } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <main className="login-page">
      <section aria-labelledby="login-title" className="login-card">
        <div className="mb-1 flex flex-col items-center text-center">
          <div className="brand-mark mb-4" aria-hidden="true">
            <ShoppingCart size={25} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950" id="login-title">
            VentasLite
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sistema Interno de Ventas y Reportes</p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
