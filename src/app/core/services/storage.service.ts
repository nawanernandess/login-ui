import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(...keys: string[]): void {
    for (const key of keys) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  }

  moveToSession(...keys: string[]): void {
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        sessionStorage.setItem(key, value);
      }
      localStorage.removeItem(key);
    }
  }
}
