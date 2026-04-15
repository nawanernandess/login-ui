import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleSsoService } from '../../services/google-sso.service';
import { GoogleCredentialResponse } from '../../models/auth.models';

@Component({
  selector: 'app-google-sso-button',
  templateUrl: './google-sso-button.component.html',
  styleUrl: './google-sso-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleSsoButtonComponent {
  private readonly _googleSso = inject(GoogleSsoService);

  readonly credentialReceived = output<GoogleCredentialResponse>();
  readonly error = output<string>();
  readonly loaded = signal(false);

  constructor() {
    this._googleSso
      .initialize()
      .pipe(takeUntilDestroyed())
      .subscribe((success) => {
        if (success) {
          this.loaded.set(true);
        } else {
          this.error.emit('Não foi possível carregar o Google Sign-In.');
        }
      });

    this._googleSso
      .credential$()
      .pipe(takeUntilDestroyed())
      .subscribe((response) => this.credentialReceived.emit(response));
  }

  onSignIn(): void {
    if (!this.loaded()) return;
    this._googleSso.prompt();
  }
}
