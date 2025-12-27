import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import { SUPPORTED_LANGUAGES } from "./i18n.const";
import { WorkspaceStorageService } from "../storage/workspace-storage.service";
import { BlocklyI18nService } from "./blockly-i18n.service";
import { LanguageInfo, SupportedLanguageCode } from "./types/lang.type";

/**
 * Main I18n Service - coordinates Angular and Blockly translations
 * Angular UI → ngx-translate
 * Blockly blocks/categories → BlocklyI18nService
 */
@Injectable({
  providedIn: "root",
})
export class I18nService {
  private currentLang$ = new BehaviorSubject<SupportedLanguageCode>("en");
  private initialized = false;

  constructor(
    private translate: TranslateService,
    private blocklyI18n: BlocklyI18nService,
    private storage: WorkspaceStorageService
  ) {
    // Configure ngx-translate
    this.translate.addLangs(Object.keys(SUPPORTED_LANGUAGES));
    this.translate.setFallbackLang("en");
  }

  /**
   * Initialize i18n system
   * Loads saved language or detects browser language
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      // Load saved language from storage
      const settings = await this.storage.loadSettings();
      let language = settings?.language || this.detectSystemLanguage();

      // Set language (loads both Angular and Blockly translations)
      await this.setLanguage(language);
      this.initialized = true;
    } catch (error) {
      console.error("❌ Error initializing i18n:", error);
      // Fallback to English
      await this.setLanguage("en");
      this.initialized = true;
    }
  }

  /**
   * Set active language for BOTH Angular UI and Blockly
   * @param langCode Language code (en, uk, etc.)
   */
  async setLanguage(langCode: SupportedLanguageCode): Promise<void> {
    // Validate language code - check if available in ngx-translate
    const availableLangs = this.translate.getLangs();
    if (!availableLangs.includes(langCode)) {
      console.warn(`Language ${langCode} not available, falling back to English`); // prettier-ignore
      langCode = "en";
    }

    // Always reload translations even if language is the same
    // This ensures translations are applied correctly after module caching

    try {
      // 1. Load Angular UI translations (ngx-translate)
      await firstValueFrom(this.translate.use(langCode));

      // 2. Load Blockly translations (Blockly.Msg)
      await this.blocklyI18n.load(langCode);

      // 3. Update current language
      this.currentLang$.next(langCode);

      // 4. Dispatch event for workspace to reload
      window.dispatchEvent(
        new CustomEvent("language-changed", {
          detail: { language: langCode },
        })
      );

      // 5. Save to storage
      await this.storage.saveSettings({ language: langCode });

      // 6. Update HTML lang attribute
      document.documentElement.lang = langCode;
      document.documentElement.dir = SUPPORTED_LANGUAGES[langCode].rtl ? 'rtl' : 'ltr';
    } catch (error) {
      console.error(`❌ Error setting language to ${langCode}:`, error);
      throw error;
    }
  }

  /**
   * Get current language code
   */
  getCurrentLanguage(): SupportedLanguageCode {
    return this.currentLang$.value;
  }

  /**
   * Get current language as observable
   */
  getCurrentLanguage$(): Observable<SupportedLanguageCode> {
    return this.currentLang$.asObservable();
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): readonly LanguageInfo[] {
    return Object.values(SUPPORTED_LANGUAGES);
  }

  /**
   * Detect browser language using ngx-translate API
   */
  private detectSystemLanguage(): SupportedLanguageCode {
    const browserLang = this.translate.getBrowserLang();
    const availableLangs = this.translate.getLangs();

    // Check if browser language is available in ngx-translate
    if (browserLang && availableLangs.includes(browserLang)) {
      return browserLang as SupportedLanguageCode;
    }
    return "en";
  }
}
