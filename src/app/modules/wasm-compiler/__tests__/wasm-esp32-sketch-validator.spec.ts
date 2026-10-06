import { describe, expect, it } from 'vitest';
import { BundleCatalog } from '@modules/asset-cache';
import {
  Esp32SupportPolicy,
  validateEsp32SketchIncludes,
} from '@modules/wasm-compiler/utils/wasm-esp32-sketch-validator';

const catalog: BundleCatalog & { supportPolicy: Esp32SupportPolicy } = {
  schemaVersion: 1,
  bundleId: 'wasm-esp32',
  version: '1.0.0',
  contentHash: 'sha256:test',
  assetsBase: '/assets/wasm/esp32/v1/',
  generatedAt: '2026-01-01T00:00:00.000Z',
  entryCount: 1,
  totalBytes: 1,
  files: {
    'vfs/root/Arduino/libraries/DHT/DHT.h': { sha256: 'a', size: 1 },
  },
  tiers: {},
  supportPolicy: {
    desktopOnly: [
      {
        includes: ['Firebase_ESP_Client.h'],
        reason: 'Firebase ESP client — desktop arduino-cli only (F4.4)',
      },
    ],
    avrWebOnly: [
      {
        includes: ['Quad.h'],
        reason: 'Otto Quad — AVR only',
      },
    ],
  },
};

describe('wasm-esp32-sketch-validator', () => {
  it('accepts sketch when includes are in VFS catalog', () => {
    const result = validateEsp32SketchIncludes(
      '#include <Arduino.h>\n#include <DHT.h>\nvoid setup() {}',
      catalog,
    );
    expect(result.ok).toBe(true);
  });

  it('rejects Firebase with desktop-only policy before compile', () => {
    const result = validateEsp32SketchIncludes(
      '#include <Arduino.h>\n#include <Firebase_ESP_Client.h>\nvoid setup() {}',
      catalog,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain('Firebase_ESP_Client.h');
      expect(result.output).toContain('Firebase ESP client');
    }
  });

  it('rejects Quad.h with policy reason before compile', () => {
    const result = validateEsp32SketchIncludes(
      '#include <Arduino.h>\n#include <Quad.h>\nvoid setup() {}',
      catalog,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toContain('Quad.h');
      expect(result.output).toContain('Otto Quad — AVR only');
      expect(result.output).not.toContain('Otto/Quad sketches');
    }
  });
});
