const BYBYTE_OBJECTS = '...(manifest.objectGroups.bybyte || []),';
const INCLUDE_SPREAD = '...(includePaths || []).flatMap((p) => ["-I", p]),';

const HEADER_CONCURRENCY = `async function loadHeaders(fs, manifest, timings) {
  const start = performance.now();
  const concurrency = 8;
  const queue = [...manifest.headerFiles];
  async function worker() {
    while (queue.length) {
      const virtualPath = queue.shift();
      writeFile(fs, virtualPath, await fetchBytes(\`/fs\${virtualPath}\`));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  timings.headersFsMs = performance.now() - start;
}`;

export function patchFirmwareBuilderSource(source) {
  if (source.includes('objectGroups.bybyte') && source.includes('includePaths || []).flatMap')) {
    return source;
  }

  if (!source.includes('function compileArgs(sensors)')) {
    throw new Error('firmware-builder.js does not contain expected compileArgs(sensors)');
  }
  if (!source.includes('...manifest.objectGroups.base,')) {
    throw new Error('firmware-builder.js does not contain expected objectGroups.base spread');
  }

  let out = source;

  if (!out.includes('objectGroups.bybyte')) {
    out = out.replace(
      '...manifest.objectGroups.base,',
      `...manifest.objectGroups.base,\n    ${BYBYTE_OBJECTS}`,
    );
  }

  out = out.replace(
    'function compileArgs(sensors) {',
    'function compileArgs(sensors, includePaths = []) {',
  );
  out = out.replace(
    'compileArgs(sensors),',
    'compileArgs(sensors, manifest.includePaths || []),',
  );

  if (!out.includes('includePaths || []).flatMap')) {
    out = out.replace(
      '"-I", "/libraries/Adafruit_Unified_Sensor",',
      `"-I", "/libraries/Adafruit_Unified_Sensor",\n    ${INCLUDE_SPREAD}`,
    );
  }

  if (!out.includes('const concurrency = 8')) {
    out = out.replace(
      /async function loadHeaders\(fs, manifest, timings\) \{[\s\S]*?timings\.headersFsMs = performance\.now\(\) - start;\r?\n\}/,
      HEADER_CONCURRENCY,
    );
  }

  if (!out.includes('objectGroups.bybyte') || !out.includes('includePaths || []).flatMap')) {
    throw new Error('Failed to patch firmware-builder.js for ByByte assets');
  }

  return out;
}
