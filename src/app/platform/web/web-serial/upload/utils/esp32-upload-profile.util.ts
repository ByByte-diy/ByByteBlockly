import { Esp32WasmCompilerStrategy } from '@modules/wasm-compiler/strategies/esp32-wasm-compiler.strategy';
import {
  ESP32_APP_FLASH_ADDRESS,
  normalizeFlashAppAddress,
} from '@modules/wasm-compiler/utils/esp32-flash-offset.util';

export { ESP32_APP_FLASH_ADDRESS, normalizeFlashAppAddress };

export function isEsp32WebUploadFqbn(fqbn: string): boolean {
  return Esp32WasmCompilerStrategy.supportsFqbn(fqbn);
}

export function base64ToBinaryString(base64: string): string {
  return atob(base64.trim());
}

/** Map esptool-js {@link ESPLoader.getFlashSize} result (kilobytes) to a flashSize label. */
export function flashSizeLabelFromKb(flashKb: number): string {
  if (!Number.isFinite(flashKb) || flashKb <= 0) {
    return '4MB';
  }
  if (flashKb >= 1024 && flashKb % 1024 === 0) {
    return `${flashKb / 1024}MB`;
  }
  return `${flashKb}KB`;
}

export function flashSizeBytesFromLabel(label: string): number {
  const trimmed = label.trim().toUpperCase();
  if (trimmed.endsWith('MB')) {
    return Number.parseInt(trimmed, 10) * 1024 * 1024;
  }
  if (trimmed.endsWith('KB')) {
    return Number.parseInt(trimmed, 10) * 1024;
  }
  return 4 * 1024 * 1024;
}
