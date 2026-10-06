# Web compilation (WASM AVR)

## Модуль і wiring

WASM compiler живе в `@modules/wasm-compiler` — platform-agnostic (strategies, registry, assets).

Web-платформа підключає його через `WebPlatformModule`:

```typescript
imports: [WasmCompilerModule.forRoot(BrowserWasmRuntimePort)],
providers: [{ provide: ICompiler, useExisting: WasmCompilerService }],
```

| Компонент | Роль |
|-----------|------|
| `WasmCompilerService` | Facade `ICompiler`; делегує FQBN → strategy |
| `Avr328pWasmCompilerStrategy` | Uno/Nano (horang, `@horang-corp/avr-gcc-wasm`) |
| `AvrMegaWasmCompilerStrategy` | Mega (wasm-toolchains, `avrwasm.tar`) |
| `WasmCompilerRegistry` | Routing за FQBN |
| `BrowserWasmRuntimePort` | Chromium: `document.baseURI`, `fetch`, dynamic `import()` |
| `WasmBoardPrefetchService` | Web-only prefetch tools/core при виборі плати |

**Підтримувані FQBN:** `arduino:avr:uno`, `arduino:avr:nano` (variants), `arduino:avr:mega`. ESP та інші → i18n ключ `compile_wasm_unsupported_board`.

Alias `WebWasmCompilerService` залишено для backward compatibility.

## Підготовка toolchain

```bash
npm run start:web                             # prepare all (328p + Mega) + ng serve
npm run prepare:wasm-avr                      # лише 328p
npm run prepare:wasm-avr -- prepare mega      # лише Mega
npm run prepare:wasm-avr -- prepare all       # 328p + Mega (те саме, що перед start:web)
```

Копіює ByByte WASM assets у `src/assets/wasm/{avr-328p,avr-mega}/` та оновлює `cache-manifest.json`. `start:web` / `build:web` завжди роблять `prepare all` — Mega compile працює одразу (перший запуск довший).

Деталі збірки: [wasm-avr-assets.md](./wasm-avr-assets.md).

## Потік компіляції

1. Routing FQBN (`WasmCompilerRegistry` → 328p або Mega strategy)
2. `prepareSketchForWasm(code)` — обгортка sketch, includes
3. `detectWasmSensors(code)` — опційні sensor libs
4. Lazy load WASM module (`compileFn`) через `WasmRuntimePort.importModule`
5. Виклик WASM з `{ source, sensors, assetsBase }`
6. Результат: `{ hex, flashBytes, fitsTarget, stderr, timings }`
7. `CompileResult`: `success`, `output` (formatted log), `hexContent`

## Assets

- Root: `src/assets/wasm/` → `avr-328p/v{version}/`, `avr-mega/v{version}/`
- Runtime URL: `WasmAssetProvider.resolveWasmAssetsBase()` → bundle-specific base, напр. `/assets/wasm/avr-328p/v0.2.0-W1-…/`
- Manifest: `wasm-catalog.json` + `bybyte-manifest.json` (Mega)

## Progress

`createProgressSimulator` + реальні оновлення під час WASM work. Callback `options.onProgress({ percent, message })`.

## Web upload (AVR)

`WebUploaderService` → `flashAvrHex()` (`web-avr-stk500.util.ts`) via `webserial-flasher`:

| Board | Protocol | Baud |
|-------|----------|------|
| Uno / Nano | STK500v1 | 115200 / 57600 (Nano fallback) |
| Mega 2560 / ByByte Mega | STK500v2 | 115200 |

Profiles: `avr-upload-profiles.const.ts`. Mega: `triggerMegaBootloaderReset()` + `WiringSTK500v2.bootload()` (subclass — wiring bootloader subset).

## Electron contrast

| | Web WASM | Electron |
|---|----------|----------|
| Toolchain | Browser WASM | arduino-cli |
| Output | `hexContent` string | `.hex` file path |
| Cores | Bundled | `installCore()` |
| Mega (WASM) | ✅ (`prepare:wasm-avr -- prepare mega`) | ✅ |
| Mega (web upload) | ✅ STK500v2 @ 115200 | ✅ avrdude |
| ESP | ❌ | ❌ (cli only) |

## Файли

```
src/app/modules/wasm-compiler/          # portable module
src/app/platform/web/services/browser-wasm-runtime.port.ts
src/app/platform/web/services/wasm-board-prefetch.service.ts
src/app/platform/web/web-platform.module.ts
src/wasm-avr/
src/assets/wasm/avr-328p/   (generated)
src/assets/wasm/avr-mega/   (generated)
```

## Тести

`src/app/modules/wasm-compiler/__tests__/` — registry, strategies, library resolver, sketch preprocessor, tier prefetch.
