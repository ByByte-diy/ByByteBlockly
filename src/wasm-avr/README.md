# WASM AVR assets

In-browser AVR compile for Uno/Nano uses `@horang-corp/avr-gcc-wasm` plus ByByte libraries from `src/wasm-avr/libraries`.

## Prepare

```bash
npm run prepare:wasm-avr
```

The script:

1. Copies the npm toolchain into `src/assets/wasm-avr/` (gitignored)
2. Adds wave **W1** headers (EEPROM, Otto, Oscillator)
3. Compiles Otto `.cpp` → `.o` with the packaged WASM `avr-gcc` (no native toolchain)
4. Updates `assets/manifest.json` (`headerFiles`, `includePaths`, `objectGroups.bybyte`)
5. Patches `firmware-builder.js` so web `compile()` sees those extras

`npm run start:web` and `npm run build:web` run this automatically.

## Waves

| Wave | File | Libraries |
|------|------|-----------|
| W0 | npm package | Servo, Wire, SPI, Firmata, Adafruit* |
| W1 | `libraries.w1.json` | EEPROM.h, Otto, Oscillator, Otto_matrix |
| W2+ | later | SerialCommand, TM1637, … |

## Windows

Native `avr-gcc` is not required. Object compile uses the same WASM binaries as the browser.

`libc.a` in the npm package has no `eeprom_read_byte`. W1 adds `eeprom-avr.cpp` (ATmega328P EECR/EEAR/EEDR).

Verify Otto link:

```bash
npm run verify:wasm-avr-w1
```
