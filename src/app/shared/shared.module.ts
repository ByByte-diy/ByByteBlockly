import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../modules/language';
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
    TranslateModule,
    I18nModule,
    BlocklyModule,
    DeviceModule,
    UploadModule
  ],
  exports: [
    AppComponent,
    CommonModule,
    TranslateModule,
    I18nModule
  ]
})
export class SharedModule { }

