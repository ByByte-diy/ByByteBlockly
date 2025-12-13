import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSelectorComponent } from './components/device-selector/device-selector.component';
import { DeviceManagerService } from './services/device-manager.service';
import { BoardProfileService } from './services/device-board-profile.service';

/**
 * Device Module
 * Contains components and services for managing devices (boards and ports)
 */
@NgModule({
  declarations: [DeviceSelectorComponent],
  imports: [CommonModule],
  exports: [DeviceSelectorComponent],
  providers: [DeviceManagerService, BoardProfileService],
})
export class DeviceModule {}
