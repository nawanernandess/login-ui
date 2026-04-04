import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-auth-layout',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  readonly themeSvc = inject(ThemeService);
  readonly activeSlide = signal(0);

  readonly slides = [
    { image: 'assets/images/metanoia-description.jpg', alt: 'Metanoia' },
    { image: 'assets/images/metanoia-fish.png', alt: 'Metanoia Fish' },
    { image: 'assets/images/metanoia-heart.jpg', alt: 'Metanoia Heart' },
  ];

  private carouselInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  private startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.activeSlide.update((v) => (v + 1) % this.slides.length);
    }, 4500);
  }

  private stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  setSlide(index: number): void {
    this.stopCarousel();
    this.activeSlide.set(index);
    this.startCarousel();
  }
}
