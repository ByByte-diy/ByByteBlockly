# Compile & Upload

Повний pipeline від Blockly-коду до прошивки на платі.

## Огляд

```
Blockly / Code Editor
        │
        ▼
UploadManagerService  ←── DeviceManager (board + port)
        │
   ┌────┴────┐
   ▼         ▼
ICompiler   IUploader
   │         │
 Web/Electron  Web/Electron
```

| Документ | Зміст |
|----------|--------|
| [pipeline.md](./pipeline.md) | Оркестрація, статуси, UI |
| [web-compilation.md](./web-compilation.md) | WASM AVR compiler |
| [wasm-avr-assets.md](./wasm-avr-assets.md) | Waves W0–W7, prepare script |
| [web-upload.md](./web-upload.md) | STK500v1, Web Serial, transport |
| [board-profiles.md](./board-profiles.md) | Uno/Nano, baud, FQBN |
| [troubleshooting.md](./troubleshooting.md) | Типові помилки |

## Режими (Upload panel)

| Кнопка | Дія |
|--------|-----|
| Компілювати | `compileOnly()` — WASM/cli, build log |
| Завантажити | `compileAndUpload()` |
| Тільки upload | `uploadOnly()` — потрібен успішний попередній compile |

## Платформи

| | Web | Electron |
|---|-----|----------|
| Compiler | `WebAvrWasmCompilerService` | `ElectronCompilerService` (arduino-cli) |
| Uploader | `WebUploaderService` (STK500v1) | `ElectronUploaderService` |
| Hex | `CompileResult.hexContent` | `CompileResult.hexPath` |
| Boards (upload) | Uno, Nano (phase 1) | Uno, Nano, Mega, ESP, … |

## Ключові файли

```
src/app/modules/upload/services/upload-manager.service.ts
src/app/platform/web/services/web-avr-wasm-compiler.service.ts
src/app/platform/web/services/web-avr-wasm.util.ts
src/app/platform/web/services/web-uploader.service.ts
src/app/platform/web/utils/web-avr-stk500.util.ts
src/app/platform/web/utils/web-serial-port-adapter.util.ts
src/app/platform/web/constants/avr-upload-profiles.const.ts
```
