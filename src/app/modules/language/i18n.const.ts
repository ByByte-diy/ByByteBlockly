import { LanguageInfo } from "./types/lang.type";

/**
 * Supported languages for the application
 */
export const SUPPORTED_LANGUAGES: Record<string, LanguageInfo> = Object.freeze({
  en: { code: 'en', name: 'English', flag: '🇬🇧', rtl: false },
  uk: { code: 'uk', name: 'Українська', flag: '🇺🇦', rtl: false },
  // Add more languages here
});
