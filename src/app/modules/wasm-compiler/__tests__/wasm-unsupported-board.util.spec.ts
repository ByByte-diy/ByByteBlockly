import { describe, expect, it } from 'vitest';
import { COMPILE_WASM_UNSUPPORTED_BOARD_I18N } from '@core/constants/compile-i18n.const';
import { COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N } from '../constants/compile-wasm-i18n.const';
import { resolveWasmUnsupportedBoardI18n } from '../utils/wasm-unsupported-board.util';

describe('resolveWasmUnsupportedBoardI18n', () => {
  it('returns ESP8266 desktop-only key', () => {
    expect(resolveWasmUnsupportedBoardI18n('esp8266:esp8266:generic')).toBe(
      COMPILE_WASM_ESP8266_DESKTOP_ONLY_I18N,
    );
  });

  it('returns generic unsupported key for other boards', () => {
    expect(resolveWasmUnsupportedBoardI18n('raspberry-pi:pico')).toBe(
      COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
    );
  });
});
