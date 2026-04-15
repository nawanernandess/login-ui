import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FieldError } from '../components/password-field/password-field.component';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 16;

export const passwordValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(PASSWORD_MIN_LENGTH),
  Validators.maxLength(PASSWORD_MAX_LENGTH),
];

export const PASSWORD_ERRORS: FieldError[] = [
  { key: 'required', message: 'Senha é obrigatória' },
  { key: 'minlength', message: `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres` },
  { key: 'maxlength', message: `Máximo de ${PASSWORD_MAX_LENGTH} caracteres` },
];

export const CONFIRM_PASSWORD_ERRORS: FieldError[] = [
  { key: 'required', message: 'Confirme sua senha' },
  { key: 'passwordMismatch', message: 'As senhas não coincidem' },
];

export function matchPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password');
  return password && password.value !== control.value ? { passwordMismatch: true } : null;
}
