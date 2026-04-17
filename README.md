# Metanoia — Login

Interface de autenticação completa, responsiva e acessível, construída com Angular 19 seguindo as melhores práticas modernas do framework.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/Angular_Material-19.2-3f51b5?logo=angular&logoColor=white" alt="Angular Material"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white" alt="RxJS"/>
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white" alt="SCSS"/>
  <img src="https://img.shields.io/badge/JSON_Server-mock_API-brightgreen" alt="JSON Server"/>
  <img src="https://img.shields.io/badge/Google_SSO-Identity_Services-4285F4?logo=google&logoColor=white" alt="Google SSO"/>
</p>

## Preview

### Desktop

<p align="center">
  <img src="src/assets/images/preview-desktop.png" width="600"/>
  <img src="src/assets/images/preview-desktop-login.png" width="600"/>
</p>

### Mobile

<p align="center">
  <img src="src/assets/images/preview-mobile.png" width="220"/>
  <img src="src/assets/images/preview-mobile-login.png" width="220"/>
</p>

## Funcionalidades

- **Login** com e-mail e senha, opção "manter-me conectado" (localStorage vs sessionStorage)
- **Cadastro** com nome, data de nascimento, telefone, e-mail e senha com confirmação
- **Recuperação de senha** via e-mail
- **Autenticação SSO** com Google (Google Identity Services)
- **Dashboard** protegido, exibindo dados do usuário autenticado
- **Tema dark/light** com persistência no localStorage
- **Carousel** automático no painel hero com navegação por dots
- **Guards** de rota: `authGuard` (protege páginas autenticadas) e `guestGuard` (redireciona usuários logados)
- **Interceptor HTTP** que injeta o Bearer token em todas as requisições
- **Servidor mock** para desenvolvimento local (sem backend real)

## Padrões Angular 19

- Standalone components (sem NgModules)
- Signals (`signal`, `computed`, `effect`)
- `input()` / `output()` APIs
- `inject()` em vez de constructor injection
- `takeUntilDestroyed()` para gerenciamento de subscriptions
- `ChangeDetectionStrategy.OnPush` em todos os componentes
- Functional guards e interceptors
- Lazy loading em todas as rotas
- `NonNullableFormBuilder` com reactive forms

## Como usar

### Credenciais de teste (mock)

| E-mail | Senha |
|---|---|
| `teste@metanoia.com` | `12345678` |
| `novo@test.com` | `12345678` |

### Google SSO

Para habilitar o botão "Entrar com o Google", configure o Client ID em `src/environments/environment.ts`:

```ts
export const environment = {
  googleClientId: 'SEU_CLIENT_ID.apps.googleusercontent.com',
};
```

Gere o Client ID em: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

## Estrutura do Projeto

```
mock/
├── db.json          # dados do servidor mock (usuários, etc.)
└── server.js        # configuração do JSON Server
src/
└── app/
    ├── core/
    │   ├── guards/          # authGuard, guestGuard
    │   ├── interceptors/    # auth interceptor (Bearer token)
    │   └── services/        # StorageService, ThemeService
    ├── features/
    │   ├── auth/
    │   │   ├── components/  # login-form, register-form, forgot-password-form,
    │   │   │                #   google-sso-button, auth-layout
    │   │   ├── constants/
    │   │   ├── models/
    │   │   ├── pages/       # login-page, register-page, forgot-password-page
    │   │   └── services/    # AuthService, GoogleSsoService
    │   └── dashboard/
    └── shared/
        ├── components/      # form-header, password-field
        └── validators/      # password validators
```

## Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- [npm](https://npmjs.com) 10+

### Instalação

```bash
npm install
```

### Rodar o servidor mock (API local)

```bash
npm run mock:server
```

> Inicia o servidor em `http://localhost:3000`

### Rodar a aplicação Angular

```bash
npm start
```

> Abre em `http://localhost:4200`

### Rodar os dois juntos (Windows)

```bash
npm run start:full
```

### Build de produção

```bash
npm run build
```