#!/usr/bin/env node
/**
 * WASM AVR asset pipeline entry point.
 *
 *   node src/wasm-avr/wasm-avr.mjs              # prepare (default)
 *   node src/wasm-avr/wasm-avr.mjs prepare
 *   node src/wasm-avr/wasm-avr.mjs verify w5
 *   node src/wasm-avr/wasm-avr.mjs verify all
 *   node src/wasm-avr/wasm-avr.mjs sync w6
 */
import { generateW5Catalog } from './generate-w5-catalog.mjs';
import { syncLibraries } from './sync-libraries.mjs';
import { VERIFY_WAVES, verifyWave } from './verify-wave.mjs';

function usage() {
  console.log(`Usage: node src/wasm-avr/wasm-avr.mjs [command] [args]

Commands:
  prepare              Build headers + .o assets (default)
  verify <w1|…|w7|all> Run fixture link tests for a wave
  sync <w5|w6|w7>      Copy vendored libraries from userlibs

Examples:
  npm run prepare:wasm-avr
  npm run prepare:wasm-avr -- verify w5
  npm run prepare:wasm-avr -- verify all
  npm run prepare:wasm-avr -- sync w6
`);
}

async function runPrepare() {
  await import('./prepare-bybyte-assets.mjs');
}

async function runVerify(target) {
  const key = target?.toLowerCase();
  if (!key || key === 'help' || key === '-h' || key === '--help') {
    usage();
    return 1;
  }

  if (key === 'all') {
    let failed = false;
    for (const wave of Object.keys(VERIFY_WAVES)) {
      console.log(`\n=== verify ${wave} ===`);
      const code = await verifyWave(wave);
      if (code !== 0) failed = true;
    }
    return failed ? 1 : 0;
  }

  if (!VERIFY_WAVES[key]) {
    console.error(`Unknown verify target: ${target}`);
    usage();
    return 1;
  }
  return verifyWave(key);
}

async function runSync(target) {
  const key = target?.toLowerCase();
  if (!key || !['w5', 'w6', 'w7'].includes(key)) {
    console.error(`Unknown sync target: ${target}`);
    usage();
    return 1;
  }

  try {
    await syncLibraries(key);
    if (key === 'w5') {
      await generateW5Catalog();
    }
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return 1;
  }
}

const [command = 'prepare', arg] = process.argv.slice(2);

try {
  let exitCode = 0;
  switch (command) {
    case 'prepare':
      await runPrepare();
      break;
    case 'verify':
      exitCode = await runVerify(arg);
      break;
    case 'sync':
      exitCode = await runSync(arg);
      break;
    case 'help':
    case '-h':
    case '--help':
      usage();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      usage();
      exitCode = 1;
  }
  if (exitCode) process.exit(exitCode);
} catch (error) {
  console.error(error);
  process.exit(1);
}
