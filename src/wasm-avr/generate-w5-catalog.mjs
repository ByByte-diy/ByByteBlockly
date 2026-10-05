#!/usr/bin/env node
import { readdir, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = join(__dirname, 'libraries');

function objectName(stem) {
  return `/objects/lib_${stem.replace(/[^A-Za-z0-9_]+/g, '_')}.o`;
}

function lib(id, folder, virtualBase, extraHeaders = []) {
  const root = `src/wasm-avr/libraries/${folder}`;
  const abs = join(LIB_ROOT, folder);
  const headers = [...extraHeaders];
  const sources = [];

  async function walk(dir, virtualDir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const absPath = join(dir, entry.name);
      const virtualPath = `${virtualDir}/${entry.name}`.replace(/\\/g, '/');
      if (entry.isDirectory()) {
        await walk(absPath, virtualPath);
        continue;
      }
      if (entry.name.endsWith('.h') || entry.name.endsWith('.hpp')) {
        headers.push({
          from: `src/wasm-avr/libraries/${folder}/${relative(join(LIB_ROOT, folder), absPath).replace(/\\/g, '/')}`,
          virtual: virtualPath,
        });
      } else if (entry.name.endsWith('.cpp') || entry.name.endsWith('.c')) {
        const stem = basename(entry.name, entry.name.endsWith('.cpp') ? '.cpp' : '.c');
        sources.push({
          from: relative(join(LIB_ROOT, folder), absPath).replace(/\\/g, '/'),
          object: objectName(`${id}_${stem}`),
        });
      }
    }
  }

  return {
    id,
    root,
    headers,
    includePaths: [virtualBase],
    sources,
    walk: () => walk(abs, virtualBase),
  };
}

async function buildSimple(id, folder, virtualBase, files) {
  const root = `src/wasm-avr/libraries/${folder}`;
  return {
    id,
    root,
    headers: files
      .filter((f) => f.endsWith('.h'))
      .map((file) => ({
        from: file,
        virtual: `${virtualBase}/${file}`,
      })),
    includePaths: [virtualBase],
    sources: files
      .filter((f) => f.endsWith('.cpp'))
      .map((file) => ({
        from: file,
        object: objectName(`${id}_${basename(file, '.cpp')}`),
      })),
  };
}

async function main() {
  const defs = [
    await buildSimple('RTClib', 'RTClib', '/libraries/RTClib', ['RTClib.h', 'RTClib.cpp']),
    await buildSimple('BME280', 'BME280', '/libraries/BME280', ['BME280.h', 'BME280.cpp']),
    await buildSimple('Encoder', 'Encoder', '/libraries/Encoder', [
      'Encoder.h',
      'Encoder.cpp',
    ]),
    lib('I2Cdev', 'MPU6050', '/libraries/MPU6050'),
    lib('IRremote', 'IRremote/src', '/libraries/IRremote/src'),
    lib('MuVisionSensor', 'MuVisionSensor', '/libraries/MuVisionSensor'),
    lib('NDEF', 'NDEF', '/libraries/NDEF'),
    lib('MFRC522', 'MFRC522', '/libraries/MFRC522'),
    await buildSimple('TinyGPSPlus', 'TinyGPSPlus', '/libraries/TinyGPSPlus', [
      'TinyGPSPlus.h',
      'TinyGPSPlus.cpp',
    ]),
    await buildSimple('Adafruit_TCS34725', 'Adafruit_TCS34725', '/libraries/Adafruit_TCS34725', [
      'Adafruit_TCS34725.h',
      'Adafruit_TCS34725.cpp',
    ]),
    await buildSimple(
      'Adafruit_HMC5883_U',
      'Adafruit_HMC5883_Unified',
      '/libraries/Adafruit_HMC5883_Unified',
      ['Adafruit_HMC5883_U.h', 'Adafruit_HMC5883_U.cpp'],
    ),
    await buildSimple('Adafruit_APDS9960', 'Adafruit_APDS9960', '/libraries/Adafruit_APDS9960', [
      'Adafruit_APDS9960.h',
      'Adafruit_APDS9960.cpp',
    ]),
    await buildSimple(
      'Adafruit_PWMServoDriver',
      'Adafruit_PWMServoDriver',
      '/libraries/Adafruit_PWMServoDriver',
      ['Adafruit_PWMServoDriver.h', 'Adafruit_PWMServoDriver.cpp'],
    ),
    await buildSimple('PN532', 'PN532', '/libraries/PN532', [
      'PN532.h',
      'PN532.cpp',
      'PN532Interface.h',
      'PN532_debug.h',
    ]),
    await buildSimple('PN532_I2C', 'PN532_I2C', '/libraries/PN532_I2C', [
      'PN532_I2C.h',
      'PN532_I2C.cpp',
    ]),
  ];

  const libraries = [];
  for (const def of defs) {
    if (def.walk) {
      await def.walk();
      delete def.walk;
    }
    libraries.push(def);
  }

  // MPU6050 split: I2Cdev + MPU6050 from same folder
  const mpuIdx = libraries.findIndex((l) => l.id === 'I2Cdev');
  const mpu = libraries[mpuIdx];
  const i2cSources = mpu.sources.filter((s) => s.from.includes('I2Cdev'));
  const mpuSources = mpu.sources.filter((s) => s.from.includes('MPU6050'));
  libraries[mpuIdx] = {
    id: 'I2Cdev',
    root: mpu.root,
    headers: mpu.headers.filter((h) => h.virtual.includes('I2Cdev')),
    includePaths: mpu.includePaths,
    sources: i2cSources.map((s) => ({ ...s, object: objectName('I2Cdev') })),
  };
  libraries.splice(mpuIdx + 1, 0, {
    id: 'MPU6050',
    root: mpu.root,
    headers: mpu.headers.filter((h) => h.virtual.includes('MPU6050')),
    includePaths: mpu.includePaths,
    sources: mpuSources.map((s) => ({ ...s, object: objectName('MPU6050') })),
  });

  const mu = libraries.find((l) => l.id === 'MuVisionSensor');
  if (mu) {
    mu.includePaths = [
      '/libraries/MuVisionSensor',
      '/libraries/MuVisionSensor/MorpxProtocolAnalysis',
      '/libraries/MuVisionSensor/DebugTool',
    ];
  }

  // Encoder utility headers
  const enc = libraries.find((l) => l.id === 'Encoder');
  enc.headers.push(
    ...['utility/direct_pin_read.h', 'utility/interrupt_config.h', 'utility/interrupt_pins.h'].map(
      (file) => ({
        from: `src/wasm-avr/libraries/Encoder/${file}`,
        virtual: `/libraries/Encoder/${file}`,
      }),
    ),
  );

  const catalog = {
    wave: 'W5',
    description:
      'Sensing: RTC, IR, env, motion, color, compass, RFID/NFC, encoder, APDS9960, PCA9685, GPS, MuVision',
    libraries,
  };

  await writeFile(join(__dirname, 'libraries.w5.json'), `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote libraries.w5.json (${libraries.length} libraries)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
