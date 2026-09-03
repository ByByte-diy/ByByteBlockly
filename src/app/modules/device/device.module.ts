import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderUiModule } from '../../shared/components/header/header-ui.module';
import { DeviceSelectorComponent } from './components/device-selector/device-selector.component';
import { DeviceManagerService } from './services/device-manager.service';
import { BoardProfileService } from './services/device-board-profile.service';

@NgModule({
  declarations: [DeviceSelectorComponent],
  imports: [CommonModule, FormsModule, TranslateModule, HeaderUiModule],
  exports: [DeviceSelectorComponent],
  providers: [BoardProfileService],
})
export class DeviceModule {}
