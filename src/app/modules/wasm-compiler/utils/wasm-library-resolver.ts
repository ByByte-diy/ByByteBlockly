import { BundleCatalog } from '@modules/asset-cache';

/** Matches firmware-builder SENSOR.OLED — links lib_GFX (+ SSD1306 from npm). */
export const WASM_SENSOR_OLED = 'OLED';

/** Matches firmware-builder SENSOR.TOF — links lib_VL53L0X from npm. */
export const WASM_SENSOR_TOF = 'TOF';

/** Select optional npm object groups (GFX/OLED, VL53L0X) from generated sketch includes. */
export function detectWasmSensors(source: string): string[] {
  const sensors: string[] = [];
  if (/#include\s*[<"]Adafruit_(GFX|SSD1306|SH1106|ST7735)/.test(source)) {
    sensors.push(WASM_SENSOR_OLED);
  }
  if (/#include\s*[<"]VL53L0X/.test(source)) {
    sensors.push(WASM_SENSOR_TOF);
  }
  return sensors;
}

export interface WasmLibraryCatalogEntry {
  includes: string[];
  depends: string[];
  headers: string[];
  objects: string[];
}

export interface WasmCatalogCoreTier {
  manifest: string;
  glue: string[];
  headerPaths?: string[];
  baseObjects?: string[];
  oledObjects?: string[];
  tofObjects?: string[];
  linkLibs?: string[];
  ldscript?: string;
}

export interface WasmResolvedAssets {
  libraryIds: string[];
  headerFiles: string[];
  bybyteObjects: string[];
  includePaths: string[];
  prefetchPaths: string[];
}

const INCLUDE_RE = /#include\s*[<"]([^">]+)[">]/g;

function isWasmToolchainsCatalog(catalog?: BundleCatalog): boolean {
  if (!catalog) return false;
  const record = catalog as { layout?: string; bundleId?: string };
  return (
    record.layout === 'wasm-toolchains' ||
    record.bundleId === 'wasm-avr-mega' ||
    isEsp32Catalog(catalog)
  );
}

export function isEsp32Catalog(catalog?: BundleCatalog): boolean {
  if (!catalog) return false;
  const record = catalog as { layout?: string; bundleId?: string };
  return record.layout === 'wasm-toolchains-esp32' || record.bundleId === 'wasm-esp32';
}

/** Virtual path → catalog file key (horang vs wasm-toolchains layout). */
export function virtualPathToCatalogFile(virtualPath: string, catalog?: BundleCatalog): string {
  if (isWasmToolchainsCatalog(catalog)) {
    return virtualPath.startsWith('/') ? virtualPath.slice(1) : virtualPath;
  }
  if (virtualPath.startsWith('/objects/') || virtualPath.startsWith('/libs/')) {
    return `assets${virtualPath}`;
  }
  if (virtualPath.startsWith('/ldscripts/')) {
    return `assets${virtualPath}`;
  }
  if (virtualPath.startsWith('/')) {
    return `assets/fs${virtualPath}`;
  }
  return virtualPath;
}

export function parseSketchIncludes(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(INCLUDE_RE)) {
    const raw = match[1]?.trim();
    if (!raw) {
      continue;
    }
    names.add(raw);
    const base = raw.split('/').pop();
    if (base) {
      names.add(base);
    }
  }
  return [...names];
}

function deriveIncludePath(virtualHeader: string): string {
  const idx = virtualHeader.lastIndexOf('/');
  if (idx <= 0) {
    return virtualHeader;
  }
  return virtualHeader.slice(0, idx);
}

function normalizeObjectPath(objectPath: string): string {
  const trimmed = objectPath.replace(/^\//, '');
  return trimmed.startsWith('objects/') ? `/${trimmed}` : `/objects/${trimmed}`;
}

export function getLibraries(catalog: BundleCatalog): Record<string, WasmLibraryCatalogEntry> {
  const tiers = catalog.tiers as { libraries?: Record<string, WasmLibraryCatalogEntry> } | undefined;
  return tiers?.libraries ?? {};
}

export function getCoreTier(catalog: BundleCatalog): WasmCatalogCoreTier {
  const tiers = catalog.tiers as { core?: WasmCatalogCoreTier } | undefined;
  return tiers?.core ?? { manifest: 'assets/manifest.json', glue: [] };
}

export function getToolsTier(catalog: BundleCatalog): string[] {
  const tiers = catalog.tiers as { tools?: string[] } | undefined;
  return tiers?.tools ?? [];
}

function findLibrariesForInclude(
  includeName: string,
  libraries: Record<string, WasmLibraryCatalogEntry>,
): string[] {
  const matches: string[] = [];
  for (const [id, entry] of Object.entries(libraries)) {
    if (entry.includes.some((name) => name === includeName || includeName.endsWith(`/${name}`))) {
      matches.push(id);
    }
  }
  return matches;
}

function expandLibraryDependencies(
  rootIds: string[],
  libraries: Record<string, WasmLibraryCatalogEntry>,
): string[] {
  const resolved = new Set<string>();
  const queue = [...rootIds];

  while (queue.length) {
    const id = queue.shift();
    if (!id || resolved.has(id) || !libraries[id]) {
      continue;
    }
    resolved.add(id);
    for (const dep of libraries[id].depends ?? []) {
      if (!resolved.has(dep)) {
        queue.push(dep);
      }
    }
  }

  return [...resolved];
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Resolve ByByte libraries and prefetch paths from sketch source + wasm catalog.
 */
export function resolveWasmLibraries(source: string, catalog: BundleCatalog): WasmResolvedAssets {
  const libraries = getLibraries(catalog);
  const core = getCoreTier(catalog);
  const includeNames = parseSketchIncludes(source);

  const matchedIds = new Set<string>();
  for (const name of includeNames) {
    for (const id of findLibrariesForInclude(name, libraries)) {
      matchedIds.add(id);
    }
  }

  const libraryIds = expandLibraryDependencies([...matchedIds], libraries);

  const bybyteHeaders: string[] = [];
  const bybyteObjects: string[] = [];
  const includePaths: string[] = [];

  for (const id of libraryIds) {
    const entry = libraries[id];
    bybyteHeaders.push(...entry.headers);
    bybyteObjects.push(...entry.objects.map(normalizeObjectPath));
    for (const header of entry.headers) {
      includePaths.push(deriveIncludePath(header));
    }
  }

  const sensors = detectWasmSensors(source);
  const headerFiles = uniqueStrings([...(core.headerPaths ?? []), ...bybyteHeaders]);
  // Stock npm objects in core.baseObjects (e.g. lib_Servo.o) are overwritten by ByByte waves
  // but must be linked only once — exclude duplicates from selective bybyte load.
  const baseObjectSet = new Set((core.baseObjects ?? []).map(normalizeObjectPath));
  const objectPaths = uniqueStrings(bybyteObjects).filter((path) => !baseObjectSet.has(path));

  const prefetchPaths = new Set<string>();

  for (const path of getToolsTier(catalog)) {
    prefetchPaths.add(path);
  }
  for (const path of core.glue ?? []) {
    prefetchPaths.add(path);
  }
  if (core.manifest) {
    prefetchPaths.add(core.manifest);
  }
  for (const header of headerFiles) {
    prefetchPaths.add(virtualPathToCatalogFile(header, catalog));
  }
  for (const objectPath of [...(core.baseObjects ?? []), ...objectPaths]) {
    prefetchPaths.add(virtualPathToCatalogFile(objectPath, catalog));
  }
  if (sensors.includes(WASM_SENSOR_OLED)) {
    for (const objectPath of core.oledObjects ?? []) {
      prefetchPaths.add(virtualPathToCatalogFile(objectPath, catalog));
    }
  }
  if (sensors.includes(WASM_SENSOR_TOF)) {
    for (const objectPath of core.tofObjects ?? []) {
      prefetchPaths.add(virtualPathToCatalogFile(objectPath, catalog));
    }
  }
  for (const libPath of core.linkLibs ?? []) {
    prefetchPaths.add(virtualPathToCatalogFile(libPath, catalog));
  }
  if (core.ldscript) {
    prefetchPaths.add(core.ldscript);
  }

  const existing = catalog.files ?? {};
  const prefetchList = [...prefetchPaths].filter((path) => path in existing);

  return {
    libraryIds,
    headerFiles,
    bybyteObjects: objectPaths,
    includePaths: uniqueStrings(includePaths),
    prefetchPaths: prefetchList,
  };
}
