import { Component } from '@angular/core';
import { ThemeService, AppTheme } from '../../../../core/services/theme.service';

const THEME_ICON_SUN = "url('assets/icons/theme/sun.svg')";
const THEME_ICON_MOON = "url('assets/icons/theme/moon.svg')";

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        class="theme-btn"
        [class.active]="theme === 'light'"
        (click)="setTheme('light')"
        title="Light theme"
      >
        <span
          class="icon-mask"
          [style.--icon]="sunIcon"
          aria-hidden="true"
        ></span>
      </button>
      <button
        type="button"
        class="theme-btn"
        [class.active]="theme === 'system'"
        (click)="setTheme('system')"
        title="System theme"
      >
        <span class="icon-split" aria-hidden="true">
          <span class="icon-mask icon-split__left" [style.--icon]="sunIcon"></span>
          <span class="icon-mask icon-split__right" [style.--icon]="moonIcon"></span>
        </span>
      </button>
      <button
        type="button"
        class="theme-btn"
        [class.active]="theme === 'dark'"
        (click)="setTheme('dark')"
        title="Dark theme"
      >
        <span
          class="icon-mask"
          [style.--icon]="moonIcon"
          aria-hidden="true"
        ></span>
      </button>
    </div>
  `,
  styles: [
    `
      .theme-toggle {
        display: inline-flex;
        border: 1px solid var(--app-border);
        border-radius: 6px;
        overflow: hidden;
      }

      .theme-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: var(--app-surface);
        color: var(--app-text-muted);
        width: 32px;
        height: 28px;
        padding: 0;
        cursor: pointer;
        line-height: 1;
      }

      .theme-btn:hover {
        background: var(--toolbox-bg);
      }

      .theme-btn.active {
        background: var(--toolbox-bg);
        color: var(--app-text);
      }

      .icon-mask {
        width: 16px;
        height: 16px;
        display: inline-block;
        background-color: currentColor;
        -webkit-mask: var(--icon) no-repeat center / contain;
        mask: var(--icon) no-repeat center / contain;
      }

      /* System: sun + moon halves (ByByteSite has no separate system SVG) */
      .icon-split {
        display: inline-flex;
        width: 16px;
        height: 16px;
        overflow: hidden;
      }

      .icon-split__left,
      .icon-split__right {
        width: 8px;
        height: 16px;
        flex: 0 0 8px;
        -webkit-mask-size: 16px 16px;
        mask-size: 16px 16px;
      }

      .icon-split__left {
        -webkit-mask-position: 0 center;
        mask-position: 0 center;
      }

      .icon-split__right {
        -webkit-mask-position: -8px center;
        mask-position: -8px center;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  readonly sunIcon = THEME_ICON_SUN;
  readonly moonIcon = THEME_ICON_MOON;

  theme: AppTheme = 'system';

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.preference;
  }

  setTheme(theme: AppTheme): void {
    this.theme = theme;
    this.themeService.setTheme(theme);
  }
}
