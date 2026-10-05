import { NgModule } from '@angular/core';
import { ICompiler, IUploader, ISerial, IFileSystem } from '@core/interfaces';
import { WebAvrWasmCompilerService } from './services/web-avr-wasm-compiler.service';
import { WebUploaderService } from './services/web-uploader.service';
import { WebSerialService } from './services/web-serial.service';
import { WebSerialPortRegistry } from './services/web-serial-port-registry.service';
import { WebFileSystemService } from './services/web-filesystem.service';
import { WasmAssetProvider } from './services/wasm-asset.provider';
import { WasmBoardPrefetchService } from './services/wasm-board-prefetch.service';

/**
 * Web Platform Module
 * Надає Web-специфічні реалізації платформних сервісів
 */
@NgModule({
  providers: [
    WebSerialPortRegistry,
    WebSerialService,
    WasmAssetProvider,
    WasmBoardPrefetchService,
    WebAvrWasmCompilerService,
    WebUploaderService,
    WebFileSystemService,
    { provide: ISerial, useExisting: WebSerialService },
    { provide: ICompiler, useExisting: WebAvrWasmCompilerService },
    { provide: IUploader, useExisting: WebUploaderService },
    { provide: IFileSystem, useExisting: WebFileSystemService },
  ],
})
export class WebPlatformModule { }

