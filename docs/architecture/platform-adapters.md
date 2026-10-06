# Platform adapters

Бізнес-модулі (`upload`, `device`, `blockly`) залежать лише від токенів `ICompiler`, `IUploader`, `ISerial`, `IFileSystem`. Платформні реалізації підключаються в `WebPlatformModule` / `ElectronPlatformModule`.

## Web — `WebPlatformModule`

```typescript
imports: [WasmCompilerModule.forRoot(BrowserWasmRuntimePort)],
providers: [
  { provide: ICompiler, useExisting: WasmCompilerService },
  { provide: IUploader, useExisting: WebUploaderService },
  { provide: ISerial, useExisting: WebSerialService },
  { provide: IFileSystem, useExisting: WebFileSystemService },
  WasmBoardPrefetchService,
  WebSerialPortRegistry,
],
```

| Token | Implementation | Notes |
|-------|----------------|-------|
| `ICompiler` | `WasmCompilerService` | Facade з `@modules/wasm-compiler`; делегує FQBN → strategy |
| `IUploader` | `WebUploaderService` | STK500v1 (Uno/Nano) + STK500v2 (Mega) |
| `ISerial` | `WebSerialService` | Web Serial API, `WebSerialPortRegistry` |
| `IFileSystem` | `WebFileSystemService` | Projects in browser storage |

Web-only wiring (не part of `WasmCompilerModule`):

| Сервіс | Роль |
|--------|------|
| `BrowserWasmRuntimePort` | `fetch`, `document.baseURI`, dynamic `import()` для WASM bundles |
| `WasmBoardPrefetchService` | Prefetch tools/core tiers при виборі AVR плати |

Singleton: `WebSerialService` через `useExisting` (device + upload діляться один port registry).

## WASM compiler — `@modules/wasm-compiler`

Platform-agnostic модуль. Підключається через `WasmCompilerModule.forRoot(WasmRuntimePort)`.

```
modules/wasm-compiler/
  wasm-compiler.module.ts       # forRoot(runtimePort)
  services/
    wasm-compiler.service.ts    # ICompiler facade
    wasm-compiler-registry.service.ts
    wasm-asset.provider.ts      # 328p bundle
    wasm-mega-asset.provider.ts # Mega bundle
  strategies/
    avr-328p-wasm-compiler.strategy.ts
    avr-mega-wasm-compiler.strategy.ts
    avr-wasm-compiler.strategy.base.ts
  ports/wasm-runtime.port.ts    # abstract runtime (browser / future Electron)
  utils/
    wasm-library-resolver.ts    # selective headers/objects
    sketch-preprocessor.ts
    wasm-tier-prefetch.util.ts
```

| FQBN family | Strategy | Toolchain |
|-------------|----------|-----------|
| Uno, Nano (328p) | `Avr328pWasmCompilerStrategy` | `@horang-corp/avr-gcc-wasm` |
| Mega 2560 | `AvrMegaWasmCompilerStrategy` | wasm-toolchains `avrwasm.tar` |

Alias `WebWasmCompilerService` / `WebWasmCompilerModule` — deprecated, лишені для backward compatibility.

## Electron — `ElectronPlatformModule`

| Token | Implementation |
|-------|----------------|
| `ICompiler` | `ElectronCompilerService` |
| `IUploader` | `ElectronUploaderService` |
| `ISerial` | `ElectronSerialService` |
| `IFileSystem` | Native filesystem |

Electron поки використовує arduino-cli, не `WasmCompilerModule`. Майбутній шлях: `WasmCompilerModule.forRoot(ElectronWasmRuntimePort)`.

## Контракти

```typescript
// core/interfaces/compiler.interface.ts
abstract class ICompiler {
  abstract compile(options: CompileOptions): Observable<CompileResult>;
  abstract checkTools(): Promise<boolean>;
  abstract installCore(core: string): Observable<string>;
}

// core/interfaces/uploader.interface.ts
abstract class IUploader {
  abstract upload(options: UploadOptions): Observable<UploadResult>;
  abstract checkPort(port: string): Promise<boolean>;
  abstract resetDevice(port: string): Promise<boolean>;
}
```

`CompileResult` містить `hexContent` (web upload) та/або `hexPath` (electron).

`UploadOptions` передає `board`, `boardId`, `port`, `hexContent`, `onProgress`.

## Related

- [compile-upload/web-compilation.md](../compile-upload/web-compilation.md)
- [compile-upload/wasm-avr-assets.md](../compile-upload/wasm-avr-assets.md)
- [harness/file-map.md](../harness/file-map.md)
