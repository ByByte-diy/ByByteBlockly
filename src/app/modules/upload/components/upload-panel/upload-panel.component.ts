import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  inject,
  isDevMode,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CompileResult } from '@core/models';
import { UploadManagerService, UploadStatus } from '../../services/upload-manager.service';
import { DeviceManagerService } from '../../../device/services/device-manager.service';
import { BuildLogPanelService } from '../../services/build-log-panel.service';
import { isValidDevicePortPath } from '@platform/web/constants/web-serial-paths.const';
import { getWebSerialSupport } from '@platform/web/utils/web-serial-support.util';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';

const UPLOAD_ICON = "url('assets/icons/header/upload.svg')";
const UPLOAD_ONLY_ICON = "url('assets/icons/header/upload-only.svg')";
const COMPILE_ICON = "url('assets/icons/header/compile.svg')";

@Component({
  selector: 'app-upload-panel',
  templateUrl: './upload-panel.component.html',
  styleUrls: ['./upload-panel.component.scss'],
})
export class UploadPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly UploadStatus = UploadStatus;
  readonly uploadIcon = UPLOAD_ICON;
  readonly uploadOnlyIcon = UPLOAD_ONLY_ICON;
  readonly compileIcon = COMPILE_ICON;
  open = false;

  status: UploadStatus = UploadStatus.IDLE;
  message = 'ui.compile_ready';
  isProcessing = false;
  progressValue = 0;
  progressIndeterminate = false;
  showProgressBar = false;
  isDeviceReady = false;
  canUploadOnly = false;
  readonly webSerialSupported = getWebSerialSupport().supported;

  private subscriptions: Subscription[] = [];
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly uploadManager = inject(UploadManagerService);
  private readonly deviceManager = inject(DeviceManagerService);
  private readonly buildLogPanelService = inject(BuildLogPanelService);
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly popoverId = HEADER_POPOVER_IDS.upload;

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  close(): void {
    this.headerPopover.close(this.popoverId);
  }

  ngAfterViewInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.elementRef.nativeElement);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.headerPopover.activeId$.subscribe((id) => {
        this.open = id === this.popoverId;
        this.cdr.detectChanges();
      }),
    );

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
        this.syncDeviceReady();
      }),
    );

    this.subscriptions.push(
      this.deviceManager.selectedPort$.subscribe(() => {
        this.syncDeviceReady();
      }),
    );

    this.subscriptions.push(
      this.uploadManager.compileResult$.subscribe((result) => {
        this.canUploadOnly = !!(result?.success && result.hexContent);
        this.cdr.detectChanges();
      }),
    );

    const lastResult = this.uploadManager.getLastCompileResult();
    this.canUploadOnly = !!(lastResult?.success && lastResult.hexContent);
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onCompileAndUpload(): void {
    if (!this.isUploadReady) {
      this.showUploadBlockedFeedback();
      return;
    }

    this.headerPopover.open(this.popoverId);
    this.uploadManager.compileAndUpload().subscribe({
      error: (err) => this.logCompileError(err),
    });
  }

  onUploadOnly(): void {
    if (!this.isUploadReady) {
      this.showUploadBlockedFeedback();
      return;
    }
    if (!this.canUploadOnly) {
      return;
    }

    this.headerPopover.open(this.popoverId);
    this.uploadManager.uploadOnly().subscribe({
      error: (err) => this.logCompileError(err),
    });
  }

  get isUploadReady(): boolean {
    const port = this.deviceManager.getSelectedPort();
    return (
      this.webSerialSupported &&
      this.isDeviceReady &&
      isValidDevicePortPath(port?.path)
    );
  }

  private syncDeviceReady(): void {
    this.isDeviceReady = this.deviceManager.isDeviceReady();
    this.cdr.detectChanges();
  }

  /** Inline hint when upload is blocked (Web Serial or board/port). */
  get panelHintKey(): string {
    return this.resolveUploadBlockedKey();
  }

  private showUploadBlockedFeedback(): void {
    this.headerPopover.open(this.popoverId);
    this.message = this.resolveUploadBlockedKey();
    this.cdr.detectChanges();
  }

  private resolveUploadBlockedKey(): string {
    const support = getWebSerialSupport();
    if (!support.supported) {
      return support.reason === 'insecure_context'
        ? 'ui.web_serial_insecure_context'
        : 'ui.web_serial_not_supported';
    }
    return 'ui.upload_select_board_port';
  }

  onCompileOnly(): void {
    this.headerPopover.open(this.popoverId);
    this.uploadManager.compileOnly().subscribe({
      next: (result) => this.logCompileResult(result),
      error: (err) => this.logCompileError(err),
    });
  }

  openBuildLog(): void {
    this.buildLogPanelService.openPanel();
  }

  isI18nKey(value: string): boolean {
    return value.startsWith('ui.');
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
