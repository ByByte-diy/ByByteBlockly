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

1. Copies the npm toolchain into `src/assets/wasm-avr/` (gitignored)
2. Adds wave **W1–W7** headers (EEPROM, Otto, UART, displays, motors, sensors, audio, Quad, …)
3. Compiles library `.cpp` → `.o` with the packaged WASM `avr-gcc` (no native toolchain)
4. Updates `assets/manifest.json` (`headerFiles`, `includePaths`, `objectGroups.bybyte`)
5. Patches `firmware-builder.js` so web `compile()` sees those extras

`npm run start:web` and `npm run build:web` run this automatically.

Angular serves **only** `src/assets/wasm-avr/` (prepared copy). Do not copy `node_modules/@horang-corp/avr-gcc-wasm` into `/assets/wasm-avr` in `angular.json` — that would overwrite W1/W2 headers, objects and the patched `firmware-builder.js`.

## Waves

| Wave | File | Libraries |
|------|------|-----------|
| W0 | npm package | Servo, Wire, SPI, Firmata, Adafruit* |
| W1 | `libraries.w1.json` | EEPROM.h, Otto, Oscillator, Otto_matrix |
| W2 | `libraries.w2.json` | SoftwareSerial, SerialCommand |
| W3 | `libraries.w3.json` | TM1637, LedControl, NeoPixel, LiquidCrystal_I2C, SH1106, ST7735 |
| W4 | `libraries.w4.json` | Stepper, AFMotor |
| W5 | `libraries.w5.json` | RTClib, IRremote, BME280, MPU6050, TCS34725, HMC5883, MFRC522, PN532, Encoder, APDS9960, PWMServoDriver, TinyGPSPlus, MuVision |
| W6 | `libraries.w6.json` | PlayRtttl (headers), RedMP3, TEA5767 |
| W7 | `libraries.w7.json` | Otto Quad (`Quad` + `Octosnake`; uses Servo/EEPROM from W0/W1) |

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

## Related

- [web-compilation.md](./web-compilation.md) — Angular compiler service
- Source tree: `src/wasm-avr/`
