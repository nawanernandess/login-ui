export interface AuthRequest {
  email: string;
  password: string;
  keepSignedIn?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
