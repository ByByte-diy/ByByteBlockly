# File map

## Asset cache

| Файл | Опис |
|------|------|
| `modules/asset-cache/asset-cache.module.ts` | NgModule (import in AppModule) |
| `modules/asset-cache/services/asset-cache.service.ts` | IDB + LRU store |
| `modules/asset-cache/services/asset-cache-registry.service.ts` | Manifest validate / invalidate |
| `modules/asset-cache/services/asset-cache-manifest.service.ts` | Load cache-manifest.json |
| `platform/web/services/wasm-asset.provider.ts` | WASM bundle consumer |

## Compile & Upload

| Файл | Опис |
|------|------|
| `modules/upload/services/upload-manager.service.ts` | Оркестратор compile/upload |
| `modules/upload/components/upload-panel/*` | UI кнопки, progress, build log |
| `platform/web/services/web-avr-wasm-compiler.service.ts` | WASM ICompiler |
| `platform/web/services/web-avr-wasm.util.ts` | Sketch prep, manifest, sensors |
| `platform/web/services/web-uploader.service.ts` | Web IUploader |
| `platform/web/utils/web-avr-stk500.util.ts` | flashAvrHex, Nano retry |
| `platform/web/utils/web-serial-port-adapter.util.ts` | Flasher transport + setSignals |
| `platform/web/utils/avr-upload-profile.util.ts` | resolveAvrUploadProfile |
| `platform/web/constants/avr-upload-profiles.const.ts` | Board profiles |
| `core/models/compilation.model.ts` | CompileResult, UploadOptions |
| `core/interfaces/compiler.interface.ts` | ICompiler |
| `core/interfaces/uploader.interface.ts` | IUploader |

## Web Serial

| Файл | Опис |
|------|------|
| `platform/web/services/web-serial.service.ts` | Connect, ports API |
| `platform/web/services/web-serial-port-registry.service.ts` | Handle registry |
| `platform/web/constants/web-serial-paths.const.ts` | Path constants |
| `platform/web/utils/web-serial-request-error.util.ts` | Error → i18n |
| `modules/device/components/device-selector/*` | Board/port UI |

## Electron (reference)

| Файл | Опис |
|------|------|
| `platform/electron/services/electron-compiler.service.ts` | arduino-cli compile |
| `platform/electron/services/electron-uploader.service.ts` | arduino-cli upload |

## Blockly

| Файл | Опис |
|------|------|
| `modules/blockly/` | Blocks, toolbox, editor |
| `.cursor/skills/bybyte-blockly/SKILL.md` | Authoring rules |

## i18n (upload errors)

| Файл | Опис |
|------|------|
| `assets/i18n/uk.json` | Українські рядки UI |
| `assets/i18n/en.json` | English UI strings |

## Tests

| Файл | Опис |
|------|------|
| `platform/web/__tests__/web-avr-stk500.util.spec.ts` | STK500 utils |
| `platform/web/__tests__/web-serial-port-registry.service.spec.ts` | Registry |
| `modules/upload/__tests__/upload-manager.service.spec.ts` | Orchestrator |
