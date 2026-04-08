// ─── Requests ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
  keepSignedIn: boolean;
}

export interface RegisterRequest {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// ─── Entities ────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Responses ───────────────────────────────────────────────

export interface LoginResponse {
  user: User;
  token: AuthToken;
}

