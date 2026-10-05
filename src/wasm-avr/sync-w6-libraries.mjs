#!/usr/bin/env node
/**
 * Copy W6 audio libraries from compilation/userlibs (and TEA5767N.cpp when missing).
 */
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const USERLIBS = join(ROOT, 'compilation/arduino/userlibs/libraries');
const OUT = join(__dirname, 'libraries');

async function copyFile(from, to) {
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to);
}

async function copyPair(fromRel, toRel, files) {
  for (const file of files) {
    await copyFile(join(USERLIBS, fromRel, file), join(OUT, toRel, file));
  }
}

async function ensureTea5767Cpp() {
  const cppPath = join(OUT, 'TEA5767/TEA5767N.cpp');
  try {
    await readFile(cppPath, 'utf8');
    return;
  } catch {
    // userlibs only ships the header; fetch implementation from upstream.
  }
  const urls = [
    'https://raw.githubusercontent.com/mroger/TEA5767/master/TEA5767N.cpp',
    'https://raw.githubusercontent.com/rydepier/TEA5767-FM-Radio-with-Arduino/master/TEA5767_Master_Library/TEA5767/TEA5767N.cpp',
  ];
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) continue;
    await mkdir(dirname(cppPath), { recursive: true });
    await writeFile(cppPath, await res.text());
    return;
  }
  throw new Error('Could not download TEA5767N.cpp');
}

async function main() {
  await copyPair('PlayRtttl-master/src', 'PlayRtttl', [
    'PlayRtttl.h',
    'PlayRtttl.hpp',
    'pitches.h',
  ]);
  await copyPair('OPEN-SMART-RedMP3-master', 'RedMP3', ['RedMP3.h', 'RedMP3.cpp']);
  await copyPair('TEA5767', 'TEA5767', ['TEA5767N.h']);
  await ensureTea5767Cpp();

  console.log('W6 libraries synced to', OUT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
