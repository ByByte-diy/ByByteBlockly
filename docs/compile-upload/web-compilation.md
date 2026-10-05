# Web compilation (WASM AVR)

## Сервіс

`WebAvrWasmCompilerService` — реалізація `ICompiler` для web.

**Підтримувані FQBN:** atmega328p (Arduino Uno, Nano variants). Інші плати → `WASM_AVR_UNSUPPORTED_MESSAGE`.

## Підготовка toolchain

```bash
npm run prepare:wasm-avr
```

Копіює ByByte WASM assets у `src/assets/wasm-avr/` та оновлює `manifest.json`. Без цього `checkTools()` поверне помилку про stock npm manifest.

Деталі збірки: [wasm-avr-assets.md](./wasm-avr-assets.md).

## Потік компіляції

1. Перевірка FQBN (`isAvr328pFqbn`)
2. `prepareSketchForWasm(code)` — обгортка sketch, includes
3. `detectWasmSensors(code)` — опційні sensor libs
4. Lazy load WASM module (`compileFn`)
5. Виклик WASM з `{ source, sensors, assetsBase }`
6. Результат: `{ hex, flashBytes, fitsTarget, stderr, timings }`
7. `CompileResult`: `success`, `output` (formatted log), `hexContent`

## Assets

- Base URL: `resolveWasmAssetsBase()` — зазвичай `/assets/wasm-avr/`
- Manifest: `assets/manifest.json` — має пройти `isBybyteWasmManifest()`

## Progress

`createProgressSimulator` + реальні оновлення під час WASM work. Callback `options.onProgress({ percent, message })`.

## Electron contrast

| | Web WASM | Electron |
|---|----------|----------|
| Toolchain | Browser WASM | arduino-cli |
| Output | `hexContent` string | `.hex` file path |
| Cores | Bundled | `installCore()` |
| Mega/ESP | ❌ | ✅ |

## Файли

```
src/app/platform/web/services/web-avr-wasm-compiler.service.ts
src/app/platform/web/services/web-avr-wasm.util.ts
src/wasm-avr/
src/assets/wasm-avr/   (generated)
```

## Тести

- `web-avr-wasm.util.spec.ts`
- `web-avr-wasm-compiler.service.spec.ts`
