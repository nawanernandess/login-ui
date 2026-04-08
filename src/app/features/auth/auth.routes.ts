import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    title: 'Metanoia — Entrar',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    title: 'Metanoia — Criar Conta',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'forgot-password',
    title: 'Metanoia — Recuperar Senha',
    loadComponent: () =>
      import('./pages/forgot-password-page/forgot-password-page.component').then(
        (m) => m.ForgotPasswordPageComponent
      ),
  },
];
