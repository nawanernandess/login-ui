import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import {
  PasswordFieldComponent,
  FieldError,
} from '../../../../shared/components/password-field/password-field.component';

@Component({
  selector: 'app-login-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    FormHeaderComponent,
    PasswordFieldComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authSvc = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
    ],
    keepSignedIn: [false],
  });

  readonly passwordErrors: FieldError[] = [
    { key: 'required', message: 'Senha é obrigatória' },
    { key: 'minlength', message: 'Mínimo de 8 caracteres' },
  ];

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    this._authSvc
      .login(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this._router.navigate(['/dashboard'], { replaceUrl: true });
        },
        error: (err: Error) => {
          this.serverError.set(
            err.message || 'Não foi possível entrar. Tente novamente.',
          );
        },
      });
  }
}
