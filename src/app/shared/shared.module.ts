import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { BlocklyModule } from '../modules/blockly/blockly.module';
import { DeviceModule } from '../modules/device/device.module';
import { UploadModule } from '../modules/upload/upload.module';

/**
 * Shared Module
 * Contains shared components for Web and Electron versions
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BlocklyModule,
    DeviceModule,
    UploadModule
  ],
  exports: [
    AppComponent
  ]
})
export class SharedModule { }

