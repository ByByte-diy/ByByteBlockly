# ESP32 WASM spike (F4.1)

Proof that the [wasm-toolchains `esp32wasm.tar`](https://github.com/begeistert/wasm-toolchains/releases/tag/esp-v1.0.0) bundle compiles a minimal Blink sketch in Node using the same Xtensa WASM tools the browser pipeline will use later.

## Output format

ESP32 Arduino builds produce a **flash app `.bin`**, not Intel HEX. The spike sets:

| Field | Type | Meaning |
|-------|------|---------|
| `CompileResult.outputFormat` | implicit via toolchain | `"bin"` (see bundle `manifest.json`) |
| `CompileResult.binContent` | `string` (base64) | App image at flash offset `0x10000` |
| `CompileResult.binPath` | `string` | Desktop / temp path when written to disk |
| `CompileResult.hexContent` | — | Not used for ESP32 |

Bootloader (`0x1000`) and partition table (`0x8000`) come from the board profile / uploader — not from the sketch link step.

## Bundle layout

```
src/assets/wasm/esp32/vEsp-v1.0.0/
  manifest.json       # chip, flash offsets, boards.esp32 link closure
  tools/              # cc1plus, xtensa-as, xtensa-ld, objcopy (+ .wasm)
  templates/          # cc1plus/ld argv captured from native harvest
  vfs/                # Header + prebuilt .o / .a closure
```

Source tarball: `esp32wasm.tar` (~184 MB). Cached under `.cache/` during prepare; not committed by default.

## Commands

```bash
# Download tar (if missing) and publish to src/assets/wasm/esp32/
npm run prepare:wasm-esp

# Node harness — uses prepared assets or .cache/esp32-dist-web
npm run prepare:wasm-esp -- verify blink
```

Override bundle path:

```bash
DIST=.cache/esp32-dist-web node src/wasm-esp/wasm-esp.mjs verify blink
```

## Pipeline (Node verify)

1. `recipe-esp.js` — preprocess `.ino` → `.cpp`, shape cc1/as/ld argv from templates
2. WASM `cc1plus` → `.s`
3. WASM `xtensa-esp32-elf-as` → sketch `.o` (replaces harvested Big sketch object in link list)
4. WASM `xtensa-esp32-elf-ld` → `.elf` (precompiled core + IDF libs from bundle)
5. WASM `objcopy -O binary` → app `.bin` → `binContent` (base64)

## Browser compile (F4.3)

- `Esp32WasmCompilerStrategy` — routes `esp32:esp32:esp32` via `WasmCompilerRegistry`
- `WasmEsp32AssetProvider` — bundle id `wasm-esp32`, lazy tiers (tools → core → vfs closure)
- `src/wasm-esp/esp32-browser/index.js` — browser twin of `verify-esp32-build.cjs`
- Board select prefetches **tools + core only**; full VFS closure loads on first compile

## Library map (F4.2)

`src/wasm-esp/libraries.esp.json` — harvested vs desktop-only includes (MRT motor, BLE HID, MFRC522, …).

## F4.4 constraints

Web-compile limits (Firebase, AsyncWebServer, ESP8266 desktop-only, …): [esp32-web-compile-constraints.md](./esp32-web-compile-constraints.md).

## Backlog

- Selective ByByte lib relink (beyond harvest closure)
- ESP8266 WASM toolchain

## References

- Plan: `.cursor/plans/lazy_wasm_multi-platform_bf1259dc.plan.md` §4.1
- Toolchain release: [esp-v1.0.0](https://github.com/begeistert/wasm-toolchains/releases/tag/esp-v1.0.0)
- Scripts: `src/wasm-esp/`
