import { BundleCatalog } from '@modules/asset-cache';
import { parseSketchIncludes } from './wasm-library-resolver';

export interface Esp32LibraryPolicyEntry {
  includes: string[];
  reason: string;
}

export interface Esp32SupportPolicy {
  coreIncludes?: string[];
  desktopOnly?: Esp32LibraryPolicyEntry[];
  avrWebOnly?: Esp32LibraryPolicyEntry[];
}

/** Known AVR-only headers when catalog was built before supportPolicy was embedded. */
const FALLBACK_AVR_WEB_ONLY = new Map<string, string>([
  ['Quad.h', 'Otto Quad — web compile on AVR Uno/Mega only'],
  ['Octosnake.h', 'Otto Quad dependency — AVR web compile only'],
  ['Otto.h', 'Otto biped — web compile on AVR Uno/Mega only; Ottoky/ESP32 need arduino-cli'],
  ['Otto_humanoid.h', 'Otto humanoid — AVR web compile only'],
  ['Stepper.h', 'Stepper — AVR web compile only'],
]);

function catalogHasHeader(catalog: BundleCatalog, includeName: string): boolean {
  const base = includeName.split('/').pop() ?? includeName;
  const suffixes = [`/${base}`, base];
  return Object.keys(catalog.files ?? {}).some((path) =>
    suffixes.some((suffix) => path.endsWith(suffix)),
  );
}

function findPolicyReason(
  policy: Esp32SupportPolicy | undefined,
  includeName: string,
): string | undefined {
  if (!policy) {
    return FALLBACK_AVR_WEB_ONLY.get(includeName);
  }

  for (const group of [...(policy.desktopOnly ?? []), ...(policy.avrWebOnly ?? [])]) {
    if (group.includes.some((name) => name === includeName || includeName.endsWith(`/${name}`))) {
      return group.reason;
    }
  }

  return FALLBACK_AVR_WEB_ONLY.get(includeName);
}

function getSupportPolicy(catalog: BundleCatalog): Esp32SupportPolicy | undefined {
  return (catalog as { supportPolicy?: Esp32SupportPolicy }).supportPolicy;
}

/**
 * Fail fast before cc1plus when the sketch #includes headers absent from the ESP32 VFS bundle.
 */
export function validateEsp32SketchIncludes(
  source: string,
  catalog: BundleCatalog,
): { ok: true } | { ok: false; missing: string[]; output: string } {
  const policy = getSupportPolicy(catalog);
  const coreSkip = new Set([
    'Arduino.h',
    'WiFi.h',
    'HTTPClient.h',
    'esp_now.h',
    ...(policy?.coreIncludes ?? []),
  ]);

  const missing: string[] = [];
  const details: string[] = [];

  for (const name of parseSketchIncludes(source)) {
    const base = name.split('/').pop() ?? name;
    if (coreSkip.has(base) || coreSkip.has(name)) {
      continue;
    }
    if (catalogHasHeader(catalog, base)) {
      continue;
    }

    missing.push(base);
    const reason =
      findPolicyReason(policy, base) ??
      `${base} is not shipped in the ESP32 web compile bundle`;
    details.push(`${base}: ${reason}`);
  }

  if (!missing.length) {
    return { ok: true };
  }

  return {
    ok: false,
    missing,
    output: [
      'ESP32 web compile — missing library headers:',
      ...details,
      '',
      'Remove or replace unsupported libraries, select a matching board in the device panel,',
      'or compile with arduino-cli on desktop.',
    ].join('\n'),
  };
}
