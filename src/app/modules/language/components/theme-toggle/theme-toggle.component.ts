import {
  Component,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ThemeService, AppTheme } from '../../../../core/services/theme.service';

const THEME_ICON_SUN = "url('assets/icons/theme/sun.svg')";
const THEME_ICON_MOON = "url('assets/icons/theme/moon.svg')";

interface ThemeOption {
  id: AppTheme;
  label: string;
}

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="header-dropdown">
      <button
        type="button"
        class="header-icon-btn"
        [title]="currentLabel"
        aria-label="Theme"
        (click)="toggle($event)"
      >
        @if (theme === 'light') {
          <span class="header-icon-mask" [style.--icon]="sunIcon" aria-hidden="true"></span>
        } @else if (theme === 'dark') {
          <span class="header-icon-mask" [style.--icon]="moonIcon" aria-hidden="true"></span>
        } @else {
          <span class="icon-split" aria-hidden="true">
            <span class="header-icon-mask icon-split__left" [style.--icon]="sunIcon"></span>
            <span class="header-icon-mask icon-split__right" [style.--icon]="moonIcon"></span>
          </span>
        }
      </button>
      @if (open) {
        <div class="header-dropdown__menu header-dropdown__menu--align-right" role="menu" aria-label="Theme">
          @for (option of options; track option.id) {
            <button
              type="button"
              class="header-menu-item"
              [class.header-menu-item--active]="theme === option.id"
              (click)="setTheme(option.id)"
            >
              <span class="header-menu-item__check">{{ theme === option.id ? '✓' : '' }}</span>
              @if (option.id === 'light') {
                <span class="header-icon-mask menu-icon" [style.--icon]="sunIcon" aria-hidden="true"></span>
              } @else if (option.id === 'dark') {
                <span class="header-icon-mask menu-icon" [style.--icon]="moonIcon" aria-hidden="true"></span>
              } @else {
                <span class="icon-split menu-icon" aria-hidden="true">
                  <span class="header-icon-mask icon-split__left" [style.--icon]="sunIcon"></span>
                  <span class="header-icon-mask icon-split__right" [style.--icon]="moonIcon"></span>
                </span>
              }
              <span>{{ option.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .icon-split {
        display: inline-flex;
        width: var(--app-header-icon-size);
        height: var(--app-header-icon-size);
        overflow: hidden;
      }

      .icon-split__left,
      .icon-split__right {
        width: calc(var(--app-header-icon-size) / 2);
        height: var(--app-header-icon-size);
        flex: 0 0 calc(var(--app-header-icon-size) / 2);
        -webkit-mask-size: var(--app-header-icon-size) var(--app-header-icon-size);
        mask-size: var(--app-header-icon-size) var(--app-header-icon-size);
      }

      .icon-split__left {
        -webkit-mask-position: 0 center;
        mask-position: 0 center;
      }

      .icon-split__right {
        -webkit-mask-position: calc(var(--app-header-icon-size) / -2) center;
        mask-position: calc(var(--app-header-icon-size) / -2) center;
      }

      .menu-icon {
        width: var(--app-header-icon-size-sm);
        height: var(--app-header-icon-size-sm);
      }
    `,
  ],
})
export class ThemeToggleComponent {
  readonly sunIcon = THEME_ICON_SUN;
  readonly moonIcon = THEME_ICON_MOON;
  open = false;

  readonly options: ThemeOption[] = [
    { id: 'light', label: 'Light' },
    { id: 'system', label: 'System' },
    { id: 'dark', label: 'Dark' },
  ];

  theme: AppTheme = 'system';

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.theme = this.themeService.preference;
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open = !this.open;
    this.cdr.detectChanges();
  }

  close(): void {
    this.open = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  get currentLabel(): string {
    return this.options.find((o) => o.id === this.theme)?.label || 'Theme';
  }

  setTheme(theme: AppTheme): void {
    this.theme = theme;
    this.themeService.setTheme(theme);
    this.close();
  }
}
