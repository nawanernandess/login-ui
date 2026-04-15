import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, ReplaySubject, Subject, take } from 'rxjs';
import { GoogleCredentialResponse } from '../models/auth.models';
import { environment } from '../../../../environments/environment';

declare const google: {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }): void;
      prompt(): void;
      revoke(hint: string, callback: () => void): void;
    };
  };
};

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const SCRIPT_ID = 'google-gsi-script';

@Injectable({ providedIn: 'root' })
export class GoogleSsoService {
  private readonly _zone = inject(NgZone);
  private readonly _clientId = environment.googleClientId;

  private readonly _scriptLoaded$ = new ReplaySubject<boolean>(1);
  private _initialized = false;

  private readonly _credential$ = new Subject<GoogleCredentialResponse>();

  initialize(): Observable<boolean> {
    if (!this._initialized) {
      this._loadScript();
    }
    return this._scriptLoaded$.pipe(take(1));
  }

  credential$(): Observable<GoogleCredentialResponse> {
    return this._credential$.asObservable();
  }

  prompt(): void {
    this._scriptLoaded$.pipe(take(1)).subscribe((loaded) => {
      if (loaded) google.accounts.id.prompt();
    });
  }

  revoke(email: string): Observable<void> {
    return new Observable((observer) => {
      google.accounts.id.revoke(email, () => {
        observer.next();
        observer.complete();
      });
    });
  }

  private _loadScript(): void {
    this._initialized = true;

    if (document.getElementById(SCRIPT_ID)) {
      this._initializeGsi();
      this._scriptLoaded$.next(true);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this._initializeGsi();
      this._scriptLoaded$.next(true);
    };

    script.onerror = () => {
      document.getElementById(SCRIPT_ID)?.remove();
      this._initialized = false;
      this._scriptLoaded$.next(false);
    };

    document.head.appendChild(script);
  }

  private _initializeGsi(): void {
    google.accounts.id.initialize({
      client_id: this._clientId,
      callback: (response) => {
        this._zone.run(() => this._credential$.next(response));
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }
}
