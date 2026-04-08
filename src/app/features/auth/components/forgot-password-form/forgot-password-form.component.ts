import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';

@Component({
  selector: 'app-forgot-password-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormHeaderComponent,
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordFormComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authSvc = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly emailSent = signal(false);

  readonly form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    this._authSvc
      .forgotPassword(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => this.emailSent.set(true),
        error: (err: Error) => {
          this.serverError.set(
            err.message || 'N\u00e3o foi poss\u00edvel enviar o e-mail. Tente novamente.',
          );
        },
      });
  }
}

