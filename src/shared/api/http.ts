import axios from 'axios';
import { readStoredSession } from '../../features/auth/api/authStorage';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 20_000,
});

http.interceptors.request.use((config) => {
  const session = readStoredSession();
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});
