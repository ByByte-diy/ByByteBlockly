#!/usr/bin/env node
import http from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFirmware, setAssetsBase } from '../assets/wasm-avr/firmware-builder.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEST = join(ROOT, 'src/assets/wasm-avr');
const FIXTURES = [
  { name: 'RTClib', file: 'rtc-minimal.cpp' },
  { name: 'BME280', file: 'bme280-minimal.cpp' },
  { name: 'MPU6050', file: 'mpu6050-minimal.cpp' },
  { name: 'MFRC522', file: 'mfrc522-minimal.cpp' },
  { name: 'IRremote', file: 'irremote-minimal.cpp' },
  { name: 'TinyGPSPlus', file: 'tinypgps-minimal.cpp' },
  { name: 'Encoder', file: 'encoder-minimal.cpp' },
];
const PORT = 4180;
const MIME = {
  '.wasm': 'application/wasm',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.o': 'application/octet-stream',
  '.a': 'application/octet-stream',
  '.xn': 'text/plain',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = join(DEST, urlPath.replace(/^\//, ''));
  if (!filePath.startsWith(DEST) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
setAssetsBase(`http://127.0.0.1:${PORT}/`);

let failed = false;

try {
  for (const fixture of FIXTURES) {
    const source = readFileSync(join(ROOT, 'src/wasm-avr/fixtures', fixture.file), 'utf8');
    const result = await buildFirmware({
      source,
      assetsBase: `http://127.0.0.1:${PORT}/`,
    });
    console.log(
      `${fixture.name} W5 verify: flash=${result.flashBytes} fits=${result.fitsTarget} hex=${result.hex.length}`,
    );
    if (!result.hex.startsWith(':') || !result.fitsTarget) {
      failed = true;
    }
  }
} catch (error) {
  console.error(error.message);
  failed = true;
} finally {
  server.close();
}

if (failed) {
  process.exitCode = 1;
}
