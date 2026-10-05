# Platform adapters

## Web — `WebPlatformModule`

| Token | Implementation | Notes |
|-------|----------------|-------|
| `ICompiler` | `WebAvrWasmCompilerService` | AVR 328p FQBN only |
| `IUploader` | `WebUploaderService` | STK500v1, Uno/Nano |
| `ISerial` | `WebSerialService` | Web Serial API |
| `IFileSystem` | `WebFileSystemService` | Projects in browser storage |

Singleton: `WebSerialService` через `useExisting` (device + upload діляться один port registry).

## Electron — `ElectronPlatformModule`

| Token | Implementation |
|-------|----------------|
| `ICompiler` | `ElectronCompilerService` |
| `IUploader` | `ElectronUploaderService` |
| `ISerial` | Electron serial |
| `IFileSystem` | Native filesystem |

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
