'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ESP_RELEASE = 'esp-v1.0.0';
const ESP_TAR_URL =
  'https://github.com/begeistert/wasm-toolchains/releases/download/esp-v1.0.0/esp32wasm.tar';

const norm = (p) => path.resolve(p).replace(/\\/g, '/');

function paths(root = path.resolve(__dirname, '../..')) {
  const cache = path.join(root, '.cache');
  return {
    root,
    cache,
    tarPath: process.env.ESP32WASM_TAR || path.join(cache, 'esp32wasm.tar'),
    distWeb: path.join(cache, 'esp32-dist-web'),
    release: process.env.ESP32WASM_RELEASE || ESP_RELEASE,
    tarUrl: process.env.ESP32WASM_TAR_URL || ESP_TAR_URL,
  };
}

function downloadTar(p = paths()) {
  if (fs.existsSync(p.tarPath)) return p.tarPath;
  fs.mkdirSync(path.dirname(p.tarPath), { recursive: true });
  console.log(`Downloading ${p.tarUrl} → ${p.tarPath}`);
  execSync(`curl -fsSL "${p.tarUrl}" -o "${p.tarPath}"`, { stdio: 'inherit' });
  return p.tarPath;
}

function ensureTarExtracted(p = paths()) {
  downloadTar(p);
  if (!fs.existsSync(path.join(p.distWeb, 'manifest.json'))) {
    fs.mkdirSync(p.distWeb, { recursive: true });
    execSync(`tar -xf "${p.tarPath}" -C "${p.distWeb}"`, { stdio: 'inherit' });
  }
  return p.distWeb;
}

function virtualToBundleRel(virtualPath) {
  return virtualPath.replace(/^\//, '').replace(/^vfs\//, '').replace(/\\/g, '/');
}

module.exports = {
  ESP_RELEASE,
  ESP_TAR_URL,
  norm,
  paths,
  downloadTar,
  ensureTarExtracted,
  virtualToBundleRel,
};
