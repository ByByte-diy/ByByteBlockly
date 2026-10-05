import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderUiModule } from '../../shared/components/header/header-ui.module';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';
import { BuildLogPanelComponent } from './components/build-log-panel/build-log-panel.component';
import { BuildLogToggleComponent } from './components/build-log-toggle/build-log-toggle.component';
import { UploadManagerService } from './services/upload-manager.service';

@NgModule({
  declarations: [UploadPanelComponent, BuildLogPanelComponent, BuildLogToggleComponent],
  imports: [CommonModule, TranslateModule, HeaderUiModule],
  exports: [UploadPanelComponent, BuildLogPanelComponent, BuildLogToggleComponent],
  providers: [UploadManagerService],
})
export class UploadModule {}
