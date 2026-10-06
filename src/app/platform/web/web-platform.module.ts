import { NgModule } from '@angular/core';
import { IFileSystem } from '@core/interfaces';
import { WebFileSystemService } from './services/web-filesystem.service';
import { WebSerialModule } from './web-serial/web-serial.module';
import { WebWasmModule } from './wasm/web-wasm.module';

/**
 * Web Platform Module
 * Надає Web-специфічні реалізації платформних сервісів
 */
@NgModule({
  imports: [WebSerialModule, WebWasmModule],
  providers: [
    WebFileSystemService,
    { provide: IFileSystem, useExisting: WebFileSystemService },
  ],
})
export class WebPlatformModule {}
