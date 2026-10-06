import { describe, expect, it } from 'vitest';
import {
  base64ToBinaryString,
  ESP32_APP_FLASH_ADDRESS,
  flashSizeBytesFromLabel,
  flashSizeLabelFromKb,
  isEsp32WebUploadFqbn,
  normalizeFlashAppAddress,
} from '../upload/utils/esp32-upload-profile.util';

describe('esp32-upload-profile.util', () => {
  it('detects ESP32 Dev FQBN', () => {
    expect(isEsp32WebUploadFqbn('esp32:esp32:esp32')).toBe(true);
    expect(isEsp32WebUploadFqbn('esp32:esp32:esp32:PartitionScheme=huge_app')).toBe(true);
    expect(isEsp32WebUploadFqbn('arduino:avr:uno')).toBe(false);
  });

  it('decodes base64 firmware payload', () => {
    const encoded = btoa('\x00\x01\x02');
    expect(base64ToBinaryString(encoded)).toBe('\x00\x01\x02');
    expect(ESP32_APP_FLASH_ADDRESS).toBe(0x10000);
  });

  it('normalizeFlashAppAddress parses hex strings and numbers', () => {
    expect(normalizeFlashAppAddress('0x10000')).toBe(0x10000);
    expect(normalizeFlashAppAddress(0x10000)).toBe(0x10000);
    expect(normalizeFlashAppAddress('65536')).toBe(65536);
    expect(normalizeFlashAppAddress(undefined)).toBe(0x10000);
  });

  it('flashSizeLabelFromKb maps chip-detected sizes', () => {
    expect(flashSizeLabelFromKb(4096)).toBe('4MB');
    expect(flashSizeLabelFromKb(2048)).toBe('2MB');
    expect(flashSizeLabelFromKb(512)).toBe('512KB');
  });

  it('flashSizeBytesFromLabel converts labels to bytes', () => {
    expect(flashSizeBytesFromLabel('4MB')).toBe(4 * 1024 * 1024);
    expect(flashSizeBytesFromLabel('512KB')).toBe(512 * 1024);
  });
});
