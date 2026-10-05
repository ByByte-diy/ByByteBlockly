# Architecture overview

## Шари

```
┌─────────────────────────────────────────────────────────┐
│  UI (modules/upload, device, blockly, code-editor, …)   │
├─────────────────────────────────────────────────────────┤
│  Orchestration (UploadManagerService, DeviceManager)    │
├─────────────────────────────────────────────────────────┤
│  Core contracts (ICompiler, IUploader, ISerial, …)      │
├──────────────────────┬──────────────────────────────────┤
│  platform/web        │  platform/electron               │
│  WASM + Web Serial   │  arduino-cli + node serial       │
└──────────────────────┴──────────────────────────────────┘
```

## Каталог `src/app/`

| Шлях | Призначення |
|------|-------------|
| `core/interfaces/` | Абстракції платформних сервісів |
| `core/models/` | `CompileResult`, `UploadOptions`, serial models |
| `core/services/` | Спільні сервіси (`HeaderPopoverService`, …) |
| `platform/web/` | Web-реалізації |
| `platform/electron/` | Electron-реалізації |
| `modules/upload/` | Compile/upload UI та `UploadManagerService` |
| `modules/device/` | Вибір плати та порту |
| `modules/blockly/` | Blockly editor, blocks, toolbox |
| `modules/code-editor/` | Текстовий редактор згенерованого коду |
| `shared/` | Header, спільні компоненти |

## Принцип

❌ `if (isElectron) { … }` у модулях бізнес-логіки.

✅ Ін'єкція `ICompiler` / `IUploader` через `WebPlatformModule` або `ElectronPlatformModule`.

## Header UX

`HeaderPopoverService` — одне відкрите dropdown/popover; глобальний outside-click з cleanup listeners.
