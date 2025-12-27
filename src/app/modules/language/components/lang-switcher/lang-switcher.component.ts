import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { I18nService } from '../../i18n.service';
import { LanguageInfo, SupportedLanguageCode } from '../../types/lang.type';

/**
 * Language Selector Component
 * Dropdown for switching application language
 */
@Component({
  selector: "app-lang-switcher",
  template: `
    <select
      class="language-selector"
      (change)="onLanguageChange($event)"
      [value]="current"
      aria-label="Language selector"
    >
      <option *ngFor="let lang of languages" [value]="lang.code">
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  `,
  styleUrls: ["./lang-switcher.component.scss"],
})
export class LangSwitcherComponent implements OnInit, OnDestroy {
  private readonly i18n: I18nService = inject(I18nService);
  private readonly destroy$ = new Subject<void>();
  protected languages: readonly LanguageInfo[] = [];
  protected current: SupportedLanguageCode = "en";

  ngOnInit(): void {
    this.current = this.i18n.getCurrentLanguage();
    this.languages = this.i18n.getSupportedLanguages();

    // Subscribe to language changes
    this.i18n
      .getCurrentLanguage$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.current = lang;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle language change from dropdown
   */
  async onLanguageChange(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    await this.i18n.setLanguage(select.value as SupportedLanguageCode);
  }
}

