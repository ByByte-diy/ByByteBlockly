#!/usr/bin/env node
/**
 * F4.1 spike — publish wasm-toolchains esp32wasm.tar to src/assets/wasm/esp32/.
 */
import { cp, mkdir, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
  ESP32_TOOLCHAIN_VERSION,
  WASM_FAMILY_ESP32,
  bundleDiskPath,
  sanitizeDeployVersion,
} from './wasm-bundle-paths.mjs';
import { updateCacheManifestWithEsp32 } from './update-cache-manifest.mjs';
import { generateEsp32Catalog } from './generate-esp32-catalog.mjs';

const require = createRequire(import.meta.url);
const { ensureTarExtracted, paths } = require('./wasm-toolchains-esp32-dist.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const ASSETS_DIR = join(ROOT, 'src/assets');
const DEPLOY_VERSION = sanitizeDeployVersion(ESP32_TOOLCHAIN_VERSION);
const STAGING = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_ESP32, '_staging');
const FINAL = bundleDiskPath(ASSETS_DIR, WASM_FAMILY_ESP32, DEPLOY_VERSION);

async function main() {
  const p = paths(ROOT);
  const distWeb = ensureTarExtracted(p);

  await rm(STAGING, { recursive: true, force: true });
  await mkdir(dirname(STAGING), { recursive: true });
  console.log(`Copying ${distWeb} → ${STAGING}`);
  await cp(distWeb, STAGING, { recursive: true });

  await cp(join(__dirname, 'esp32-browser/index.js'), join(STAGING, 'index.js'));
  await cp(join(__dirname, 'recipe-esp.js'), join(STAGING, 'recipe-esp.js'));
  await cp(join(__dirname, 'esp32-elf2image.js'), join(STAGING, 'esp32-elf2image.js'));
  console.log('Copied esp32-browser/index.js + recipe-esp.js + esp32-elf2image.js');

  await rm(FINAL, { recursive: true, force: true });
  try {
    await rename(STAGING, FINAL);
  } catch {
    await cp(STAGING, FINAL, { recursive: true });
    await rm(STAGING, { recursive: true, force: true });
  }

  console.log(`Published ESP32 bundle: ${FINAL}`);
  const wasmCatalog = await generateEsp32Catalog({ bundleDir: FINAL });
  console.log(`Generated wasm-catalog.json (${wasmCatalog.entryCount} files)`);

  const { espCatalog } = await updateCacheManifestWithEsp32({ bundleDir: FINAL, rootDir: ROOT });
  console.log(
    `cache-manifest.json — wasm-esp32 ${espCatalog.version}, ` +
      `${(espCatalog.totalBytes / 1048576).toFixed(1)} MB, output=${espCatalog.outputFormat}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
