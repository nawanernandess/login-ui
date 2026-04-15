import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { startWith, Subject, switchMap, timer } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-auth-layout',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  protected readonly themeSvc = inject(ThemeService);

  readonly activeSlide = signal(0);

  readonly slides = [
    { image: 'assets/images/metanoia-description.jpg', alt: 'Metanoia' },
    { image: 'assets/images/metanoia-fish.png', alt: 'Metanoia Fish' },
    { image: 'assets/images/metanoia-heart.jpg', alt: 'Metanoia Heart' },
  ] as const;

  private static readonly CAROUSEL_INTERVAL_MS = 4500;
  private readonly _restart$ = new Subject<void>();

  constructor() {
    this._restart$
      .pipe(
        startWith(undefined),
        switchMap(() =>
          timer(
            AuthLayoutComponent.CAROUSEL_INTERVAL_MS,
            AuthLayoutComponent.CAROUSEL_INTERVAL_MS,
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.activeSlide.update((v) => (v + 1) % this.slides.length);
      });
  }

  setSlide(index: number): void {
    this.activeSlide.set(index);
    this._restart$.next();
  }
}
