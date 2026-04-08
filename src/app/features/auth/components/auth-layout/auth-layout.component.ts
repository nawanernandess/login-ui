import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  private readonly _destroyRef = inject(DestroyRef);

  readonly activeSlide = signal(0);

  readonly slides = [
    { image: 'assets/images/metanoia-description.jpg', alt: 'Metanoia' },
    { image: 'assets/images/metanoia-fish.png', alt: 'Metanoia Fish' },
    { image: 'assets/images/metanoia-heart.jpg', alt: 'Metanoia Heart' },
  ] as const;

  private _intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this._startCarousel();
    this._destroyRef.onDestroy(() => this._stopCarousel());
  }

  setSlide(index: number): void {
    this._stopCarousel();
    this.activeSlide.set(index);
    this._startCarousel();
  }

  private _startCarousel(): void {
    this._intervalId = setInterval(() => {
      this.activeSlide.update((v) => (v + 1) % this.slides.length);
    }, 4500);
  }

  private _stopCarousel(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
}
