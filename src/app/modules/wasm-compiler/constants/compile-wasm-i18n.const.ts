import type { WasmFamily } from './wasm-family.types';

/** WASM toolchain auto-update in progress (before compile retry). */
export const COMPILE_WASM_TOOLCHAIN_UPDATING_I18N = 'ui.compile_progress_updating_toolchain';

/** User-facing toast when WASM assets/toolchain probe failed (details in build log). */
export const COMPILE_WASM_TOOLCHAIN_MISSING_BY_FAMILY: Record<WasmFamily, string> = {
  'avr-328p': 'ui.compile_wasm_toolchain_missing_avr',
  'avr-mega': 'ui.compile_wasm_toolchain_missing_mega',
  esp32: 'ui.compile_wasm_toolchain_missing_esp32',
};

export function compileWasmToolchainMissingI18n(family: WasmFamily): string {
  return COMPILE_WASM_TOOLCHAIN_MISSING_BY_FAMILY[family];
}

/** Sketch uses libraries not available in the ESP32 web bundle (details in build log). */
export const COMPILE_WASM_ESP32_UNSUPPORTED_LIB_I18N = 'ui.compile_wasm_esp32_unsupported_library';

/** ESP8266 has no browser WASM toolchain — use Electron / arduino-cli. */
export const COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N = 'ui.compile_wasm_esp8266_desktop_only';
