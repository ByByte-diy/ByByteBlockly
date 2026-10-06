import { describe, expect, it } from 'vitest';
import {
  ESP32_APP_FLASH_ADDRESS,
  normalizeFlashAppAddress,
} from '@modules/wasm-compiler/utils/esp32-flash-offset.util';

describe('esp32-flash-offset.util', () => {
  it('parses hex manifest offsets and numeric values', () => {
    expect(normalizeFlashAppAddress('0x10000')).toBe(0x10000);
    expect(normalizeFlashAppAddress(65536)).toBe(65536);
    expect(normalizeFlashAppAddress(undefined)).toBe(ESP32_APP_FLASH_ADDRESS);
  });
});
