import { SUPPORTED_LANGUAGES } from "../i18n.const";

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}


export type SupportedLanguageCode =
  (typeof SUPPORTED_LANGUAGES)[number]["code"];