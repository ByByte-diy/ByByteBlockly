#!/usr/bin/env node
/**
 * Build wasm-catalog.json for the ESP32 wasm-toolchains bundle (lazy tiers).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatSha256 } from '../wasm-avr/hash-utils.mjs';
import {
  WASM_ESP32_BUNDLE_ID,
  WASM_FAMILY_ESP32,
  ESP32_TOOLCHAIN_VERSION,
  bundleBaseUrl,
  sanitizeDeployVersion,
} from './wasm-bundle-paths.mjs';
import { buildEsp32BundleCatalog } from './update-cache-manifest.mjs';

/**
 * @param {object} opts
 * @param {string} opts.bundleDir
 */
const ESP_ROOT = dirname(fileURLToPath(import.meta.url));

async function loadEsp32LibraryPolicy() {
  const raw = await readFile(join(ESP_ROOT, 'libraries.esp.json'), 'utf8');
  return JSON.parse(raw);
}

function buildEsp32CatalogLibraries(harvested) {
  const libraries = {};
  for (const lib of harvested ?? []) {
    libraries[lib.id] = {
      includes: lib.includes ?? [],
      depends: [],
      headers: [],
      objects: [],
      vfsPrefix: lib.vfsPrefix,
    };
  }
  return libraries;
}

export async function generateEsp32Catalog({ bundleDir }) {
  const manifest = JSON.parse(await readFile(join(bundleDir, 'manifest.json'), 'utf8'));
  const base = await buildEsp32BundleCatalog({ bundleDir });
  const libraryPolicy = await loadEsp32LibraryPolicy();

  const tools = manifest.tools ?? [];
  const board = manifest.boards?.esp32;
  const templatePaths = board
    ? [board.templates?.cc1plus, board.templates?.ld, manifest.isystem].filter(Boolean)
    : [];

  const glue = ['index.js', 'recipe-esp.js', 'esp32-elf2image.js'];
  const corePaths = unique([
    'manifest.json',
    ...glue,
    ...templatePaths,
    ...tools,
  ]).filter((path) => path in base.files);

  const vfsPaths = Object.keys(base.files).filter((path) => path.startsWith('vfs/'));

  const catalog = {
    schemaVersion: 1,
    bundleId: WASM_ESP32_BUNDLE_ID,
    layout: 'wasm-toolchains-esp32',
    version: ESP32_TOOLCHAIN_VERSION,
    deployVersion: sanitizeDeployVersion(ESP32_TOOLCHAIN_VERSION),
    contentHash: base.contentHash,
    assetsBase: bundleBaseUrl(WASM_FAMILY_ESP32, sanitizeDeployVersion(ESP32_TOOLCHAIN_VERSION)),
    fqbn: ['esp32:esp32:esp32'],
    outputFormat: 'bin',
    generatedAt: new Date().toISOString(),
    entryCount: base.entryCount,
    totalBytes: base.totalBytes,
    files: base.files,
    tiers: {
      tools,
      core: {
        manifest: 'manifest.json',
        glue,
        templates: templatePaths,
      },
      closure: {
        vfsPaths,
      },
      libraries: buildEsp32CatalogLibraries(libraryPolicy.harvested),
    },
    supportPolicy: {
      coreIncludes: libraryPolicy.coreIncludes ?? [],
      desktopOnly: libraryPolicy.desktopOnly ?? [],
      avrWebOnly: libraryPolicy.avrWebOnly ?? [],
    },
  };

  const outPath = join(bundleDir, 'wasm-catalog.json');
  await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  return catalog;
}

function unique(values) {
  return [...new Set(values)];
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const bundleDir = process.argv[2];
  if (!bundleDir) {
    console.error('Usage: node generate-esp32-catalog.mjs <bundleDir>');
    process.exit(1);
  }
  generateEsp32Catalog({ bundleDir })
    .then((catalog) => {
      console.log(
        `Wrote wasm-catalog.json (${catalog.entryCount} files, ${formatSha256(catalog.contentHash)})`,
      );
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
