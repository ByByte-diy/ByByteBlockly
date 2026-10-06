import { BundleCatalog } from '@modules/asset-cache';
import {
  getCoreTier,
  getToolsTier,
  virtualPathToCatalogFile,
  WasmCatalogCoreTier,
} from './wasm-library-resolver';

export type WasmPrefetchTier = 'tools' | 'core';

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function collectCorePrefetchPaths(core: WasmCatalogCoreTier, catalog: BundleCatalog): string[] {
  const paths: string[] = [];

  for (const path of core.glue ?? []) {
    paths.push(path);
  }
  if (core.manifest) {
    paths.push(core.manifest);
  }
  if (core.ldscript) {
    paths.push(core.ldscript);
  }
  for (const objectPath of core.baseObjects ?? []) {
    paths.push(virtualPathToCatalogFile(objectPath, catalog));
  }
  for (const libPath of core.linkLibs ?? []) {
    paths.push(virtualPathToCatalogFile(libPath, catalog));
  }

  return uniqueStrings(paths);
}

/** Catalog file keys to prefetch for a bundle tier (board-select warm-up). */
export function collectTierPrefetchPaths(catalog: BundleCatalog, tier: WasmPrefetchTier): string[] {
  const existing = catalog.files ?? {};
  const requested =
    tier === 'tools' ? getToolsTier(catalog) : collectCorePrefetchPaths(getCoreTier(catalog), catalog);

  return requested.filter((path) => path in existing);
}
