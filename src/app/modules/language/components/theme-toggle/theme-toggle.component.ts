import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService, AppTheme } from '../../../../core/services/theme.service';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';

const THEME_ICON_SUN = "url('assets/icons/theme/sun.svg')";
const THEME_ICON_MOON = "url('assets/icons/theme/moon.svg')";
const THEME_ICON_SYSTEM = "url('assets/icons/theme/system.svg')";

interface ThemeOption {
  id: AppTheme;
  labelKey: string;
}

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="header-dropdown">
      <button
        type="button"
        class="header-icon-btn"
        [title]="currentLabelKey | translate"
        [attr.aria-label]="'ui.theme_panel' | translate"
        (click)="toggle($event)"
      >
        @if (theme === 'light') {
          <span class="header-icon-mask" [style.--icon]="sunIcon" aria-hidden="true"></span>
        } @else if (theme === 'dark') {
          <span class="header-icon-mask" [style.--icon]="moonIcon" aria-hidden="true"></span>
        } @else {
          <span class="header-icon-mask" [style.--icon]="systemIcon" aria-hidden="true"></span>
        }
      </button>
      @if (open) {
        <div class="header-dropdown__menu header-dropdown__menu--align-right" role="menu" [attr.aria-label]="'ui.theme_panel' | translate">
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
                <span class="header-icon-mask menu-icon" [style.--icon]="systemIcon" aria-hidden="true"></span>
              }
              <span>{{ option.labelKey | translate }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .menu-icon {
        width: var(--app-header-icon-size-sm);
        height: var(--app-header-icon-size-sm);
      }
    `,
  ],
})
export class ThemeToggleComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly sunIcon = THEME_ICON_SUN;
  readonly moonIcon = THEME_ICON_MOON;
  readonly systemIcon = THEME_ICON_SYSTEM;
  open = false;

  readonly options: ThemeOption[] = [
    { id: 'light', labelKey: 'ui.theme_light' },
    { id: 'system', labelKey: 'ui.theme_system' },
    { id: 'dark', labelKey: 'ui.theme_dark' },
  ];

  theme: AppTheme = 'system';

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly themeService = inject(ThemeService);
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly popoverId = HEADER_POPOVER_IDS.theme;
  private popoverSubscription?: Subscription;

  constructor() {
    this.theme = this.themeService.preference;
  }

  ngOnInit(): void {
    this.popoverSubscription = this.headerPopover.activeId$.subscribe((id) => {
      this.open = id === this.popoverId;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.popoverSubscription?.unsubscribe();
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  close(): void {
    this.headerPopover.close(this.popoverId);
  }

  get currentLabelKey(): string {
    return this.options.find((o) => o.id === this.theme)?.labelKey ?? 'ui.theme_panel';
  }

  setTheme(theme: AppTheme): void {
    this.theme = theme;
    this.themeService.setTheme(theme);
    this.close();
  }
}
