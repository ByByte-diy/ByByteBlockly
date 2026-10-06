/** Default app partition offset for esp32:esp32:esp32 (Arduino 3.x default scheme). */
export const ESP32_APP_FLASH_ADDRESS = 0x10000;

/** Coerce manifest / compile metadata to a numeric flash offset (esptool-js requires numbers). */
export function normalizeFlashAppAddress(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const text = value.trim().toLowerCase();
    if (text.startsWith('0x')) {
      const parsed = Number.parseInt(text.slice(2), 16);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    if (/^\d+$/.test(text)) {
      return Number.parseInt(text, 10);
    }
    const parsed = Number.parseInt(text, 16);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return ESP32_APP_FLASH_ADDRESS;
}
