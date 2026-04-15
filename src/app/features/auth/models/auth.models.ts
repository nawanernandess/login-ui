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

export interface LoginResponse {
  user: User;
  token: AuthToken;
}

export interface RegisterResponse {
  user: User;
  token: AuthToken;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId?: string;
}

