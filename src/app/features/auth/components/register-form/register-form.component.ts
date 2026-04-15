import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { FormHeaderComponent } from '../../../../shared/components/form-header/form-header.component';
import { PasswordFieldComponent } from '../../../../shared/components/password-field/password-field.component';
import {
  CONFIRM_PASSWORD_ERRORS,
  matchPasswordValidator,
  PASSWORD_ERRORS,
  passwordValidators,
} from '../../../../shared/validators/password.validators';

@Component({
  selector: 'app-register-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormHeaderComponent,
    PasswordFieldComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _authSvc = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly serverError = signal<string | null>(null);

  readonly form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: [''],
    phone: ['', [Validators.pattern(/^[\d\s()+-]{10,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', passwordValidators],
    confirmPassword: ['', [Validators.required, matchPasswordValidator]],
  });

  readonly passwordErrors = PASSWORD_ERRORS;
  readonly confirmPasswordErrors = CONFIRM_PASSWORD_ERRORS;

  constructor() {
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.form.controls.confirmPassword.updateValueAndValidity({ emitEvent: false })
      );
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const { confirmPassword, ...data } = this.form.getRawValue();

    this._authSvc
      .register(data)
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
            err.message || 'Não foi possível criar a conta. Tente novamente.',
          );
        },
      });
  }
}


