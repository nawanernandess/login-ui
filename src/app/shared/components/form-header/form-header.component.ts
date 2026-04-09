import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-header',
  template: `
    <div class="form-brand">{{ brand() }}</div>
    <h2 class="form-title">{{ title() }}</h2>
    <p class="form-subtitle">{{ subtitle() }}</p>
  `,
  styles: `
    :host {
      display: contents;
    }

    .form-brand {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 0.4rem;
    }

    .form-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0 0 0.5rem;
      transition: color 0.4s ease;
    }

    .form-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 var(--form-subtitle-mb, 2rem);
    }

    @media (max-width: 767px) {
      .form-title {
        font-size: 1.55rem;
      }
    }

    @media (max-width: 479px) {
      .form-brand {
        font-size: 0.95rem;
        margin-bottom: 0.3rem;
      }

      .form-title {
        font-size: 1.4rem;
      }

      .form-subtitle {
        font-size: 0.825rem;
        margin-bottom: var(--form-subtitle-mb, 1.5rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormHeaderComponent {
  readonly brand = input('Metanoia');
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}
