#!/usr/bin/env node
/**
 * Build wasm-catalog.json for the AVR Mega2560 bundle (wasm-toolchains avrwasm.tar).
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashAggregate, hashFile, formatSha256 } from './hash-utils.mjs';
import { loadWaveCatalogs, mergeWaveCatalogs } from './libraries-manifest.mjs';
import {
  WASM_AVR_MEGA_BUNDLE_ID,
  WASM_FAMILY_AVR_MEGA,
  bundleBaseUrl,
  sanitizeDeployVersion,
} from './wasm-bundle-paths.mjs';
import { AVR_RELEASE } from './wasm-toolchains-dist.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BINARY_EXT = new Set(['.wasm', '.o', '.a']);

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.name === 'wasm-catalog.json') continue;
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function buildLibraryEntries(merged) {
  const libraries = {};
  for (const lib of merged.libraries || []) {
    const headers = (lib.headers || []).map((header) => header.virtual);
    const objects = (lib.sources || []).map((source) =>
      source.object.replace(/^\//, ''),
    );
    const includes = headers.map((virtual) => basename(virtual)).filter(Boolean);
    libraries[lib.id] = {
      includes,
      depends: lib.depends || [],
      headers,
      objects,
    };
  }
  return libraries;
}

/**
 * @param {object} options
 * @param {string} options.destDir
 * @param {string} [options.rootDir]
 * @param {object} [options.bybyteManifest]
 */
export async function generateMegaCatalog({ destDir, rootDir = join(__dirname, '../..'), bybyteManifest }) {
  const mergedWaves = mergeWaveCatalogs(await loadWaveCatalogs(__dirname));
  const manifestPath = join(destDir, 'manifest.json');
  const stockManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const bybyte = bybyteManifest || JSON.parse(
    await readFile(join(destDir, 'bybyte-manifest.json'), 'utf8'),
  );

  /** @type {Record<string, { sha256: string, size: number }>} */
  const files = {};

  for (const fullPath of await walkFiles(destDir)) {
    const rel = relative(destDir, fullPath).replace(/\\/g, '/');
    const ext = basename(fullPath).includes('.')
      ? basename(fullPath).slice(basename(fullPath).lastIndexOf('.'))
      : '';
    const isTextManifest = rel === 'manifest.json' || rel === 'bybyte-manifest.json' || rel === 'recipe.js';
    if (!BINARY_EXT.has(ext) && ext !== '.h' && ext !== '.txt' && !isTextManifest) {
      if (!rel.endsWith('.cpp') && !rel.endsWith('.c') && !rel.endsWith('.S')) {
        continue;
      }
    }
    const fileStat = await stat(fullPath);
    const sha256 = await hashFile(fullPath);
    files[rel] = { sha256, size: fileStat.size };
  }

  const libraryEntries = buildLibraryEntries(mergedWaves);
  const version = `${AVR_RELEASE.replace(/^avr-v?/, '')}+${mergedWaves.wave}`;
  const deployVersion = sanitizeDeployVersion(version);
  const assetsBase = bundleBaseUrl(WASM_FAMILY_AVR_MEGA, deployVersion);
  const contentHash = formatSha256(hashAggregate(files));
  const totalBytes = Object.values(files).reduce((sum, entry) => sum + entry.size, 0);

  const catalog = {
    schemaVersion: 1,
    layout: 'wasm-toolchains',
    bundleId: WASM_AVR_MEGA_BUNDLE_ID,
    version,
    deployVersion,
    contentHash,
    assetsBase,
    fqbn: ['arduino:avr:mega', 'arduino:avr:mega:cpu=atmega2560'],
    board: 'mega',
    mcu: 'atmega2560',
    arch: 'avr6',
    generatedAt: new Date().toISOString(),
    entryCount: Object.keys(files).length,
    totalBytes,
    files,
    tiers: {
      tools: Object.keys(files).filter((p) => p.startsWith('tools/')),
      specs: Object.keys(files).filter((p) => p.startsWith('specs/')),
      sysroot: Object.keys(files).filter((p) => p.startsWith('sysroot/')),
      core: {
        manifest: 'manifest.json',
        bybyteManifest: 'bybyte-manifest.json',
        glue: ['index.js', 'recipe.js'],
        arduinoCore: 'arduino-core/',
        stockLibraries: Object.keys(stockManifest.libraries || {}),
        ldscript: 'sysroot/avr/lib/ldscripts/avr6.xn',
        headerPaths: [],
        objectPaths: bybyte.objectPaths || [],
      },
      libraries: libraryEntries,
    },
  };

  const outPath = join(destDir, 'wasm-catalog.json');
  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  return catalog;
}
