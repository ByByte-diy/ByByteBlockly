/**
 * Merge ByByte library wave entries into an avr-gcc-wasm manifest.json.
 */
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
  const bybyte = unique([
    ...(baseManifest.objectGroups?.bybyte || []),
    ...(wave.objectPaths || []),
  ]);

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

function unique(values) {
  return [...new Set(values)];
}
