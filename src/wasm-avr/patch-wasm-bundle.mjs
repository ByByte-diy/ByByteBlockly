const BYBYTE_OBJECTS = '...(bybyteObjects ?? manifest.objectGroups.bybyte ?? []),';
const INCLUDE_SPREAD = '...(includePaths || []).flatMap((p) => ["-I", p]),';

const LOAD_HEADERS = `async function loadHeaders(fs, manifest, timings, headerFiles) {
  const start = performance.now();
  const concurrency = 8;
  const queue = [...(headerFiles || manifest.headerFiles)];
  async function worker() {
    while (queue.length) {
      const virtualPath = queue.shift();
      writeFile(fs, virtualPath, await fetchBytes(\`/fs\${virtualPath}\`));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  timings.headersFsMs = performance.now() - start;
}`;

const SELECTED_OBJECTS = `function selectedObjectPaths(manifest, sensors, bybyteObjects) {
  return [
    "/objects/core_abi.o",
    ...manifest.objectGroups.base,
    ...(bybyteObjects ?? manifest.objectGroups.bybyte ?? []),
    ...(sensors.has(SENSOR.OLED) ? manifest.objectGroups.oled : []),
    ...(sensors.has(SENSOR.TOF) ? manifest.objectGroups.tof : []),
  ];
}`;

export function patchFirmwareBuilderSource(source) {
  if (
    !source.includes('function compileArgs(sensors)') &&
    !source.includes('function compileArgs(sensors, includePaths = [])')
  ) {
    throw new Error('firmware-builder.js does not contain expected compileArgs(sensors)');
  }
  if (!source.includes('...manifest.objectGroups.base,')) {
    throw new Error('firmware-builder.js does not contain expected objectGroups.base spread');
  }

  let out = source;

  if (!out.includes('bybyteObjects ?? manifest.objectGroups.bybyte')) {
    if (out.includes('...(manifest.objectGroups.bybyte || []),')) {
      out = out.replace(
        '...(manifest.objectGroups.bybyte || []),',
        BYBYTE_OBJECTS,
      );
    } else if (!out.includes('objectGroups.bybyte')) {
      out = out.replace(
        '...manifest.objectGroups.base,',
        `...manifest.objectGroups.base,\n    ${BYBYTE_OBJECTS}`,
      );
    }
  }

  if (!out.includes('function compileArgs(sensors, includePaths = [])')) {
    out = out.replace(
      'function compileArgs(sensors) {',
      'function compileArgs(sensors, includePaths = []) {',
    );
  }

  if (!out.includes('includePaths || []).flatMap')) {
    out = out.replace(
      '"-I", "/libraries/Adafruit_Unified_Sensor",',
      `"-I", "/libraries/Adafruit_Unified_Sensor",\n    ${INCLUDE_SPREAD}`,
    );
  }

  if (!out.includes('headerFiles || manifest.headerFiles')) {
    out = out.replace(
      /async function loadHeaders\(fs, manifest, timings(?:, headerFiles)?\) \{[\s\S]*?timings\.headersFsMs = performance\.now\(\) - start;\r?\n\}(?=\r?\n\r?\nfunction selectedObjectPaths)/,
      LOAD_HEADERS,
    );
  }

  if (!out.includes('function selectedObjectPaths(manifest, sensors, bybyteObjects)')) {
    out = out.replace(
      /function selectedObjectPaths\(manifest, sensors(?:, bybyteObjects)?\) \{\r?\n  return \[[\s\S]*?\];\r?\n\}/,
      SELECTED_OBJECTS,
    );
  }

  if (!out.includes('opts.selectiveLoad')) {
    out = out.replace(
      'const manifest = await getManifest();',
      `const manifest = await getManifest();
  const selective = opts.selectiveLoad || null;
  const headerFiles = selective?.headerFiles;
  const bybyteObjects = selective?.bybyteObjects;
  const resolvedIncludePaths = selective?.includePaths;`,
    );

    out = out.replace(
      'compileArgs(sensors, manifest.includePaths || []),',
      'compileArgs(sensors, resolvedIncludePaths ?? manifest.includePaths ?? []),',
    );
    out = out.replace(
      'compileArgs(sensors),',
      'compileArgs(sensors, resolvedIncludePaths ?? manifest.includePaths ?? []),',
    );

    out = out.replace(
      'await loadHeaders(fs, manifest, timings);',
      'await loadHeaders(fs, manifest, timings, headerFiles);',
    );

    out = out.replace(
      'const objectPaths = selectedObjectPaths(manifest, sensors);',
      'const objectPaths = selectedObjectPaths(manifest, sensors, bybyteObjects);',
    );
  }

  if (
    !out.includes('bybyteObjects ?? manifest.objectGroups.bybyte') ||
    !out.includes('headerFiles || manifest.headerFiles') ||
    !out.includes('opts.selectiveLoad')
  ) {
    throw new Error('Failed to patch firmware-builder.js for selective ByByte load');
  }

  return out;
}

/** Patch index.js to forward selectiveLoad into buildFirmware. */
export function patchIndexSource(source) {
  if (source.includes('selectiveLoad')) {
    return source;
  }

  let out = source.replace(
    'const { source, sensors = [], assetsBase } = options;',
    'const { source, sensors = [], assetsBase, selectiveLoad } = options;',
  );

  out = out.replace(
    'worker.postMessage({ id, source, sensors, assetsBase: assetsBase == null ? undefined : String(assetsBase) });',
    'worker.postMessage({ id, source, sensors, assetsBase: assetsBase == null ? undefined : String(assetsBase), selectiveLoad });',
  );

  if (!out.includes('selectiveLoad')) {
    throw new Error('Failed to patch index.js for selectiveLoad');
  }
  return out;
}

/** Patch worker.js to forward selectiveLoad into buildFirmware. */
export function patchWorkerSource(source) {
  if (source.includes('selectiveLoad')) {
    return source;
  }

  let out = source.replace(
    'const { id, sensors, source, assetsBase } = event.data;',
    'const { id, sensors, source, assetsBase, selectiveLoad } = event.data;',
  );

  out = out.replace(
    'const result = await buildFirmware({ sensors, source, assetsBase });',
    'const result = await buildFirmware({ sensors, source, assetsBase, selectiveLoad });',
  );

  if (!out.includes('selectiveLoad')) {
    throw new Error('Failed to patch worker.js for selectiveLoad');
  }
  return out;
}
