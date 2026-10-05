/**
 * Versioned WASM bundle paths for deploy (F2).
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const WASM_AVR_328P_BUNDLE_ID = 'wasm-avr-328p';
export const WASM_FAMILY_AVR_328P = 'avr-328p';

/** URL-safe deploy directory name derived from bundle version string. */
export function sanitizeDeployVersion(version) {
  return `v${version.replace(/\+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

/** Public base URL for a versioned bundle (trailing slash). */
export function bundleBaseUrl(family, deployVersion) {
  return `/assets/wasm/${family}/${deployVersion}/`;
}

/** On-disk directory for a versioned bundle under src/assets. */
export function bundleDiskPath(assetsDir, family, deployVersion) {
  return join(assetsDir, 'wasm', family, deployVersion);
}

export function bundleDirFromBaseUrl(assetsDir, baseUrl) {
  const trimmed = baseUrl.replace(/^\//, '').replace(/\/$/, '');
  const relative = trimmed.replace(/^assets\//, '');
  return join(assetsDir, relative);
}

/**
 * Resolve prepared AVR 328p bundle directory from cache-manifest.json.
 * @param {string} rootDir - repo root
 */
export async function resolveAvr328pBundleDir(rootDir) {
  const assetsDir = join(rootDir, 'src/assets');
  const manifestPath = join(assetsDir, 'cache-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const entry = manifest.bundles?.[WASM_AVR_328P_BUNDLE_ID];
  if (!entry?.baseUrl) {
    throw new Error(
      'wasm-avr-328p missing from cache-manifest.json — run npm run prepare:wasm-avr',
    );
  }
  return bundleDirFromBaseUrl(assetsDir, entry.baseUrl);
}
