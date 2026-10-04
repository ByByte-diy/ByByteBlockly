import { describe, it, expect } from 'vitest';
import { patchFirmwareBuilderSource } from '../patch-firmware-builder.mjs';

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

describe('patchFirmwareBuilderSource', () => {
  it('adds bybyte objects, includePaths and header concurrency', () => {
    const patched = patchFirmwareBuilderSource(STOCK);

    expect(patched).toContain('objectGroups.bybyte');
    expect(patched).toContain('compileArgs(sensors, includePaths = [])');
    expect(patched).toContain('compileArgs(sensors, manifest.includePaths || [])');
    expect(patched).toContain('includePaths || []).flatMap');
    expect(patched).toContain('const concurrency = 8');
  });

  it('is idempotent', () => {
    const once = patchFirmwareBuilderSource(STOCK);
    const twice = patchFirmwareBuilderSource(once);
    expect(twice).toBe(once);
  });
});
