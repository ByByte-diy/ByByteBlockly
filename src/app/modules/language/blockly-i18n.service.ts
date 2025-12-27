import { Injectable } from "@angular/core";
import * as Blockly from "blockly";

/**
 * Service for managing Blockly-specific i18n
 * Loads Blockly.Msg translations from separate TS files
 */
@Injectable({
  providedIn: "root",
})
export class BlocklyI18nService {
  private _currentLanguage = "en";

  get currentLanguage(): string {
    return this._currentLanguage;
  }

  /**
   * Load Blockly translations for the specified language
   * @param lang Language code (en, uk, etc.)
   */
  async load(lang: string): Promise<void> {
    try {
      // Dynamically import the Blockly translation file
      const module = await import(`./translations/${lang}`);
      const translations = module.translations || module.default;

      // Explicitly apply translations to Blockly.Msg
      if (translations) Object.assign(Blockly.Msg, translations);

      // Apply the loaded translations to Blockly
      Blockly.setLocale(Blockly.Msg);

      this._currentLanguage = lang;
    } catch (error) {
      console.error(`❌ Failed to load Blockly i18n for ${lang}:`, error);
      // Fallback to English
      if (lang !== "en") await this.load("en");
    }
  }
}
