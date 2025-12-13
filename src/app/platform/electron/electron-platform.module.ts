import { NgModule } from '@angular/core';
import { ICompiler, IUploader, ISerial, IFileSystem } from '@core/interfaces';
import { ElectronCompilerService } from './services/electron-compiler.service';
import { ElectronUploaderService } from './services/electron-uploader.service';
import { ElectronSerialService } from './services/electron-serial.service';
import { ElectronFileSystemService } from './services/electron-filesystem.service';

/**
 * Electron Platform Module
 * Provides Electron-specific implementations of platform services
 */
@NgModule({
  providers: [
    { provide: ICompiler, useClass: ElectronCompilerService },
    { provide: IUploader, useClass: ElectronUploaderService },
    { provide: ISerial, useClass: ElectronSerialService },
    { provide: IFileSystem, useClass: ElectronFileSystemService }
  ]
})
export class ElectronPlatformModule { }

