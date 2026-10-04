export const WASM_AVR_ASSETS_PATH = 'assets/wasm-avr/';

export const WASM_AVR_SUPPORTED_FQBNS = [
  'arduino:avr:uno',
  'arduino:avr:nano',
] as const;

export const WASM_AVR_UNSUPPORTED_MESSAGE =
  'Web WASM compile currently supports only AVR ATmega328P (arduino:avr:uno / arduino:avr:nano). Mega, ESP and other boards need a later adapter.';

export function normalizeFqbn(fqbn: string): string {
  return (fqbn || '').split(':').slice(0, 3).join(':');
}

export function isAvr328pFqbn(fqbn: string): boolean {
  return (WASM_AVR_SUPPORTED_FQBNS as readonly string[]).includes(normalizeFqbn(fqbn));
}

export function resolveWasmAssetsBase(baseHref = document.baseURI): string {
  return new URL(WASM_AVR_ASSETS_PATH, baseHref).href;
}

export function prepareSketchForWasm(code: string): string {
  const source = code.trim();
  if (!source) {
    return source;
  }

  if (/#include\s*<Arduino\.h>/.test(source)) {
    return source;
  }

  return `#include <Arduino.h>\n\n${source}\n`;
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
