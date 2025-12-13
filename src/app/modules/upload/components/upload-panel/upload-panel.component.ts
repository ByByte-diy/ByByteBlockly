import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadManagerService, UploadStatus, UploadProgress } from '../../services/upload-manager.service';
import { DeviceManagerService } from '../../../device/services/device-manager.service';

/**
 * Component of the upload management panel
 */
@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss']
})
export class UploadPanelComponent implements OnInit, OnDestroy {
  status: UploadStatus = UploadStatus.IDLE;
  message: string = 'Ready to upload';
  isProcessing: boolean = false;
  isDeviceReady: boolean = false;

  UploadStatus = UploadStatus; // For use in template

  private subscriptions: Subscription[] = [];

  constructor(
    public uploadManager: UploadManagerService,
    private deviceManager: DeviceManagerService
  ) {}

  ngOnInit(): void {
    // Subscribe to status
    this.subscriptions.push(
      this.uploadManager.status$.subscribe(status => {
        this.status = status;
        this.isProcessing = status === UploadStatus.COMPILING || status === UploadStatus.UPLOADING;
      })
    );

    // Subscribe to progress
    this.subscriptions.push(
      this.uploadManager.progress$.subscribe(progress => {
        this.message = progress.message;
      })
    );

    // Check if the device is ready
    this.isDeviceReady = this.deviceManager.isDeviceReady();
    
    this.subscriptions.push(
      this.deviceManager.selectedBoard$.subscribe(() => {
        this.isDeviceReady = this.deviceManager.isDeviceReady();
      })
    );

    this.subscriptions.push(
      this.deviceManager.selectedPort$.subscribe(() => {
        this.isDeviceReady = this.deviceManager.isDeviceReady();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Handler of the compile and upload button
   */
  onCompileAndUpload(): void {
    if (!this.isDeviceReady) {
      alert('Please select a board and port');
      return;
    }

    this.uploadManager.compileAndUpload().subscribe({
      next: (success) => {
        if (success) {
          console.log('Upload successful!');
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert(`Error: ${err.message}`);
      }
    });
  }

  /**
   * Handler of the compile only button
   */
  onCompileOnly(): void {
    if (!this.isDeviceReady) {
      alert('Please select a board');
      return;
    }

    this.uploadManager.compileOnly().subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Compilation successful!', result);
        }
      },
      error: (err) => {
        console.error('Compilation error:', err);
        alert(`Compilation error: ${err.message}`);
      }
    });
  }

  /**
   * Gets the class for the status indicator
   */
  getStatusClass(): string {
    switch (this.status) {
      case UploadStatus.SUCCESS:
        return 'status-success';
      case UploadStatus.ERROR:
        return 'status-error';
      case UploadStatus.COMPILING:
      case UploadStatus.UPLOADING:
        return 'status-processing';
      default:
        return 'status-idle';
    }
  }

  /**
   * Gets the status icon
   */
  getStatusIcon(): string {
    switch (this.status) {
      case UploadStatus.SUCCESS:
        return '✓';
      case UploadStatus.ERROR:
        return '✗';
      case UploadStatus.COMPILING:
      case UploadStatus.UPLOADING:
        return '⟳';
      default:
        return '○';
    }
  }
}
