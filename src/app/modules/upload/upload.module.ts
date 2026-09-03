import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderUiModule } from '../../shared/components/header/header-ui.module';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';
import { UploadManagerService } from './services/upload-manager.service';

@NgModule({
  declarations: [UploadPanelComponent],
  imports: [CommonModule, TranslateModule, HeaderUiModule],
  exports: [UploadPanelComponent],
  providers: [UploadManagerService],
})
export class UploadModule {}
