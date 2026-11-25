import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../app/providers/AuthProvider';
import { getApiErrorMessage } from '../utils/apiError';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      toast.success('Sesión iniciada correctamente.');
    } catch (error) {
      const message = getApiErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-800">
          Correo electrónico
        </label>
        <div className="login-input-wrap">
          <Mail aria-hidden="true" className="login-input-icon" size={19} />
          <input
            autoComplete="username"
            autoFocus
            className="login-input"
            id="email"
            maxLength={255}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@ventaslite.test"
            required
            type="email"
            value={email}
            aria-invalid={Boolean(errorMessage)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-800">
          Contraseña
        </label>
        <div className="login-input-wrap">
          <LockKeyhole aria-hidden="true" className="login-input-icon" size={19} />
          <input
            autoComplete="current-password"
            className="login-input pr-11"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            aria-invalid={Boolean(errorMessage)}
          />
          <button
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-3 grid place-items-center text-slate-400 transition hover:text-indigo-600"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700" role="alert">
          {errorMessage}
        </p>
      )}

      <button className="login-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <><LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> Validando acceso...</>
        ) : 'Iniciar sesión'}
      </button>
    </form>
  );
}
