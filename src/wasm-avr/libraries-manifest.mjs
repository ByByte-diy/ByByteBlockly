/**
 * ByByte library catalog: merge wave metadata + read/write libraries.json.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const LIBRARIES_CATALOG_FILE = 'libraries.json';

export function mergeBybyteManifest(baseManifest, wave) {
  if (!baseManifest || !Array.isArray(baseManifest.headerFiles)) {
    throw new Error('Invalid base manifest: headerFiles required');
  }

  const headerFiles = unique([
    ...baseManifest.headerFiles,
    ...(wave.headerFiles || []),
  ]);
  const includePaths = unique([
    ...(baseManifest.includePaths || []),
    ...(wave.includePaths || []),
  ]);
  const baseObjects = new Set(baseManifest.objectGroups?.base || []);
  const bybyte = unique([
    ...(baseManifest.objectGroups?.bybyte || []),
    ...(wave.objectPaths || []),
  ]).filter((objectPath) => !baseObjects.has(objectPath));

  return {
    ...baseManifest,
    headerFiles,
    includePaths,
    objectGroups: {
      ...(baseManifest.objectGroups || {}),
      bybyte,
    },
    bybyte: {
      wave: wave.wave || 'W1',
      generatedAt: wave.generatedAt || new Date().toISOString(),
      libraries: wave.libraries || [],
    },
  };
}

export function flattenWaveCatalog(catalog, resolveFrom) {
  const headerFiles = [];
  const includePaths = [];
  const sources = [];
  const libraries = [];

  for (const lib of catalog.libraries || []) {
    libraries.push(lib.id);
    for (const header of lib.headers || []) {
      headerFiles.push(header.virtual);
    }
    for (const includePath of lib.includePaths || []) {
      includePaths.push(includePath);
    }
    for (const source of lib.sources || []) {
      sources.push({
        id: lib.id,
        from: lib.root ? resolveFrom(lib.root, source.from) : resolveFrom(source.from),
        object: source.object,
      });
    }
  }

  return {
    wave: catalog.wave,
    headerFiles: unique(headerFiles),
    includePaths: unique(includePaths),
    sources,
    libraries,
  };
}

export function resolveCatalogFile(catalog, lib, entry, resolveFrom) {
  if (!entry?.from || !entry?.virtual) {
    throw new Error(`Invalid catalog file entry in ${lib.id}`);
  }
  if (entry.from.includes('/') || entry.from.includes('\\')) {
    return {
      from: resolveFrom(entry.from),
      virtual: entry.virtual,
    };
  }
  if (!lib.root) {
    throw new Error(`${lib.id}: relative file "${entry.from}" needs root`);
  }
  return {
    from: resolveFrom(lib.root, entry.from),
    virtual: entry.virtual,
  };
}

export function mergeWaveCatalogs(catalogs) {
  if (!catalogs?.length) {
    throw new Error('mergeWaveCatalogs: at least one catalog required');
  }
  return {
    wave: catalogs.map((catalog) => catalog.wave).join('+'),
    description: catalogs.map((catalog) => catalog.description).filter(Boolean).join('; '),
    libraries: catalogs.flatMap((catalog) => catalog.libraries || []),
  };
}

/**
 * @param {unknown} document
 * @returns {object[]}
 */
export function waveCatalogsFromDocument(document) {
  if (document && typeof document === 'object' && Array.isArray(document.waves) && document.waves.length) {
    return document.waves;
  }
  if (document && typeof document === 'object' && document.wave && Array.isArray(document.libraries)) {
    return [document];
  }
  throw new Error('Invalid libraries catalog: expected { waves: [...] }');
}

/**
 * @param {string} wasmAvrDir - directory containing libraries.json
 * @returns {Promise<object[]>}
 */
export async function loadWaveCatalogs(wasmAvrDir) {
  const raw = await readFile(join(wasmAvrDir, LIBRARIES_CATALOG_FILE), 'utf8');
  return waveCatalogsFromDocument(JSON.parse(raw));
}

/**
 * @param {string} wasmAvrDir
 * @returns {Promise<object>}
 */
export async function loadMergedCatalog(wasmAvrDir) {
  return mergeWaveCatalogs(await loadWaveCatalogs(wasmAvrDir));
}

/**
 * Replace or append one wave entry in libraries.json.
 * @param {string} wasmAvrDir
 * @param {object} waveCatalog
 */
export async function writeWaveCatalog(wasmAvrDir, waveCatalog) {
  const catalogPath = join(wasmAvrDir, LIBRARIES_CATALOG_FILE);
  const document = JSON.parse(await readFile(catalogPath, 'utf8'));
  const waves = waveCatalogsFromDocument(document);
  const waveKey = waveCatalog.wave?.toUpperCase();
  const index = waves.findIndex((entry) => entry.wave?.toUpperCase() === waveKey);
  if (index >= 0) {
    waves[index] = waveCatalog;
  } else {
    waves.push(waveCatalog);
  }
  document.waves = waves;
  await writeFile(catalogPath, `${JSON.stringify(document, null, 2)}\n`);
}

function unique(values) {
  return [...new Set(values)];
}
