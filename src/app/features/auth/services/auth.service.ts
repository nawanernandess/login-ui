import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(request: AuthRequest): void {
    // TODO: implement API call
    console.log('Login:', request);
  }

  register(request: AuthRequest): void {
    // TODO: implement API call
    console.log('Register:', request);
  }

  forgotPassword(email: string): void {
    // TODO: implement API call
    console.log('ForgotPassword:', email);
  }
}
