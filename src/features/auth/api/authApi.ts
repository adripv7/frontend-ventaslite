import { http } from '../../../shared/api/http';
import type { AuthUser, LoginCredentials, LoginResponse } from '../types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/login', {
      ...credentials,
      device_name: 'ventaslite-react',
    });
    return data;
  },

  async me(): Promise<{ user: AuthUser }> {
    const { data } = await http.get<{ user: AuthUser }>('/user');
    return data;
  },

  async logout(): Promise<void> {
    await http.post('/logout');
  },
};
