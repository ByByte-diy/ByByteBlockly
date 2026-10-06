# WASM toolchains — third-party notices

ByByteBlockly web compile bundles include prebuilt WebAssembly ports of open-source toolchains and Arduino/ESP-IDF libraries.

## AVR (Uno / Nano / Mega)

- **@horang-corp/avr-gcc-wasm** — GCC/binutils for AVR, GPL-3.0 or later  
  See `src/assets/wasm/avr-328p/v0.2.0-W1-W2-W3-W4-W5-W6-W7/THIRD_PARTY_NOTICES.md`

## ESP32

- **wasm-toolchains `esp32wasm`** ([esp-v1.0.0](https://github.com/begeistert/wasm-toolchains/releases/tag/esp-v1.0.0)) — Xtensa GCC, GNU binutils objcopy, Arduino-ESP32 3.x core and IDF prebuilt libraries (GPL-2.0 / LGPL / other licenses per component)

## Mega AVR

- **wasm-toolchains `avrwasm`** — AVR GCC for ATmega2560 (avr6 multilib), same license family as AVR bundle above

For corresponding source requests, refer to the upstream repositories and Arduino-ESP32 / ESP-IDF release tags pinned in each bundle's `manifest.json`.
