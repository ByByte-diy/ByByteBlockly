# WASM AVR assets

In-browser AVR compile for Uno/Nano uses `@horang-corp/avr-gcc-wasm` plus ByByte libraries from `src/wasm-avr/libraries`.

## Prepare

```bash
npm run prepare:wasm-avr                        # 328p bundle (default)
npm run prepare:wasm-avr -- prepare mega        # Mega bundle
npm run prepare:wasm-avr -- verify w5           # 328p regression
npm run prepare:wasm-avr -- verify mega         # Mega regression
npm run prepare:wasm-avr -- sync w6
```

The `prepare` command:

1. Copies the npm toolchain into `src/assets/wasm/avr-328p/v{version}/` (gitignored)
2. Adds wave **W1–W7** headers (EEPROM, Otto, UART, displays, motors, sensors, audio, Quad, …)
3. Compiles library `.cpp` → `.o` with the packaged WASM `avr-gcc` (no native toolchain)
4. Updates `assets/manifest.json` (`headerFiles`, `includePaths`, `objectGroups.bybyte`)
5. Patches `firmware-builder.js`, `index.js`, and `worker.js` for selective ByByte load

`npm run start:web` and `npm run build:web` run this automatically.

Angular serves **only** `src/assets/wasm-avr/` (prepared copy). Do not copy `node_modules/@horang-corp/avr-gcc-wasm` into `/assets/wasm-avr` in `angular.json` — that would overwrite W1/W2 headers, objects and the patched `firmware-builder.js`.

## Waves

| Wave | Section in `libraries.json` | Libraries |
|------|------|-----------|
| W0 | npm package | Servo, Wire, SPI, Firmata, Adafruit* |
| W1 | `waves[0]` | EEPROM.h, Otto, Oscillator, Otto_matrix |
| W2 | `waves[1]` | SoftwareSerial, SerialCommand |
| W3 | `waves[2]` | TM1637, LedControl, NeoPixel, LiquidCrystal_I2C, SH1106, ST7735 |
| W4 | `waves[3]` | Stepper, AFMotor |
| W5 | `waves[4]` | RTClib, IRremote, BME280, MPU6050, TCS34725, HMC5883, MFRC522, PN532, Encoder, APDS9960, PWMServoDriver, TinyGPSPlus, MuVision |
| W6 | `waves[5]` | PlayRtttl (headers), RedMP3, TEA5767 |
| W7 | `waves[6]` | Otto Quad (`Quad` + `Octosnake`; uses Servo/EEPROM from W0/W1) |

All ByByte waves live in one catalog: `src/wasm-avr/libraries.json` (`{ schemaVersion, waves: [...] }`). After `sync w5`, `generate-w5-catalog.mjs` updates only the W5 section.

## Windows

Native `avr-gcc` is not required. Object compile uses the same WASM binaries as the browser.

`libc.a` in the npm package has no `eeprom_read_byte`. W1 adds `eeprom-avr.cpp` (ATmega328P EECR/EEAR/EEDR).

Verify fixture links (`w1`–`w6` or `all`):

| Wave | Fixtures |
|------|----------|
| w1 | Otto minimal |
| w2 | SoftwareSerial + Otto BT (SerialCommand) |
| w3 | TM1637, NeoPixel, LCD, LedControl, SH1106, ST7735 |
| w4 | Stepper, AFMotor |
| w5 | RTC, BME280, MPU6050, MFRC522, IR, GPS, Encoder |
| w6 | PlayRtttl, RedMP3, TEA5767 |
| w7 | Otto Quad walk |

Sync vendored sources from `userlibs`: `sync w5`, `sync w6`, or `sync w7`.

Sketches with `Adafruit_GFX` / SSD1306 / SH1106 / ST7735 need the **OLED** sensor flag at link time (`lib_GFX.o` from npm). `detectWasmSensors()` in `modules/wasm-compiler/utils/wasm-library-resolver.ts` sets this automatically from `#include` lines.

## Cache & versioning (F0)

`prepare:wasm-avr` also generates:

- `src/assets/wasm/avr-328p/v{version}/wasm-catalog.json` — per-file SHA-256 + library tiers
- `src/assets/cache-manifest.json` — bundle version/hash for client invalidation

Runtime: `AssetCacheRegistry` validates on app boot; `WasmAssetProvider` / `WasmMegaAssetProvider` (`@modules/wasm-compiler`) before compile. IndexedDB keys: `{bundleId}:{fileSha256}:{path}`.

## Lazy libraries (F1)

Compile no longer loads every ByByte header/object up front:

1. `resolveWasmLibraries(source, catalog)` — `modules/wasm-compiler/utils/wasm-library-resolver.ts` — parses `#include` lines and maps them to catalog library entries (with `depends`, e.g. Otto → EEPROM, MPU6050 → I2Cdev).
2. Core tier metadata in `wasm-catalog.json` lists stock headers (`headerPaths`), base/oled/tof objects, and link libs — ByByte headers are excluded from `headerPaths`.
3. `Avr328pWasmCompilerStrategy` / `AvrMegaWasmCompilerStrategy` prefetch only `prefetchPaths` (tools, glue, resolved headers/objects) via `WasmAssetProvider` + IndexedDB, then call `compile({ selectiveLoad })`.
4. Patched runtime passes `selectiveLoad` to `buildFirmware`, which loads only the requested headers/objects.

Blink (Arduino.h only) skips all ByByte library assets; Stepper pulls just Stepper headers + `.o`.

## Lazy tiers (F2)

Deploy layout:

```
src/assets/
  cache-manifest.json          # bundled in production build
  wasm/avr-328p/v{version}/    # lazy fetch (excluded from production bundle)
```

When user selects a supported AVR board, `WasmBoardPrefetchService` (`platform/web/services/`) prefetches **tools** then **core** (glue, manifest, base objects, ldscript) into IndexedDB in the background. Family (328p vs Mega) визначає `WasmCompilerRegistry`.

Production `ng build` ships only `cache-manifest.json` from assets; WASM files are fetched from static host/CDN at runtime.

## Mega2560 (ATmega2560)

328p uses `@horang-corp/avr-gcc-wasm` (monolithic driver + `compile({ selectiveLoad })`).
Mega uses [wasm-toolchains](https://github.com/begeistert/wasm-toolchains)
release [`avr-v1.0.0`](https://github.com/begeistert/wasm-toolchains/releases/tag/avr-v1.0.0) (`avrwasm.tar`).

| | 328p (horang) | Mega (wasm-toolchains) |
|---|---------------|------------------------|
| Bundle | `wasm-avr-328p` | `wasm-avr-mega` |
| MCU / multilib | `atmega328p` / avr5 | `atmega2560` / avr6 |
| Browser API | `compile({ selectiveLoad })` | `compile({ board: 'mega', selectiveLoad })` via `index.js` |
| Dist layout | tools at bundle root | web tar: `tools/*`, `sysroot/`, `arduino-core/`, `manifest.json` |

**Prerequisites:** `avrwasm.tar` in `.cache/` and wasm-toolchains tag `avr-v1.0.0` in `.cache/wasm-toolchains` (see `wasm-toolchains-dist.cjs`).

### Prepare Mega bundle

```bash
npm run prepare:wasm-avr -- prepare mega
```

Pipeline:

1. Copy `avrwasm.tar` layout into `src/assets/wasm/avr-mega/v{version}/`
2. Overlay ByByte W1–W7 headers (`libraries/…`, `arduino/libraries/…`)
3. Precompile **69** library `.o` for **avr6** via `compile-mega-library-object.cjs` (wasm-toolchains `AvrToolchain`, board `mega`)
4. Write `bybyte-manifest.json` + `wasm-catalog.json`
5. Merge `wasm-avr-mega` into `src/assets/cache-manifest.json` (328p entry preserved)

Bundle ID: `wasm-avr-mega`. Example version: `1.0.0+W1+…+W7` → deploy dir `v1.0.0-W1-W2-W3-W4-W5-W6-W7/`.

### Web compile (F3.3)

- `WasmCompilerService` routes Mega FQBN → `AvrMegaWasmCompilerStrategy`
- Browser glue: `mega-browser/index.js` (copied to bundle root as `index.js`)
- Lazy prefetch: `WasmMegaAssetProvider` + `WasmBoardPrefetchService` on board select
- Run `npm run prepare:wasm-avr -- prepare mega` before `ng serve` when testing Mega

### Verify Mega (F3.5)

Node regression tests (same selective `.o` link model as the browser):

```bash
npm run prepare:wasm-avr -- verify mega         # Blink + Otto + Stepper + Quad
npm run prepare:wasm-avr -- verify mega-w7      # Quad only
npm run prepare:wasm-avr -- verify mega-w1      # Otto only
```

Fixtures live in `src/wasm-avr/fixtures/` (`blink-minimal.cpp`, `otto-minimal.cpp`, `stepper-minimal.cpp`, `quad-minimal.cpp`). Harness: `verify-mega-build.cjs` + `verify-mega.mjs`.

## Angular module map

| Шар | Шлях | Роль |
|-----|------|------|
| Portable compile | `modules/wasm-compiler/` | Strategies, registry, assets, sketch prep, library resolver |
| Browser runtime | `platform/web/services/browser-wasm-runtime.port.ts` | `WasmRuntimePort` для Chromium |
| Prefetch | `platform/web/services/wasm-board-prefetch.service.ts` | Lazy tools/core на виборі плати |
| Wiring | `platform/web/web-platform.module.ts` | `WasmCompilerModule.forRoot` + `ICompiler` binding |
| Asset cache | `modules/asset-cache/` | IndexedDB, `cache-manifest.json` validation |

Prepare scripts і fixtures — `src/wasm-avr/` (не Angular). Generated bundles — `src/assets/wasm/{avr-328p,avr-mega}/` (gitignored).

## Related

- [web-compilation.md](./web-compilation.md) — Web wiring і compile flow
- [architecture/platform-adapters.md](../architecture/platform-adapters.md) — `ICompiler` / platform tokens
- Source tree: `src/wasm-avr/`
- Shared dist helpers: `src/wasm-avr/wasm-toolchains-dist.cjs`
