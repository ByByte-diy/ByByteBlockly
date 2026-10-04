import { NgModule } from '@angular/core';
import { ICompiler, IUploader, ISerial, IFileSystem } from '@core/interfaces';
import { WebAvrWasmCompilerService } from './services/web-avr-wasm-compiler.service';
import { WebUploaderService } from './services/web-uploader.service';
import { WebSerialService } from './services/web-serial.service';
import { WebFileSystemService } from './services/web-filesystem.service';

/**
 * Web Platform Module
 * Надає Web-специфічні реалізації платформних сервісів
 */
@NgModule({
  providers: [
    { provide: ICompiler, useClass: WebAvrWasmCompilerService },
    { provide: IUploader, useClass: WebUploaderService },
    { provide: ISerial, useClass: WebSerialService },
    { provide: IFileSystem, useClass: WebFileSystemService }
  ]
})
export class WebPlatformModule { }

