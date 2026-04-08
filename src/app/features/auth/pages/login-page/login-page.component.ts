import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  imports: [AuthLayoutComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {}
