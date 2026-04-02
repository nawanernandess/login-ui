import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  readonly hidePassword = signal(true);
  readonly activeSlide = signal(0);
  readonly isDark = signal(true);

  readonly slides = [
    { image: 'assets/images/metanoia-description.jpg', alt: 'Metanoia' },
    { image: 'assets/images/metanoia-fish.png', alt: 'Metanoia Fish' },
    { image: 'assets/images/metanoia-heart.jpg', alt: 'Metanoia Heart' },
  ];

  loginForm: FormGroup;

  private carouselInterval: ReturnType<typeof setInterval> | null = null;
  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      keepSignedIn: [false],
    });
  }

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

  togglePasswordVisibility(): void {
    this.hidePassword.update((v) => !v);
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
  }

  setSlide(index: number): void {
    this.stopCarousel();
    this.activeSlide.set(index);
    this.startCarousel();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('Login válido:', this.loginForm.value);
  }
}
