#!/usr/bin/env node
/**
 * ESP32 WASM asset pipeline (F4 spike).
 *
 *   node src/wasm-esp/wasm-esp.mjs prepare
 *   node src/wasm-esp/wasm-esp.mjs verify [blink]
 */
import { verifyEsp32 } from './verify-esp32.mjs';

function usage() {
  console.log(`Usage: node src/wasm-esp/wasm-esp.mjs [command] [args]

Commands:
  prepare              Extract esp32wasm.tar → src/assets/wasm/esp32/
  verify [blink]       Node harness compile (default fixture: blink)

Examples:
  npm run prepare:wasm-esp
  npm run prepare:wasm-esp -- verify blink
`);
}

async function runPrepare() {
  await import('./prepare-esp32-assets.mjs');
}

async function main() {
  const [command = 'prepare', arg] = process.argv.slice(2);

  if (command === 'help' || command === '-h' || command === '--help') {
    usage();
    return 0;
  }

  if (command === 'prepare') {
    await runPrepare();
    return 0;
  }

  if (command === 'verify') {
    return verifyEsp32(arg || 'blink');
  }

  console.error(`Unknown command: ${command}`);
  usage();
  return 1;
}

main()
  .then((code) => {
    if (code) process.exit(code);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
