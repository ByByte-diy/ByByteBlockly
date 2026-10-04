#!/usr/bin/env node
/**
 * Phase 0 spike: can @horang-corp/avr-gcc-wasm compile ByByte AVR sketches?
 *
 * Usage: node src/wasm-avr/spike/run-spike.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSpikeFirmware, setSpikeAssetsBase } from './extended-firmware-builder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const PKG_ROOT = path.join(REPO_ROOT, 'node_modules/@horang-corp/avr-gcc-wasm');
const FIXTURES = path.join(__dirname, 'fixtures');
const OTTO_LIB = path.join(REPO_ROOT, 'src/wasm-avr/libraries/Otto');
const PORT = 4174;

const MIME = {
  '.wasm': 'application/wasm',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.cpp': 'text/plain',
  '.h': 'text/plain',
  '.o': 'application/octet-stream',
  '.a': 'application/octet-stream',
  '.xn': 'text/plain',
};

function readFixture(name) {
  return fs.readFileSync(path.join(FIXTURES, name), 'utf8');
}

function readOttoFile(name) {
  return fs.readFileSync(path.join(OTTO_LIB, name));
}

function startStaticServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(root, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function buildOttoFsFiles() {
  const files = [
    'Oscillator.h',
    'Oscillator.cpp',
    'Otto.h',
    'Otto.cpp',
    'Otto_gestures.h',
    'Otto_mouths.h',
    'Otto_sounds.h',
    'Otto_matrix.h',
    'Otto_matrix.cpp',
  ];
  const extraFsFiles = {};
  for (const name of files) {
    extraFsFiles[`/libraries/Otto/${name}`] = readOttoFile(name);
  }
  // Arduino AVR EEPROM wrapper is not shipped in avr-gcc-wasm assets.
  extraFsFiles['/arduino/libraries/EEPROM/src/EEPROM.h'] = fs.readFileSync(
    path.join(FIXTURES, 'EEPROM.h'),
  );
  return extraFsFiles;
}

function ottoBuildOptions(source) {
  return {
    source,
    extraIncludePaths: ['/libraries/Otto', '/arduino/libraries/EEPROM/src'],
    extraFsFiles: buildOttoFsFiles(),
  };
}

/** Unity-build Otto sources into one TU (no prebuilt lib_Otto.o yet). */
function buildOttoUnitySource() {
  const cppFiles = ['Oscillator.cpp', 'Otto_matrix.cpp', 'Otto.cpp'];
  let unity =
    '#include <avr/eeprom.h>\n' +
    'extern "C" uint8_t eeprom_read_byte(const uint8_t* addr) { return 0; }\n' +
    'extern "C" void eeprom_write_byte(uint8_t* addr, uint8_t value) { (void)addr; (void)value; }\n\n';
  unity += readFixture('otto-minimal.cpp') + '\n';
  for (const name of cppFiles) {
    unity += `\n// --- ${name} ---\n`;
    unity += readOttoFile(name).toString('utf8');
    unity += '\n';
  }
  return unity;
}

async function runCase(name, buildFn) {
  const started = performance.now();
  try {
    const result = await buildFn();
    const ms = Math.round(performance.now() - started);
    const ok = result.fitsTarget && result.hex.startsWith(':');
    console.log(`\n[${ok ? 'PASS' : 'WARN'}] ${name}`);
    console.log(`  flash: ${result.flashBytes} bytes (fits Uno: ${result.fitsTarget})`);
    console.log(`  time:  ${ms} ms (builder: ${Math.round(result.timings.totalMs)} ms)`);
    console.log(`  hex:   ${result.hex.split('\n')[0]}… (${result.hex.length} chars)`);
    if (result.stderr.length) {
      console.log(`  stderr tail: ${result.stderr.slice(-3).join(' | ')}`);
    }
    return { name, ok, result, error: null };
  } catch (error) {
    const ms = Math.round(performance.now() - started);
    console.log(`\n[FAIL] ${name} (${ms} ms)`);
    console.log(`  ${error.message}`);
    if (error.stack) {
      console.log(error.stack.split('\n').slice(0, 6).join('\n'));
    }
    return { name, ok: false, result: null, error };
  }
}

async function main() {
  if (!fs.existsSync(PKG_ROOT)) {
    console.error('Missing @horang-corp/avr-gcc-wasm. Run: npm install @horang-corp/avr-gcc-wasm --save-dev --legacy-peer-deps');
    process.exit(1);
  }

  const server = await startStaticServer(PKG_ROOT);
  setSpikeAssetsBase(`http://127.0.0.1:${PORT}/`);

  console.log('AVR WASM Phase 0 spike');
  console.log(`Serving ${PKG_ROOT} at http://127.0.0.1:${PORT}/`);

  const results = [];

  results.push(
    await runCase('1. Blink (Arduino core only)', () =>
      buildSpikeFirmware({ source: readFixture('blink.cpp') })),
  );

  results.push(
    await runCase('2. Servo (bundled lib_Servo.o)', () =>
      buildSpikeFirmware({ source: readFixture('servo.cpp') })),
  );

  const ottoHeadersOnly = await runCase('3a. Otto headers only (expect link fail without .o)', () =>
    buildSpikeFirmware(ottoBuildOptions(readFixture('otto-minimal.cpp'))));
  ottoHeadersOnly.expectedFail = true;
  results.push(ottoHeadersOnly);

  results.push(
    await runCase('3b. Otto unity-build (all .cpp in one TU)', () =>
      buildSpikeFirmware(ottoBuildOptions(buildOttoUnitySource()))),
  );

  server.close();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok && !r.expectedFail).length;
  const expectedFails = results.filter((r) => r.expectedFail && !r.ok).length;

  console.log('\n--- Summary ---');
  console.log(
    `Passed: ${passed}/${results.length}, Failed: ${failed}, Expected fails: ${expectedFails}`,
  );

  const blinkOk = results[0]?.ok;
  const servoOk = results[1]?.ok;
  const ottoUnityOk = results[3]?.ok;

  console.log('\n--- Go / No-Go ---');
  if (blinkOk && servoOk && ottoUnityOk) {
    console.log('GO (with caveats): WASM can compile basic + Servo + Otto via unity-build.');
    console.log('Next: prebuild Otto .o via prepare-assets pipeline, .ino preprocess, Mega/ESP → remote.');
  } else if (blinkOk && servoOk) {
    console.log('PARTIAL: WASM works for Blink/Servo. Otto needs more asset pipeline work or remote fallback.');
  } else if (blinkOk) {
    console.log('PARTIAL: WASM works for Blink only. Servo/Otto blocked.');
  } else {
    console.log('NO-GO for WASM in this environment. Use remote arduino-cli for web.');
  }

  process.exit(failed > 0 && !blinkOk ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
