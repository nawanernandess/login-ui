import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../models/auth.models';
import { AUTH_REFRESH_KEY, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/auth.constants';
import { StorageService } from '../../../core/services/storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _storage = inject(StorageService);
  private readonly _apiUrl = environment.apiUrl;

  readonly currentUser = signal<User | null>(this._loadUser());

  login(request: LoginRequest): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this._apiUrl}/auth/login`, request).pipe(
      tap((res) => {
        this._storeSession(res);
        if (!request.keepSignedIn) {
          this._moveToSession();
        }
      }),
      catchError(this._handleError),
    );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this._http.post<RegisterResponse>(`${this._apiUrl}/auth/register`, request).pipe(
      tap((res) => this._storeSession(res)),
      catchError(this._handleError),
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this._http
      .post<ForgotPasswordResponse>(`${this._apiUrl}/auth/forgot-password`, request)
      .pipe(catchError(this._handleError));
  }

  loginWithGoogle(credential: string): Observable<LoginResponse> {
    const request: GoogleLoginRequest = { credential };
    return this._http.post<LoginResponse>(`${this._apiUrl}/auth/google`, request).pipe(
      tap((res) => this._storeSession(res)),
      catchError(this._handleError),
    );
  }

  getToken(): string | null {
    return this._storage.get(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this._storage.remove(AUTH_TOKEN_KEY, AUTH_REFRESH_KEY, AUTH_USER_KEY);
    this.currentUser.set(null);
    this._router.navigate(['/']);
  }

  private _storeSession(res: LoginResponse | RegisterResponse): void {
    this._storage.set(AUTH_TOKEN_KEY, res.token.accessToken);
    this._storage.set(AUTH_REFRESH_KEY, res.token.refreshToken);
    this._storage.set(AUTH_USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private _moveToSession(): void {
    this._storage.moveToSession(AUTH_TOKEN_KEY, AUTH_REFRESH_KEY, AUTH_USER_KEY);
  }

  private _loadUser(): User | null {
    const raw = this._storage.get(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private _handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message || 'Ocorreu um erro inesperado. Tente novamente.';
    return throwError(() => new Error(message));
  }
}
