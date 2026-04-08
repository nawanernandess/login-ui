import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _doc = inject(DOCUMENT);
  private readonly _themeKey = 'app-theme';

  readonly isDark = signal(this._loadTheme());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      localStorage.setItem(this._themeKey, dark ? 'dark' : 'light');
      this._doc.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    });
  }

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  private _loadTheme(): boolean {
    try {
      return localStorage.getItem(this._themeKey) !== 'light';
    } catch {
      return true;
    }
  }
}
