import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register-page',
  imports: [AuthLayoutComponent, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {}
