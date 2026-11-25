import type { StoredSession } from '../types';

const SESSION_KEY = 'ventaslite.session';

export function readStoredSession(): StoredSession | null {
  try {
    const serialized = sessionStorage.getItem(SESSION_KEY);
    if (!serialized) return null;

    const value: unknown = JSON.parse(serialized);
    if (
      typeof value !== 'object' || value === null ||
      !('token' in value) || typeof value.token !== 'string' ||
      !('user' in value) || typeof value.user !== 'object' || value.user === null
    ) {
      clearStoredSession();
      return null;
    }

    return value as StoredSession;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function saveSession(session: StoredSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
