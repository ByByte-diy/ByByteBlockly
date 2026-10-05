# AGENTS — ByByte Blockly

Короткий контекст для AI-агентів. Деталі — у відповідних розділах `docs/`.

## Проєкт

Angular 17 + Blockly 13. Два runtime: **Web** (`WebPlatformModule`) і **Electron** (`ElectronPlatformModule`). Бізнес-логіка не перевіряє платформу напряму — лише інтерфейси `ICompiler`, `IUploader`, `ISerial`, `IFileSystem`.

## Де що лежить

```
src/app/
  core/interfaces/          # ICompiler, IUploader, …
  core/models/              # CompileResult, UploadOptions, …
  platform/web/             # WASM compile, Web Serial upload
  platform/electron/        # arduino-cli compile/upload
  modules/upload/           # UploadManagerService, UI panel
  modules/device/           # Board/port selection
  modules/blockly/          # Blocks, toolbox, generators
  modules/code-editor/      # Generated / edited Arduino code
```

## Compile + Upload (web, AVR)

1. `UploadManagerService` — оркестратор (compile / upload / compile+upload).
2. `WebAvrWasmCompilerService` — `ICompiler`, WASM, FQBN atmega328p (Uno/Nano).
3. `WebUploaderService` — `IUploader`, STK500v1 через `webserial-flasher`.
4. `WebSerialService` + `WebSerialPortRegistry` — порти та user gesture для `requestPort()`.

**Критично:** не fallback на default port у upload; не Proxy навколо native `SerialPort`; `dtr`→`dataTerminalReady` у transport adapter.

Документація: [compile-upload/README.md](./compile-upload/README.md).

## Blockly changes

Перед змінами в `src/app/modules/blockly/` — прочитати `.cursor/skills/bybyte-blockly/SKILL.md`.

## Правила

- Мінімальний diff, існуючі конвенції.
- Не commit без явного запиту.
- Відповіді користувачу — **українською**.
- Unit tests: `npm test` (Vitest).

## Harness

- [harness/glossary.md](./harness/glossary.md)
- [harness/file-map.md](./harness/file-map.md)
- [harness/conventions.md](./harness/conventions.md)
