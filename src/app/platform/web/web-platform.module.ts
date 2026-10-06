import { NgModule } from '@angular/core';
import { ICompiler, IUploader, ISerial, IFileSystem } from '@core/interfaces';
import { WasmCompilerModule, WasmCompilerService } from '@modules/wasm-compiler';
import { BrowserWasmRuntimePort } from './services/browser-wasm-runtime.port';
import { WasmBoardPrefetchService } from './services/wasm-board-prefetch.service';
import { WebUploaderService } from './services/web-uploader.service';
import { WebSerialService } from './services/web-serial.service';
import { WebSerialPortRegistry } from './services/web-serial-port-registry.service';
import { WebFileSystemService } from './services/web-filesystem.service';

/**
 * Web Platform Module
 * Надає Web-специфічні реалізації платформних сервісів
 */
@NgModule({
  imports: [WasmCompilerModule.forRoot(BrowserWasmRuntimePort)],
  providers: [
    WebSerialPortRegistry,
    WebSerialService,
    WasmBoardPrefetchService,
    WebUploaderService,
    WebFileSystemService,
    { provide: ISerial, useExisting: WebSerialService },
    { provide: ICompiler, useExisting: WasmCompilerService },
    { provide: IUploader, useExisting: WebUploaderService },
    { provide: IFileSystem, useExisting: WebFileSystemService },
  ],
})
export class WebPlatformModule {}
