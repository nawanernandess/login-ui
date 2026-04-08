import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { startWith, switchMap } from 'rxjs';

export interface FieldError {
  key: string;
  message: string;
}

@Component({
  selector: 'app-password-field',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFieldComponent {
  readonly control = input.required<FormControl<string>>();
  readonly label = input('Senha');
  readonly placeholder = input('Sua senha');
  readonly errors = input<FieldError[]>([]);

  readonly hide = signal(true);

  private readonly _status = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.statusChanges.pipe(startWith(ctrl.status)))
    ),
    { initialValue: 'VALID' }
  );

  readonly currentError = computed(() => {
    this._status();
    const ctrl = this.control();
    return this.errors().find((e) => ctrl.hasError(e.key)) ?? null;
  });

  toggle(): void {
    this.hide.update((v) => !v);
  }
}
