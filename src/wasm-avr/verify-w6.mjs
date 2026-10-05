#!/usr/bin/env node
import http from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFirmware, setAssetsBase } from '../assets/wasm-avr/firmware-builder.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DEST = join(ROOT, 'src/assets/wasm-avr');
const FIXTURES = [
  { name: 'PlayRtttl', file: 'playrtttl-minimal.cpp' },
  { name: 'RedMP3', file: 'redmp3-minimal.cpp' },
  { name: 'TEA5767', file: 'tea5767-minimal.cpp' },
];
const PORT = 4181;
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
      `${fixture.name} W6 verify: flash=${result.flashBytes} fits=${result.fitsTarget} hex=${result.hex.length}`,
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
