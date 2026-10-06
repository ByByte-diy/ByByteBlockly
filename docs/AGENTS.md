# AGENTS — ByByte Blockly

Короткий контекст для AI-агентів. Деталі — у відповідних розділах `docs/`.

## Проєкт

Angular 17 + Blockly 13. Два runtime: **Web** (`WebPlatformModule`) і **Electron** (`ElectronPlatformModule`). Бізнес-логіка не перевіряє платформу напряму — лише інтерфейси `ICompiler`, `IUploader`, `ISerial`, `IFileSystem`.

## Де що лежить

```
src/app/
  core/interfaces/          # ICompiler, IUploader, …
  core/models/              # CompileResult, UploadOptions, …
  core/utils/               # i18n-error, serial-port-display, …
  modules/wasm-compiler/    # Portable WASM compile (strategies, assets, registry)
  modules/upload/           # UploadManagerService, UI panel
  modules/device/           # Board/port selection
  modules/blockly/          # Blocks, toolbox, generators
  modules/code-editor/      # Generated / edited Arduino code
  modules/asset-cache/      # IndexedDB + cache-manifest
  platform/web/             # Browser wiring: Serial, upload, WasmRuntimePort
  platform/electron/        # arduino-cli compile/upload
src/wasm-avr/               # Prepare scripts, libraries.json, fixtures
```

## Compile + Upload (web, AVR)

1. `UploadManagerService` — оркестратор (compile / upload / compile+upload).
2. `WasmCompilerService` (`@modules/wasm-compiler`) — facade `ICompiler`; FQBN → strategy:
   - `Avr328pWasmCompilerStrategy` — Uno/Nano (horang)
   - `AvrMegaWasmCompilerStrategy` — Mega 2560 (wasm-toolchains)
3. `WebPlatformModule` — `WasmCompilerModule.forRoot(BrowserWasmRuntimePort)` + `WasmBoardPrefetchService`.
4. `WebUploaderService` — `IUploader`, STK500v1/v2 через `webserial-flasher` (Uno/Nano/Mega).
5. `WebSerialService` + `WebSerialPortRegistry` — порти та user gesture для `requestPort()`.

**Критично:** не fallback на default port у upload; не Proxy навколо native `SerialPort`; `dtr`→`dataTerminalReady` у transport adapter.

Документація: [compile-upload/README.md](./compile-upload/README.md), [architecture/platform-adapters.md](./architecture/platform-adapters.md).

## Blockly changes

Перед змінами в `src/app/modules/blockly/` — прочитати `.cursor/skills/bybyte-blockly/SKILL.md`.

## Правила

- Мінімальний diff, існуючі конвенції.
- Не commit без явного запиту.
- Відповіді користувачу — **українською**.
- Unit tests: `npm test` (Vitest); Blockly CI: `.github/workflows/blockly-tests.yml` (Node 22).

## Harness

- [harness/glossary.md](./harness/glossary.md)
- [harness/file-map.md](./harness/file-map.md)
- [harness/conventions.md](./harness/conventions.md)
