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
import { environment } from '../../../../environments/environment';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
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
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this._router.navigate(['/']);
  }

  private _storeSession(res: LoginResponse | RegisterResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token.accessToken);
    localStorage.setItem(REFRESH_KEY, res.token.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private _moveToSession(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
    if (user) sessionStorage.setItem(USER_KEY, user);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private _loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
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
