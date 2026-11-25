export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token_type: 'Bearer';
  access_token: string;
  user: AuthUser;
}

export interface StoredSession {
  token: string;
  user: AuthUser;
}
