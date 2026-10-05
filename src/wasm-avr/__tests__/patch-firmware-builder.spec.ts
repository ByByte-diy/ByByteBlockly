import { describe, it, expect } from 'vitest';
import { patchFirmwareBuilderSource } from '../patch-wasm-bundle.mjs';

const STOCK = `
async function loadHeaders(fs, manifest, timings) {
  const start = performance.now();
  await Promise.all(manifest.headerFiles.map(async (virtualPath) => {
    writeFile(fs, virtualPath, await fetchBytes(\`/fs\${virtualPath}\`));
  }));
  timings.headersFsMs = performance.now() - start;
}

function selectedObjectPaths(manifest, sensors) {
  return [
    "/objects/core_abi.o",
    ...manifest.objectGroups.base,
    ...(sensors.has(SENSOR.OLED) ? manifest.objectGroups.oled : []),
  ];
}

function compileArgs(sensors) {
  return [
    "-I", "/libraries/Adafruit_Unified_Sensor",
    "/build/HorangFirmware.cpp",
  ];
}

const assembly = await runTool(
  "cc1plus",
  createCc1plus,
  compileArgs(sensors),
  async (fs) => {},
  "/build/HorangFirmware.s",
);
`;

const STOCK_WITH_BUILD = `${STOCK}
async function buildFirmware(opts) {
  const manifest = await getManifest();
  await loadHeaders(fs, manifest, timings);
  const objectPaths = selectedObjectPaths(manifest, sensors);
  const assembly = await runTool(
    "cc1plus",
    createCc1plus,
    compileArgs(sensors),
    async (fs) => {},
    "/build/HorangFirmware.s",
  );
}
`;

describe('patchFirmwareBuilderSource', () => {
  it('adds bybyte objects, includePaths and header concurrency', () => {
    const patched = patchFirmwareBuilderSource(STOCK_WITH_BUILD);

    expect(patched).toContain('objectGroups.bybyte');
    expect(patched).toContain('compileArgs(sensors, includePaths = [])');
    expect(patched).toContain('includePaths || []).flatMap');
    expect(patched).toContain('const concurrency = 8');
  });

  it('wires selectiveLoad into buildFirmware', () => {
    const patched = patchFirmwareBuilderSource(STOCK_WITH_BUILD);

    expect(patched).toContain('opts.selectiveLoad');
    expect(patched).toContain('loadHeaders(fs, manifest, timings, headerFiles)');
    expect(patched).toContain('selectedObjectPaths(manifest, sensors, bybyteObjects)');
    expect(patched).toContain('resolvedIncludePaths ?? manifest.includePaths ?? []');
  });

  it('is idempotent', () => {
    const once = patchFirmwareBuilderSource(STOCK_WITH_BUILD);
    const twice = patchFirmwareBuilderSource(once);
    expect(twice).toBe(once);
  });
});
