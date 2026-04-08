import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password-page',
  imports: [AuthLayoutComponent, ForgotPasswordFormComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {}
