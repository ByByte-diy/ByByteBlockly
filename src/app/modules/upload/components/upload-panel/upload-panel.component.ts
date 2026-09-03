import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadManagerService, UploadStatus } from '../../services/upload-manager.service';
import { DeviceManagerService } from '../../../device/services/device-manager.service';

const UPLOAD_ICON = "url('assets/icons/header/upload.svg')";

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
})
export class UploadPanelComponent implements OnInit, OnDestroy {
  readonly uploadIcon = UPLOAD_ICON;
  open = false;

  status: UploadStatus = UploadStatus.IDLE;
  message = 'Ready to upload';
  isProcessing = false;
  isDeviceReady = false;

  private subscriptions: Subscription[] = [];
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly uploadManager = inject(UploadManagerService);
  private readonly deviceManager = inject(DeviceManagerService);

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open = !this.open;
    this.cdr.detectChanges();
  }

  close(): void {
    this.open = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.uploadManager.status$.subscribe((status) => {
        this.status = status;
        this.isProcessing =
          status === UploadStatus.COMPILING || status === UploadStatus.UPLOADING;
      }),
    );

    this.subscriptions.push(
      this.uploadManager.progress$.subscribe((progress) => {
        this.message = progress.message;
      }),
    );

    this.isDeviceReady = this.deviceManager.isDeviceReady();

    this.subscriptions.push(
      this.deviceManager.selectedBoard$.subscribe(() => {
        this.isDeviceReady = this.deviceManager.isDeviceReady();
      }),
    );

    this.subscriptions.push(
      this.deviceManager.selectedPort$.subscribe(() => {
        this.isDeviceReady = this.deviceManager.isDeviceReady();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onCompileAndUpload(): void {
    if (!this.isDeviceReady) {
      alert('Please select a board and port');
      return;
    }

    this.uploadManager.compileAndUpload().subscribe({
      error: (err) => {
        alert(`Error: ${err.message}`);
      },
    });
  }

  onCompileOnly(): void {
    if (!this.isDeviceReady) {
      alert('Please select a board');
      return;
    }

    this.uploadManager.compileOnly().subscribe({
      error: (err) => {
        alert(`Compilation error: ${err.message}`);
      },
    });
  }

  getStatusDotClass(): string {
    switch (this.status) {
      case UploadStatus.SUCCESS:
        return 'header-status-dot--success';
      case UploadStatus.ERROR:
        return 'header-status-dot--error';
      case UploadStatus.COMPILING:
      case UploadStatus.UPLOADING:
        return 'header-status-dot--processing';
      default:
        return '';
    }
  }

  getStatusBarClass(): string {
    switch (this.status) {
      case UploadStatus.SUCCESS:
        return 'header-status-bar--success';
      case UploadStatus.ERROR:
        return 'header-status-bar--error';
      case UploadStatus.COMPILING:
      case UploadStatus.UPLOADING:
        return 'header-status-bar--processing';
      default:
        return 'header-status-bar--idle';
    }
  }
}
