import axios from 'axios';

interface ApiErrorBody {
  message?: string;
  retry_after_seconds?: number;
  errors?: Record<string, string[]>;
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  if (!error.response) {
    return 'No pudimos conectar con el servidor. Revisa que el backend esté disponible.';
  }

  const body = error.response.data;
  const validationMessage = body?.errors
    ? Object.values(body.errors).flat()[0]
    : undefined;

  if (error.response.status === 429) {
    const seconds = body?.retry_after_seconds;
    return seconds
      ? `Demasiados intentos. Vuelve a probar en ${seconds} segundos.`
      : body?.message || 'Demasiados intentos. Espera un momento y vuelve a probar.';
  }

  return validationMessage || body?.message || 'No fue posible iniciar sesión.';
}
