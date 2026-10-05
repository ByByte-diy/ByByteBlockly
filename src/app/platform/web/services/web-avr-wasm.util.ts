import { injectForwardDeclarations } from './sketch-preprocessor';

/** @deprecated Use WasmAssetProvider.resolveAssetsBase() — base URL comes from cache-manifest.json */
export const WASM_AVR_ASSETS_PATH = 'assets/wasm/';

export const WASM_AVR_SUPPORTED_FQBNS = [
  'arduino:avr:uno',
  'arduino:avr:nano',
] as const;

export const WASM_AVR_UNSUPPORTED_MESSAGE =
  'Web WASM compile currently supports only AVR ATmega328P (arduino:avr:uno / arduino:avr:nano). Mega, ESP and other boards need a later adapter.';

/** Matches firmware-builder SENSOR.OLED — links lib_GFX (+ SSD1306 from npm). */
export const WASM_SENSOR_OLED = 'OLED';

/** Matches firmware-builder SENSOR.TOF — links lib_VL53L0X from npm. */
export const WASM_SENSOR_TOF = 'TOF';

export function normalizeFqbn(fqbn: string): string {
  return (fqbn || '').split(':').slice(0, 3).join(':');
}

export function isAvr328pFqbn(fqbn: string): boolean {
  return (WASM_AVR_SUPPORTED_FQBNS as readonly string[]).includes(normalizeFqbn(fqbn));
}

export function resolveWasmAssetsBase(baseUrl?: string, baseHref = document.baseURI): string {
  const base = baseUrl ?? WASM_AVR_ASSETS_PATH;
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base.endsWith('/') ? base : `${base}/`;
  }
  return new URL(base, baseHref).href;
}

export function prepareSketchForWasm(code: string): string {
  let source = code.trim();
  if (!source) {
    return source;
  }

  if (!/#include\s*<Arduino\.h>/.test(source)) {
    source = `#include <Arduino.h>\n\n${source}`;
  }

  source = injectForwardDeclarations(source);

  // WASM links against core_main.o; sketches without setup/loop fail at link time.
  if (!/\bvoid\s+setup\s*\(\s*\)/.test(source)) {
    source += '\n\nvoid setup() {}\n';
  }
  if (!/\bvoid\s+loop\s*\(\s*\)/.test(source)) {
    source += '\nvoid loop() {}\n';
  }

  return source;
}

/** Select optional npm object groups (GFX/OLED, VL53L0X) from generated sketch includes. */
export function detectWasmSensors(source: string): string[] {
  const sensors: string[] = [];
  if (/#include\s*[<"]Adafruit_(GFX|SSD1306|SH1106|ST7735)/.test(source)) {
    sensors.push(WASM_SENSOR_OLED);
  }
  if (/#include\s*[<"]VL53L0X/.test(source)) {
    sensors.push(WASM_SENSOR_TOF);
  }
  return sensors;
}

/** True when manifest was produced by prepare-bybyte-assets (not stock npm only). */
export function isBybyteWasmManifest(manifest: unknown): boolean {
  if (!manifest || typeof manifest !== 'object') {
    return false;
  }
  const record = manifest as {
    bybyte?: { wave?: string };
    headerFiles?: string[];
    objectGroups?: { bybyte?: string[] };
  };
  if (record.bybyte?.wave) {
    return true;
  }
  if ((record.objectGroups?.bybyte?.length ?? 0) > 0) {
    return true;
  }
  return (
    record.headerFiles?.includes('/arduino/libraries/SoftwareSerial/src/SoftwareSerial.h') ??
    false
  );
}

export function formatWasmCompileLog(result: {
  stderr?: string[];
  timings?: Record<string, number>;
  flashBytes?: number;
  fitsTarget?: boolean;
}): string {
  const lines: string[] = [];
  const stderr = result.stderr ?? [];
  if (stderr.length) {
    lines.push(...stderr);
  }

  if (result.timings) {
    lines.push(`timings: ${JSON.stringify(result.timings)}`);
  }

  if (typeof result.flashBytes === 'number') {
    lines.push(`flashBytes: ${result.flashBytes}`);
    lines.push(`fitsTarget: ${result.fitsTarget === true}`);
  }

  return lines.join('\n');
}
