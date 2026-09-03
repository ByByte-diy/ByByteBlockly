import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { I18nService } from '../../i18n.service';
import { LanguageInfo, SupportedLanguageCode } from '../../types/lang.type';

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
export class LangSwitcherComponent implements OnInit, OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  readonly planetIcon = PLANET_ICON;
  open = false;
  protected languages: readonly LanguageInfo[] = [];
  protected current: SupportedLanguageCode = 'en';
  protected currentLang: LanguageInfo | undefined;

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

  ngOnInit(): void {
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

  ngOnDestroy(): void {
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
