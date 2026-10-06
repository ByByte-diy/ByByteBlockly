import { COMPILE_WASM_UNSUPPORTED_BOARD_I18N } from '@core/constants/compile-i18n.const';
import { COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N } from '../constants/compile-wasm-i18n.const';

/** i18n key when web WASM has no strategy for the selected FQBN. */
export function resolveWasmUnsupportedBoardI18n(fqbn: string): string {
  if (fqbn.toLowerCase().includes('esp8266')) {
    return COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N;
  }
  return COMPILE_WASM_UNSUPPORTED_BOARD_I18N;
}
