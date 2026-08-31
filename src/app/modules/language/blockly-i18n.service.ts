import { Injectable } from "@angular/core";
import * as Blockly from "blockly";
import * as En from "blockly/msg/en";

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
      // Always start from Blockly core defaults so standard block labels exist
      Blockly.setLocale(En);

      // Merge project-specific overrides
      const module = await import(`./translations/${lang}`);
      const translations = module.translations || module.default;
      if (translations) {
        Object.assign(Blockly.Msg, translations);
      }

      Blockly.setLocale(Blockly.Msg);
      this._currentLanguage = lang;
    } catch (error) {
      console.error(`❌ Failed to load Blockly i18n for ${lang}:`, error);
      if (lang !== "en") {
        await this.load("en");
      }
    }
  }
}
