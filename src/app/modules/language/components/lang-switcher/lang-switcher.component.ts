import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { I18nService } from '../../i18n.service';
import { LanguageInfo, SupportedLanguageCode } from '../../types/lang.type';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';

const PLANET_ICON = "url('assets/icons/header/planet.svg')";

@Component({
  selector: 'app-lang-switcher',
  template: `
    <div class="header-dropdown">
      <button
        type="button"
        class="header-icon-btn"
        [title]="currentLang?.name || 'Language'"
        aria-label="Language"
        (click)="toggle($event)"
      >
        <span class="header-icon-mask" [style.--icon]="planetIcon" aria-hidden="true"></span>
      </button>
      @if (open) {
        <div class="header-dropdown__menu" role="menu" aria-label="Language">
          @for (lang of languages; track lang.code) {
            <button
              type="button"
              class="header-menu-item"
              [class.header-menu-item--active]="current === lang.code"
              (click)="selectLanguage(lang.code)"
            >
              <span class="header-menu-item__check">{{ current === lang.code ? '✓' : '' }}</span>
              <span>{{ lang.flag }} {{ lang.name }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class LangSwitcherComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly popoverId = HEADER_POPOVER_IDS.language;

  readonly planetIcon = PLANET_ICON;
  open = false;
  protected languages: readonly LanguageInfo[] = [];
  protected current: SupportedLanguageCode = 'en';
  protected currentLang: LanguageInfo | undefined;

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  close(): void {
    this.headerPopover.close(this.popoverId);
  }

  ngOnInit(): void {
    this.headerPopover.activeId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.open = id === this.popoverId;
      this.cdr.detectChanges();
    });

    this.current = this.i18n.getCurrentLanguage();
    this.languages = this.i18n.getSupportedLanguages();
    this.syncCurrentLang();

    this.i18n
      .getCurrentLanguage$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.current = lang;
        this.syncCurrentLang();
      });
  }

  ngAfterViewInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.destroy$.next();
    this.destroy$.complete();
  }

  async selectLanguage(code: SupportedLanguageCode): Promise<void> {
    this.close();
    await this.i18n.setLanguage(code);
  }

  private syncCurrentLang(): void {
    this.currentLang = this.languages.find((l) => l.code === this.current);
  }
}
