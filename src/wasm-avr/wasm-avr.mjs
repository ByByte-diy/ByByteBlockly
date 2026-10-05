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
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

const VERIFY = {
  w1: 'verify-w1.mjs',
  w2: 'verify-w2.mjs',
  w3: 'verify-w3.mjs',
  w4: 'verify-w4.mjs',
  w5: 'verify-w5.mjs',
  w6: 'verify-w6.mjs',
  w7: 'verify-w7.mjs',
};

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

function runNode(script, args = []) {
  const result = spawnSync(process.execPath, [join(__dirname, script), ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (result.error) {
    throw result.error;
  }
  return result.status ?? 1;
}

async function runPrepare() {
  await import('./prepare-bybyte-assets.mjs');
}

function runVerify(target) {
  const key = target?.toLowerCase();
  if (!key || key === 'help' || key === '-h' || key === '--help') {
    usage();
    return 1;
  }

  if (key === 'all') {
    let failed = false;
    for (const wave of Object.keys(VERIFY)) {
      console.log(`\n=== verify ${wave} ===`);
      const code = runNode(VERIFY[wave]);
      if (code !== 0) failed = true;
    }
    return failed ? 1 : 0;
  }

  const script = VERIFY[key];
  if (!script) {
    console.error(`Unknown verify target: ${target}`);
    usage();
    return 1;
  }
  return runNode(script);
}

function runSync(target) {
  const key = target?.toLowerCase();
  if (key === 'w5') {
    let code = runNode('sync-w5-libraries.mjs');
    if (code !== 0) return code;
    return runNode('generate-w5-catalog.mjs');
  }
  if (key === 'w6') {
    return runNode('sync-w6-libraries.mjs');
  }
  if (key === 'w7') {
    return runNode('sync-w7-libraries.mjs');
  }

  console.error(`Unknown sync target: ${target}`);
  usage();
  return 1;
}

const [command = 'prepare', arg] = process.argv.slice(2);

try {
  let exitCode = 0;
  switch (command) {
    case 'prepare':
      await runPrepare();
      break;
    case 'verify':
      exitCode = runVerify(arg);
      break;
    case 'sync':
      exitCode = runSync(arg);
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
