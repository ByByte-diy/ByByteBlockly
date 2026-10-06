import { BundleCatalog } from '@modules/asset-cache';
import {
  getCoreTier,
  getToolsTier,
  isEsp32Catalog,
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

function collectEsp32CorePaths(catalog: BundleCatalog): string[] {
  const core = getCoreTier(catalog) as WasmCatalogCoreTier & { templates?: string[] };
  const paths = uniqueStrings([
    core.manifest,
    ...(core.glue ?? []),
    ...(core.templates ?? []),
  ].filter(Boolean) as string[]);
  return paths;
}

/** Full VFS link/header closure — prefetch at compile time, not on board select. */
export function collectEsp32ClosurePaths(catalog: BundleCatalog): string[] {
  const existing = catalog.files ?? {};
  const tiers = catalog.tiers as { closure?: { vfsPaths?: string[] } } | undefined;
  const vfsPaths =
    tiers?.closure?.vfsPaths ?? Object.keys(existing).filter((path) => path.startsWith('vfs/'));
  return vfsPaths.filter((path) => path in existing);
}

/** Catalog file keys to prefetch for a bundle tier (board-select warm-up). */
export function collectTierPrefetchPaths(catalog: BundleCatalog, tier: WasmPrefetchTier): string[] {
  const existing = catalog.files ?? {};
  let requested: string[];

  if (isEsp32Catalog(catalog)) {
    requested = tier === 'tools' ? getToolsTier(catalog) : collectEsp32CorePaths(catalog);
  } else {
    requested =
      tier === 'tools' ? getToolsTier(catalog) : collectCorePrefetchPaths(getCoreTier(catalog), catalog);
  }

  return requested.filter((path) => path in existing);
}
