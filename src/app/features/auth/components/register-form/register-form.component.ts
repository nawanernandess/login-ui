import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
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
import {
  PasswordFieldComponent,
  FieldError,
} from '../../../../shared/components/password-field/password-field.component';

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
    birthDate: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[\d\s()+-]{10,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    confirmPassword: ['', [Validators.required, RegisterFormComponent.matchPasswordValidator]],
  });

  readonly passwordErrors: FieldError[] = [
    { key: 'required', message: 'Senha \u00e9 obrigat\u00f3ria' },
    { key: 'minlength', message: 'M\u00ednimo de 8 caracteres' },
  ];

  readonly confirmPasswordErrors: FieldError[] = [
    { key: 'required', message: 'Confirme sua senha' },
    { key: 'passwordMismatch', message: 'As senhas n\u00e3o coincidem' },
  ];

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

  static matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    return password && password.value !== control.value ? { passwordMismatch: true } : null;
  }
}


