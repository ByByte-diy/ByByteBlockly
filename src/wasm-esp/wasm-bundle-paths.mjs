/**
 * Versioned ESP32 WASM bundle paths (F4 spike).
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const WASM_ESP32_BUNDLE_ID = 'wasm-esp32';
export const WASM_FAMILY_ESP32 = 'esp32';

export const ESP32_TOOLCHAIN_VERSION = 'esp-v1.0.0';

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
 * Resolve prepared ESP32 bundle directory from cache-manifest.json.
 * @param {string} rootDir - repo root
 */
export async function resolveEsp32BundleDir(rootDir) {
  const assetsDir = join(rootDir, 'src/assets');
  const manifestPath = join(assetsDir, 'cache-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const entry = manifest.bundles?.[WASM_ESP32_BUNDLE_ID];
  if (!entry?.baseUrl) {
    throw new Error(
      'wasm-esp32 missing from cache-manifest.json — run npm run prepare:wasm-esp',
    );
  }
  return bundleDirFromBaseUrl(assetsDir, entry.baseUrl);
}
