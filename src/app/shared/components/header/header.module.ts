import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../../../modules/language';
import { BlocklyModule } from '../../../modules/blockly/blockly.module';
import { DeviceModule } from '../../../modules/device/device.module';
import { UploadModule } from '../../../modules/upload/upload.module';
import { HeaderUiModule } from './header-ui.module';
import { AppHeaderComponent } from './app-header/app-header.component';
import { FileMenuComponent } from './file-menu/file-menu.component';

@NgModule({
  declarations: [AppHeaderComponent, FileMenuComponent],
  imports: [
    CommonModule,
    TranslateModule,
    HeaderUiModule,
    I18nModule,
    BlocklyModule,
    DeviceModule,
    UploadModule,
  ],
  exports: [HeaderUiModule, AppHeaderComponent, FileMenuComponent],
})
export class HeaderModule {}
