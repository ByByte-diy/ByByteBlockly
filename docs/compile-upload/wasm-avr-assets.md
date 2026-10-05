# WASM AVR assets

In-browser AVR compile for Uno/Nano uses `@horang-corp/avr-gcc-wasm` plus ByByte libraries from `src/wasm-avr/libraries`.

## Prepare

```bash
npm run prepare:wasm-avr
npm run prepare:wasm-avr -- verify w5
npm run prepare:wasm-avr -- verify all
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

Sketches with `Adafruit_GFX` / SSD1306 / SH1106 / ST7735 need the **OLED** sensor flag at link time (`lib_GFX.o` from npm). The web compiler sets this automatically from `#include` lines.

## Cache & versioning (F0)

`prepare:wasm-avr` also generates:

- `src/assets/wasm/avr-328p/v{version}/wasm-catalog.json` — per-file SHA-256 + library tiers
- `src/assets/cache-manifest.json` — bundle version/hash for client invalidation

Runtime: `AssetCacheRegistry` validates on app boot; `WasmAssetProvider` before compile. IndexedDB keys: `{bundleId}:{fileSha256}:{path}`.

## Lazy libraries (F1)

Compile no longer loads every ByByte header/object up front:

1. `resolveWasmLibraries(source, catalog)` parses `#include` lines and maps them to catalog library entries (with `depends`, e.g. Otto → EEPROM, MPU6050 → I2Cdev).
2. Core tier metadata in `wasm-catalog.json` lists stock headers (`headerPaths`), base/oled/tof objects, and link libs — ByByte headers are excluded from `headerPaths`.
3. `WebAvrWasmCompilerService` prefetches only `prefetchPaths` (tools, glue, resolved headers/objects) via IndexedDB, then calls `compile({ selectiveLoad })`.
4. Patched runtime passes `selectiveLoad` to `buildFirmware`, which loads only the requested headers/objects.

Blink (Arduino.h only) skips all ByByte library assets; Stepper pulls just Stepper headers + `.o`.

## Lazy tiers (F2)

Deploy layout:

```
src/assets/
  cache-manifest.json          # bundled in production build
  wasm/avr-328p/v{version}/    # lazy fetch (excluded from production bundle)
```

When user selects Uno/Nano, `WasmBoardPrefetchService` prefetches **tools** then **core** (glue, manifest, base objects, ldscript) into IndexedDB in the background.

Production `ng build` ships only `cache-manifest.json` from assets; WASM files are fetched from static host/CDN at runtime.

## Related

- [web-compilation.md](./web-compilation.md) — Angular compiler service
- Source tree: `src/wasm-avr/`
