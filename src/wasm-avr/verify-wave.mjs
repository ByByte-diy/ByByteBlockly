#!/usr/bin/env node
import http from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveAvr328pBundleDir } from './wasm-bundle-paths.mjs';

/** @typedef {{ name: string; file: string; sensorFlags?: string[] }} VerifyFixture */

/** @typedef {{ port: number; fixtures: VerifyFixture[] }} VerifyWaveConfig */

/** @type {Record<string, VerifyWaveConfig>} */
export const VERIFY_WAVES = {
  w1: {
    port: 4176,
    fixtures: [{ name: 'Otto', file: 'otto-minimal.cpp' }],
  },
  w2: {
    port: 4177,
    fixtures: [
      { name: 'SoftwareSerial', file: 'softwareserial-minimal.cpp' },
      { name: 'Otto BT (SerialCommand)', file: 'otto-bt-minimal.cpp' },
    ],
  },
  w3: {
    port: 4178,
    fixtures: [
      { name: 'TM1637', file: 'tm1637-minimal.cpp' },
      { name: 'NeoPixel', file: 'neopixel-minimal.cpp' },
      { name: 'LiquidCrystal I2C', file: 'lcd-i2c-minimal.cpp' },
      { name: 'LedControl', file: 'ledcontrol-minimal.cpp' },
      { name: 'SH1106', file: 'sh1106-minimal.cpp', sensorFlags: ['OLED'] },
      { name: 'ST7735', file: 'st7735-minimal.cpp', sensorFlags: ['OLED'] },
    ],
  },
  w4: {
    port: 4179,
    fixtures: [
      { name: 'Stepper', file: 'stepper-minimal.cpp' },
      { name: 'AFMotor', file: 'afmotor-minimal.cpp' },
    ],
  },
  w5: {
    port: 4180,
    fixtures: [
      { name: 'RTClib', file: 'rtc-minimal.cpp' },
      { name: 'BME280', file: 'bme280-minimal.cpp' },
      { name: 'MPU6050', file: 'mpu6050-minimal.cpp' },
      { name: 'MFRC522', file: 'mfrc522-minimal.cpp' },
      { name: 'IRremote', file: 'irremote-minimal.cpp' },
      { name: 'TinyGPSPlus', file: 'tinypgps-minimal.cpp' },
      { name: 'Encoder', file: 'encoder-minimal.cpp' },
    ],
  },
  w6: {
    port: 4181,
    fixtures: [
      { name: 'PlayRtttl', file: 'playrtttl-minimal.cpp' },
      { name: 'RedMP3', file: 'redmp3-minimal.cpp' },
      { name: 'TEA5767', file: 'tea5767-minimal.cpp' },
    ],
  },
  w7: {
    port: 4182,
    fixtures: [{ name: 'Quad', file: 'quad-minimal.cpp' }],
  },
};

const MIME = {
  '.wasm': 'application/wasm',
  '.mjs': 'text/javascript',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.o': 'application/octet-stream',
  '.a': 'application/octet-stream',
  '.xn': 'text/plain',
};

/**
 * @param {string} rootDir
 */
async function loadVerifyBundle(rootDir) {
  const dest = await resolveAvr328pBundleDir(rootDir);
  const moduleUrl = pathToFileURL(join(dest, 'firmware-builder.js')).href;
  const runtime = await import(moduleUrl);
  return {
    dest,
    buildFirmware: runtime.buildFirmware,
    setAssetsBase: runtime.setAssetsBase,
    SENSOR: runtime.SENSOR,
  };
}

/**
 * @param {string} assetsDir
 * @param {number} port
 */
function startStaticServer(assetsDir, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = join(assetsDir, urlPath.replace(/^\//, ''));
    if (!filePath.startsWith(assetsDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

/**
 * @param {Record<string, unknown>} sensorEnum
 * @param {string[] | undefined} flags
 */
function resolveSensorFlags(sensorEnum, flags) {
  if (!flags?.length) {
    return [];
  }
  return flags.map((flag) => {
    const value = sensorEnum[flag];
    if (value === undefined) {
      throw new Error(`Unknown sensor flag: ${flag}`);
    }
    return value;
  });
}

/**
 * @param {string} waveKey
 */
export async function verifyWave(waveKey) {
  const key = waveKey?.toLowerCase();
  const config = VERIFY_WAVES[key];
  if (!config) {
    throw new Error(`Unknown verify wave: ${waveKey}`);
  }

  const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
  const { dest, buildFirmware, setAssetsBase, SENSOR } = await loadVerifyBundle(rootDir);
  const assetsBase = `http://127.0.0.1:${config.port}/`;
  const waveLabel = key.toUpperCase();
  const fixturesDir = join(rootDir, 'src/wasm-avr/fixtures');

  const server = await startStaticServer(dest, config.port);
  setAssetsBase(assetsBase);

  let failed = false;

  try {
    for (const fixture of config.fixtures) {
      const source = readFileSync(join(fixturesDir, fixture.file), 'utf8');
      const result = await buildFirmware({
        source,
        sensors: resolveSensorFlags(SENSOR, fixture.sensorFlags),
        assetsBase,
      });
      console.log(
        `${fixture.name} ${waveLabel} verify: flash=${result.flashBytes} fits=${result.fitsTarget} hex=${result.hex.length}`,
      );
      if (!result.hex.startsWith(':') || !result.fitsTarget) {
        failed = true;
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    failed = true;
  } finally {
    server.close();
  }

  return failed ? 1 : 0;
}
