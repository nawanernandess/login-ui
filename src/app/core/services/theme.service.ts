import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _themeKey = 'app-theme';

  readonly isDark = signal(
    isPlatformBrowser(this._platformId)
      ? localStorage.getItem(this._themeKey) === 'dark'
      : false
  );

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this._platformId)) {
        localStorage.setItem(this._themeKey, this.isDark() ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    this.isDark.update((v) => !v);
  }
}
