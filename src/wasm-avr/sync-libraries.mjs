#!/usr/bin/env node
/**
 * Copy vendored ByByte libraries from compilation/userlibs into src/wasm-avr/libraries/.
 */
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
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

async function copyTree(fromDir, toDir, filter) {
  await mkdir(toDir, { recursive: true });
  for (const entry of await readdir(fromDir, { withFileTypes: true })) {
    const src = join(fromDir, entry.name);
    const dest = join(toDir, entry.name);
    if (entry.isDirectory()) {
      await copyTree(src, dest, filter);
      continue;
    }
    if (!filter || filter(entry.name)) {
      await copyFile(src, dest);
    }
  }
}

async function copyPair(fromRel, toRel, files) {
  for (const file of files) {
    await copyFile(join(USERLIBS, fromRel, file), join(OUT, toRel, file));
  }
}

export async function syncW5() {
  const codeExt = (name) => /\.(h|hpp|cpp|c)$/i.test(name);

  await copyPair('RTClib', 'RTClib', ['RTClib.h', 'RTClib.cpp']);
  await copyPair('BME280', 'BME280', ['BME280.h', 'BME280.cpp']);
  const bmeCpp = join(OUT, 'BME280/BME280.cpp');
  let bmeSource = await readFile(bmeCpp, 'utf8');
  if (bmeSource.includes('SparkFunBME280.h')) {
    bmeSource = bmeSource.replace('#include "SparkFunBME280.h"', '#include "BME280.h"');
    await writeFile(bmeCpp, bmeSource);
  }
  await copyPair('Encoder', 'Encoder', ['Encoder.h', 'Encoder.cpp']);
  await copyTree(join(USERLIBS, 'Encoder/utility'), join(OUT, 'Encoder/utility'), codeExt);
  const encHeader = join(OUT, 'Encoder/Encoder.h');
  let encH = await readFile(encHeader, 'utf8');
  if (!encH.includes('!defined(ENCODER_OPTIMIZE_INTERRUPTS)\n#define ENCODER_OPTIMIZE_INTERRUPTS')) {
    encH = encH.replace(
      '#include "utility/interrupt_pins.h"\n#ifdef ENCODER_OPTIMIZE_INTERRUPTS',
      `#include "utility/interrupt_pins.h"
#if defined(__AVR__) && !defined(ENCODER_OPTIMIZE_INTERRUPTS)
#define ENCODER_OPTIMIZE_INTERRUPTS
#endif
#ifdef ENCODER_OPTIMIZE_INTERRUPTS`,
    );
    await writeFile(encHeader, encH);
  }

  await copyTree(join(USERLIBS, 'MPU6050/src'), join(OUT, 'MPU6050'), codeExt);

  await copyPair('Adafruit_TCS34725', 'Adafruit_TCS34725', [
    'Adafruit_TCS34725.h',
    'Adafruit_TCS34725.cpp',
  ]);
  const tcsCpp = join(OUT, 'Adafruit_TCS34725/Adafruit_TCS34725.cpp');
  let tcsSource = await readFile(tcsCpp, 'utf8');
  if (tcsSource.includes('float powf(const float x, const float y)')) {
    tcsSource = tcsSource.replace(
      /\/\*![\s\S]*?float powf\(const float x, const float y\) \{\s*return \(float\)\(pow\(\(double\)x, \(double\)y\)\);\s*\}/,
      'namespace {\nfloat tcs34725_powf(const float x, const float y) {\n  return (float)(pow((double)x, (double)y));\n}\n} // namespace',
    );
    tcsSource = tcsSource.replace(/powf\(/g, 'tcs34725_powf(');
    await writeFile(tcsCpp, tcsSource);
  }
  await copyPair('Adafruit_HMC5883_Unified', 'Adafruit_HMC5883_Unified', [
    'Adafruit_HMC5883_U.h',
    'Adafruit_HMC5883_U.cpp',
  ]);
  const hmcCpp = join(OUT, 'Adafruit_HMC5883_Unified/Adafruit_HMC5883_U.cpp');
  let hmcSource = await readFile(hmcCpp, 'utf8');
  if (hmcSource.includes('#include <limits.h>')) {
    hmcSource = hmcSource.replace(/#include <limits.h>\r?\n/, '');
    await writeFile(hmcCpp, hmcSource);
  }
  await copyPair('Adafruit_APDS9960_Library', 'Adafruit_APDS9960', [
    'Adafruit_APDS9960.h',
    'Adafruit_APDS9960.cpp',
  ]);
  const apdsCpp = join(OUT, 'Adafruit_APDS9960/Adafruit_APDS9960.cpp');
  let apdsSource = await readFile(apdsCpp, 'utf8');
  if (apdsSource.includes('float powf(const float x, const float y)')) {
    apdsSource = apdsSource.replace(
      /\/\*![\s\S]*?float powf\(const float x, const float y\) \{\s*return \(float\)\(pow\(\(double\)x, \(double\)y\)\);\s*\}/,
      'namespace {\nfloat apds9960_powf(const float x, const float y) {\n  return (float)(pow((double)x, (double)y));\n}\n} // namespace',
    );
    apdsSource = apdsSource.replace(/powf\(/g, 'apds9960_powf(');
    await writeFile(apdsCpp, apdsSource);
  }
  await copyPair('Adafruit_PWM_Servo_Driver_Library', 'Adafruit_PWMServoDriver', [
    'Adafruit_PWMServoDriver.h',
    'Adafruit_PWMServoDriver.cpp',
  ]);

  await copyTree(join(USERLIBS, 'MFRC522/src'), join(OUT, 'MFRC522'), codeExt);
  await copyTree(join(USERLIBS, 'TinyGPSPLUS/src'), join(OUT, 'TinyGPSPlus'), codeExt);
  const gpsHeader = join(OUT, 'TinyGPSPlus/TinyGPSPlus.h');
  let gpsH = await readFile(gpsHeader, 'utf8');
  if (gpsH.includes('#include <limits.h>')) {
    gpsH = gpsH.replace(
      '#include <limits.h>',
      '#include <stdint.h>\n#ifndef ULONG_MAX\n#define ULONG_MAX 0xFFFFFFFFUL\n#endif',
    );
    await writeFile(gpsHeader, gpsH);
  }

  await copyPair('PN532', 'PN532', [
    'PN532.h',
    'PN532.cpp',
    'PN532Interface.h',
    'PN532_debug.h',
  ]);
  await copyPair('PN532_I2C', 'PN532_I2C', ['PN532_I2C.h', 'PN532_I2C.cpp']);
  await copyTree(join(USERLIBS, 'NDEF'), join(OUT, 'NDEF'), codeExt);

  await copyTree(join(USERLIBS, 'IRremote/src'), join(OUT, 'IRremote/src'), (name) => {
    if (!codeExt(name)) return false;
    return !/^(esp32|nRF5)\.cpp$/i.test(name) && name !== 'sam.cpp';
  });
  await copyTree(join(USERLIBS, 'IRremote/src/private'), join(OUT, 'IRremote/src/private'), codeExt);
  const irBoardDefs = join(OUT, 'IRremote/src/private/IRremoteBoardDefs.h');
  let irDefs = await readFile(irBoardDefs, 'utf8');
  if (!irDefs.includes('BYBYTE_WASM_STUB_ISR')) {
    irDefs = irDefs.replace(
      '#endif // ! IRremoteBoardDefs_h',
      `#if defined(BYBYTE_WASM_STUB_ISR)
// WASM prebuild links all library objects; avoid ISR vector clashes with core Tone.
#  ifdef ISR
#  undef ISR
#  endif
#  define ISR(f) void do_not_use__(void)
#endif

#endif // ! IRremoteBoardDefs_h`,
    );
    await writeFile(irBoardDefs, irDefs);
  }

  await copyTree(join(USERLIBS, 'MuVisionSensor3-1.2.2/src'), join(OUT, 'MuVisionSensor'), codeExt);

  console.log('W5 libraries synced to', OUT);
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

export async function syncW6() {
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

function patchOctosnakeHeader(source) {
  return source
    .replace(/class Oscillator\b/g, 'class OctosnakeOscillator')
    .replace(/Oscillator\(\)/g, 'OctosnakeOscillator()');
}

function patchOctosnakeCpp(source) {
  return source
    .replace(/Oscillator::Oscillator/g, 'OctosnakeOscillator::OctosnakeOscillator')
    .replace(/Oscillator::/g, 'OctosnakeOscillator::');
}

function patchQuadHeader(source) {
  return source.replace(/\bOscillator oscillator\[8\]/g, 'OctosnakeOscillator oscillator[8]');
}

export async function syncW7() {
  const quadSrc = join(USERLIBS, 'Quad');
  const quadOut = join(OUT, 'Quad');
  const files = ['Quad.h', 'Quad.cpp', 'Octosnake.h', 'Octosnake.cpp'];
  for (const file of files) {
    await copyFile(join(quadSrc, file), join(quadOut, file));
  }

  const octoH = join(quadOut, 'Octosnake.h');
  const octoCpp = join(quadOut, 'Octosnake.cpp');
  const quadH = join(quadOut, 'Quad.h');

  await writeFile(octoH, patchOctosnakeHeader(await readFile(octoH, 'utf8')));
  await writeFile(octoCpp, patchOctosnakeCpp(await readFile(octoCpp, 'utf8')));
  await writeFile(quadH, patchQuadHeader(await readFile(quadH, 'utf8')));

  console.log('W7 Quad library synced to', OUT);
}

/**
 * @param {string} waveKey
 */
export async function syncLibraries(waveKey) {
  const key = waveKey?.toLowerCase();
  if (key === 'w5') return syncW5();
  if (key === 'w6') return syncW6();
  if (key === 'w7') return syncW7();
  throw new Error(`Unknown sync wave: ${waveKey}`);
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const waveArg = process.argv[2];
  if (!waveArg) {
    console.error('Usage: node sync-libraries.mjs <w5|w6|w7>');
    process.exit(1);
  }
  syncLibraries(waveArg).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
