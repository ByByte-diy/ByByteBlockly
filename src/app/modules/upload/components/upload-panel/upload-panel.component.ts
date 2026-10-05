import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
  isDevMode,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CompileResult } from '@core/models';
import { UploadManagerService, UploadStatus } from '../../services/upload-manager.service';
import { DeviceManagerService } from '../../../device/services/device-manager.service';
import { BuildLogPanelService } from '../../services/build-log-panel.service';

const UPLOAD_ICON = "url('assets/icons/header/upload.svg')";

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
})
export class UploadPanelComponent implements OnInit, OnDestroy {
  readonly UploadStatus = UploadStatus;
  readonly uploadIcon = UPLOAD_ICON;
  open = false;

  status: UploadStatus = UploadStatus.IDLE;
  message = 'ui.compile_ready';
  isProcessing = false;
  progressValue = 0;
  progressIndeterminate = false;
  showProgressBar = false;
  isDeviceReady = false;

  private subscriptions: Subscription[] = [];
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly uploadManager = inject(UploadManagerService);
  private readonly deviceManager = inject(DeviceManagerService);
  private readonly buildLogPanelService = inject(BuildLogPanelService);

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
        this.syncProgressBar(progress.status, progress.progress);
        this.cdr.detectChanges();
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

    this.open = true;
    this.uploadManager.compileAndUpload().subscribe({
      error: (err) => this.logCompileError(err),
    });
  }

  onCompileOnly(): void {
    this.open = true;
    this.uploadManager.compileOnly().subscribe({
      next: (result) => this.logCompileResult(result),
      error: (err) => this.logCompileError(err),
    });
  }

  openBuildLog(): void {
    this.buildLogPanelService.openPanel();
  }

  private logCompileResult(result: CompileResult): void {
    if (!isDevMode()) {
      return;
    }

    console.group('[Compile]');
    console.log(result.output);
    if (result.error) {
      console.error(result.error);
    }
    if (result.hexContent) {
      console.log('HEX length:', result.hexContent.length, 'flash:', result.flashBytes);
    }
    console.groupEnd();
  }

  private logCompileError(error: unknown): void {
    if (!isDevMode()) {
      return;
    }

    console.group('[Compile]');
    console.error(error);
    console.groupEnd();
  }

  private syncProgressBar(status: UploadStatus, progress?: number): void {
    const active = status === UploadStatus.COMPILING || status === UploadStatus.UPLOADING;
    this.showProgressBar = active;

    if (!active) {
      if (
        (status === UploadStatus.SUCCESS || status === UploadStatus.ERROR) &&
        progress != null
      ) {
        this.showProgressBar = true;
        this.progressValue = progress;
        this.progressIndeterminate = false;
        return;
      }
      this.progressIndeterminate = false;
      return;
    }

    if (progress == null) {
      this.progressIndeterminate = true;
      return;
    }

    this.progressIndeterminate = false;
    this.progressValue = progress;
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
