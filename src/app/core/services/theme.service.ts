import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type AppTheme = 'light' | 'dark' | 'system';
export type ResolvedAppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'app-theme';
  private readonly resolvedThemeSubject = new Subject<ResolvedAppTheme>();
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private currentPreference: AppTheme = 'system';
  private resolvedTheme: ResolvedAppTheme = 'light';

  /** Emits whenever the effective light/dark theme changes. */
  readonly onResolvedThemeChange = this.resolvedThemeSubject.asObservable();

  initialize(): void {
    const saved = localStorage.getItem(this.storageKey) as AppTheme | null;
    this.currentPreference =
      saved === 'light' || saved === 'dark' || saved === 'system'
        ? saved
        : 'system';

    this.mediaQuery.addEventListener('change', () => {
      if (this.currentPreference === 'system') {
        this.applyResolvedTheme(this.resolveTheme('system'));
      }
    });

    this.applyPreference(this.currentPreference);
  }

  get preference(): AppTheme {
    return this.currentPreference;
  }

  get currentResolvedTheme(): ResolvedAppTheme {
    return this.resolvedTheme;
  }

  setTheme(theme: AppTheme): void {
    this.currentPreference = theme;
    localStorage.setItem(this.storageKey, theme);
    this.applyPreference(theme);
  }

  toggle(): void {
    const resolved = this.resolveTheme(this.currentPreference);
    this.setTheme(resolved === 'dark' ? 'light' : 'dark');
  }

  private applyPreference(theme: AppTheme): void {
    document.documentElement.dataset.theme = theme;
    this.applyResolvedTheme(this.resolveTheme(theme));
  }

  private resolveTheme(theme: AppTheme): ResolvedAppTheme {
    if (theme === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return theme;
  }

  private applyResolvedTheme(resolved: ResolvedAppTheme): void {
    if (this.resolvedTheme === resolved) {
      document.documentElement.dataset.themeResolved = resolved;
      return;
    }
    this.resolvedTheme = resolved;
    document.documentElement.dataset.themeResolved = resolved;
    this.resolvedThemeSubject.next(resolved);
  }
}
