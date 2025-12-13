import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';
import { UploadManagerService } from './services/upload-manager.service';

/**
 * Upload Module
 * Contains components and services for compilation and upload of code
 */
@NgModule({
  declarations: [
    UploadPanelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UploadPanelComponent
  ],
  providers: [
    UploadManagerService
  ]
})
export class UploadModule { }
