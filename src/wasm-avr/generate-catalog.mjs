#!/usr/bin/env node
/**
 * Build wasm-catalog.json and cache-manifest.json for the AVR 328p bundle.
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashAggregate, hashFile, formatSha256 } from './hash-utils.mjs';
import { loadWaveCatalogs, mergeWaveCatalogs } from './libraries-manifest.mjs';
import {
  WASM_AVR_328P_BUNDLE_ID,
  WASM_FAMILY_AVR_328P,
  bundleBaseUrl,
  resolveAvr328pBundleDir,
  sanitizeDeployVersion,
} from './wasm-bundle-paths.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT_FILES = ['firmware-builder.js', 'index.js', 'worker.js'];

const BINARY_EXT = new Set(['.wasm', '.o', '.a', '.xn']);

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildLibraryEntries(merged) {
  /** @type {Record<string, object>} */
  const libraries = {};

  for (const lib of merged.libraries || []) {
    const headers = (lib.headers || []).map((header) => header.virtual);
    const objects = (lib.sources || []).map((source) =>
      source.object.replace(/^\//, ''),
    );
    const includes = headers
      .map((virtual) => basename(virtual))
      .filter(Boolean);

    libraries[lib.id] = {
      includes,
      depends: lib.depends || [],
      headers,
      objects,
    };
  }

  return libraries;
}

async function findLatestAvr328pCatalog(assetsDir) {
  const familyDir = join(assetsDir, 'wasm', WASM_FAMILY_AVR_328P);
  let entries;
  try {
    entries = await readdir(familyDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const versions = entries
    .filter((entry) => entry.isDirectory() && entry.name !== '_staging')
    .map((entry) => entry.name);

  let latestPath = null;
  let latestMtime = 0;
  for (const version of versions) {
    const catalogPath = join(familyDir, version, 'wasm-catalog.json');
    try {
      const fileStat = await stat(catalogPath);
      if (fileStat.mtimeMs >= latestMtime) {
        latestMtime = fileStat.mtimeMs;
        latestPath = catalogPath;
      }
    } catch {
      // skip missing catalogs
    }
  }

  if (!latestPath) {
    return null;
  }

  return JSON.parse(await readFile(latestPath, 'utf8'));
}

/**
 * @param {object} options
 * @param {string} options.destDir - prepared bundle root
 * @param {string} [options.rootDir] - repo root for npm package version
 * @returns {Promise<object>}
 */
export async function generateCatalog({ destDir, rootDir = join(__dirname, '../..') }) {
  const pkgPath = join(rootDir, 'node_modules/@horang-corp/avr-gcc-wasm/package.json');
  const pkgVersion = JSON.parse(await readFile(pkgPath, 'utf8')).version;

  const mergedWaves = mergeWaveCatalogs(await loadWaveCatalogs(__dirname));

  /** @type {Record<string, { sha256: string, size: number }>} */
  const files = {};

  for (const name of ROOT_FILES) {
    const fullPath = join(destDir, name);
    try {
      const fileStat = await stat(fullPath);
      if (!fileStat.isFile()) {
        continue;
      }
      const sha256 = await hashFile(fullPath);
      files[name] = { sha256, size: fileStat.size };
    } catch {
      // optional files
    }
  }

  const toolsDir = join(destDir, 'tools');
  for (const fullPath of await walkFiles(toolsDir)) {
    const logical = relative(destDir, fullPath).replace(/\\/g, '/');
    const fileStat = await stat(fullPath);
    const sha256 = await hashFile(fullPath);
    files[logical] = { sha256, size: fileStat.size };
  }

  const assetsDir = join(destDir, 'assets');
  for (const fullPath of await walkFiles(assetsDir)) {
    const ext = basename(fullPath).includes('.')
      ? basename(fullPath).slice(basename(fullPath).lastIndexOf('.'))
      : '';
    if (!BINARY_EXT.has(ext) && ext !== '.h') {
      continue;
    }
    const logical = relative(destDir, fullPath).replace(/\\/g, '/');
    const fileStat = await stat(fullPath);
    const sha256 = await hashFile(fullPath);
    files[logical] = { sha256, size: fileStat.size };
  }

  const manifestPath = join(destDir, 'assets/manifest.json');
  const manifestStat = await stat(manifestPath);
  const manifestSha = await hashFile(manifestPath);
  files['assets/manifest.json'] = { sha256: manifestSha, size: manifestStat.size };

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const libraryEntries = buildLibraryEntries(mergedWaves);
  const bybyteHeaders = new Set();
  for (const entry of Object.values(libraryEntries)) {
    for (const header of entry.headers || []) {
      bybyteHeaders.add(header);
    }
  }
  const coreHeaderPaths = (manifest.headerFiles || []).filter((header) => !bybyteHeaders.has(header));

  const version = `${pkgVersion}+${mergedWaves.wave}`;
  const deployVersion = sanitizeDeployVersion(version);
  const assetsBase = bundleBaseUrl(WASM_FAMILY_AVR_328P, deployVersion);
  const contentHash = formatSha256(hashAggregate(files));
  const totalBytes = Object.values(files).reduce((sum, entry) => sum + entry.size, 0);

  const catalog = {
    schemaVersion: 1,
    bundleId: WASM_AVR_328P_BUNDLE_ID,
    version,
    deployVersion,
    contentHash,
    assetsBase,
    fqbn: ['arduino:avr:uno', 'arduino:avr:nano'],
    generatedAt: new Date().toISOString(),
    entryCount: Object.keys(files).length,
    totalBytes,
    files,
    tiers: {
      tools: Object.keys(files).filter((path) => path.startsWith('tools/')),
      core: {
        manifest: 'assets/manifest.json',
        glue: ['index.js', 'firmware-builder.js', 'worker.js'].filter((path) => files[path]),
        headerPaths: coreHeaderPaths,
        baseObjects: manifest.objectGroups?.base ?? [],
        oledObjects: manifest.objectGroups?.oled ?? [],
        tofObjects: manifest.objectGroups?.tof ?? [],
        linkLibs: manifest.libs ?? [],
        ldscript: 'assets/ldscripts/avr5.xn',
      },
      libraries: libraryEntries,
    },
  };

  const outPath = join(destDir, 'wasm-catalog.json');
  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  return catalog;
}

/**
 * @param {object} options
 * @param {string} [options.rootDir]
 * @param {string} [options.assetsDir]
 * @param {object} [options.wasmCatalog] - freshly built catalog (prepare pipeline)
 * @returns {Promise<object>}
 */
export async function generateCacheManifest({
  rootDir = join(__dirname, '../..'),
  assetsDir = join(rootDir, 'src/assets'),
  wasmCatalog,
} = {}) {
  const packageJson = JSON.parse(
    await readFile(join(rootDir, 'package.json'), 'utf8'),
  );

  /** @type {Record<string, object>} */
  const bundles = {};

  let catalog = wasmCatalog;
  if (!catalog) {
    try {
      const bundleDir = await resolveAvr328pBundleDir(rootDir);
      catalog = JSON.parse(await readFile(join(bundleDir, 'wasm-catalog.json'), 'utf8'));
    } catch (error) {
      catalog = await findLatestAvr328pCatalog(assetsDir);
      if (!catalog) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
          console.warn('wasm-catalog.json missing — run prepare:wasm-avr first');
        } else if (String(error?.message || error).includes('cache-manifest.json')) {
          console.warn('cache-manifest.json missing — run prepare:wasm-avr first');
        } else {
          throw error;
        }
      }
    }
  }

  if (catalog) {
    bundles[WASM_AVR_328P_BUNDLE_ID] = {
      version: catalog.version,
      contentHash: catalog.contentHash,
      baseUrl: catalog.assetsBase,
      catalogUrl: `${catalog.assetsBase}wasm-catalog.json`,
      entryCount: catalog.entryCount,
      totalBytes: catalog.totalBytes,
    };
  }

  const manifest = {
    schemaVersion: 1,
    appMinVersion: packageJson.version || '0.0.0',
    generatedAt: new Date().toISOString(),
    bundles,
  };

  const outPath = join(assetsDir, 'cache-manifest.json');
  await writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const mode = process.argv[2];
  if (mode === 'cache-manifest') {
    generateCacheManifest()
      .then((manifest) => {
        const ids = Object.keys(manifest.bundles).join(', ') || '(none)';
        console.log(`Wrote cache-manifest.json bundles: ${ids}`);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    const destDir = mode || join(__dirname, '../assets/wasm/avr-328p/_staging');
    generateCatalog({ destDir })
      .then((catalog) => {
        console.log(
          `Wrote wasm-catalog.json (${catalog.entryCount} files, ${catalog.version}, ${catalog.contentHash})`,
        );
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
}
