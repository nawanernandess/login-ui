import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);

  login(request: LoginRequest): Observable<LoginResponse> {
    // TODO: return this._http.post<LoginResponse>('/api/auth/login', request);
    const mock: LoginResponse = {
      user: { id: '1', name: 'Usu\u00e1rio', email: request.email },
      token: { accessToken: 'mock-token', refreshToken: 'mock-refresh', expiresIn: 3600 },
    };
    return of(mock).pipe(
      delay(800),
      tap((res) => console.log('[AuthService] login:', res)),
    );
  }

  register(request: RegisterRequest): Observable<void> {
    // TODO: return this._http.post<void>('/api/auth/register', request);
    return of(undefined).pipe(
      delay(800),
      tap(() => console.log('[AuthService] register:', request)),
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    // TODO: return this._http.post<void>('/api/auth/forgot-password', request);
    return of(undefined).pipe(
      delay(800),
      tap(() => console.log('[AuthService] forgotPassword:', request)),
    );
  }
}
