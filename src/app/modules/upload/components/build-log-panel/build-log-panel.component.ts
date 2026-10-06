import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CompileResult } from '@core/models';
import { BuildLogLine, parseBuildLogLines } from '../../utils/build-log.util';
import { BuildLogPanelService } from '../../services/build-log-panel.service';
import { UploadManagerService } from '../../services/upload-manager.service';

const CLOSE_ICON = "url('assets/icons/header/close.svg')";
const COPY_ICON = "url('assets/icons/header/copy.svg')";
const CLEAR_ICON = "url('assets/icons/header/clear.svg')";
const HEX_ICON = "url('assets/icons/header/hex.svg')";
const COPY_FEEDBACK_MS = 2000;

@Component({
  selector: 'app-build-log-panel',
  templateUrl: './build-log-panel.component.html',
  styleUrls: ['./build-log-panel.component.scss'],
  host: {
    class: 'build-log-panel-host',
    '[class.build-log-panel-host--open]': 'isOpen',
    '[class.build-log-panel-host--resizing]': 'isResizing',
    '[style.--panel-height.px]': 'panelHeight',
  },
})
export class BuildLogPanelComponent implements OnInit, OnDestroy {
  @ViewChild('resizeHandle', { static: true })
  private readonly resizeHandle!: ElementRef<HTMLDivElement>;

  private readonly buildLogPanelService = inject(BuildLogPanelService);
  private readonly uploadManager = inject(UploadManagerService);

  readonly closeIcon = CLOSE_ICON;
  readonly copyIcon = COPY_ICON;
  readonly clearIcon = CLEAR_ICON;
  readonly hexIcon = HEX_ICON;

  isOpen = this.buildLogPanelService.isPanelOpen();
  panelHeight = this.buildLogPanelService.getPanelHeight();
  isResizing = false;
  buildLog = '';
  buildLogLines: BuildLogLine[] = [];
  lastCompileResult: CompileResult | null = null;
  copyFeedback = false;

  private subscriptions: Subscription[] = [];
  private copyFeedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeStartY = 0;
  private resizeStartHeight = 0;
  private activeResizePointerId: number | null = null;
  private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private readonly onPointerEnd = (event: PointerEvent) => this.handlePointerEnd(event);

  ngOnInit(): void {
    this.subscriptions.push(
      this.buildLogPanelService.isOpen$.subscribe((open) => {
        this.abortResize();
        this.isOpen = open;
        this.panelHeight = this.buildLogPanelService.getPanelHeight();
      }),
    );
    this.subscriptions.push(
      this.buildLogPanelService.panelHeight$.subscribe((height) => {
        if (!this.isResizing) {
          this.panelHeight = height;
        }
      }),
    );
    this.subscriptions.push(
      this.uploadManager.buildLog$.subscribe((log) => {
        this.buildLog = log;
        this.buildLogLines = parseBuildLogLines(log);
      }),
    );
    this.subscriptions.push(
      this.uploadManager.compileResult$.subscribe((result) => {
        this.lastCompileResult = result;
      }),
    );
  }

  ngOnDestroy(): void {
    this.abortResize();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.copyFeedbackTimer) {
      clearTimeout(this.copyFeedbackTimer);
    }
  }

  onClose(event: MouseEvent): void {
    event.stopPropagation();
    this.buildLogPanelService.closePanel();
  }

  async copyBuildLog(event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (!this.buildLog) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.buildLog);
      this.copyFeedback = true;
      if (this.copyFeedbackTimer) {
        clearTimeout(this.copyFeedbackTimer);
      }
      this.copyFeedbackTimer = setTimeout(() => {
        this.copyFeedback = false;
      }, COPY_FEEDBACK_MS);
    } catch {
      // clipboard may be unavailable
    }
  }

  clearBuildLog(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.buildLog.trim()) {
      return;
    }
    this.uploadManager.clearBuildLog();
    this.copyFeedback = false;
    if (this.copyFeedbackTimer) {
      clearTimeout(this.copyFeedbackTimer);
      this.copyFeedbackTimer = null;
    }
  }

  downloadHex(event: MouseEvent): void {
    event.stopPropagation();
    const hexContent = this.lastCompileResult?.hexContent;
    if (!hexContent) {
      return;
    }

    const blob = new Blob([hexContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sketch.hex';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  onResizeStart(event: PointerEvent): void {
    if (!this.isOpen) {
      return;
    }

    event.preventDefault();
    this.isResizing = true;
    this.resizeStartY = event.clientY;
    this.resizeStartHeight = this.panelHeight;
    this.activeResizePointerId = event.pointerId;
    this.resizeHandle.nativeElement.setPointerCapture(event.pointerId);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerEnd);
    window.addEventListener('pointercancel', this.onPointerEnd);
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.abortResize();
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.isResizing || event.pointerId !== this.activeResizePointerId) {
      return;
    }

    const delta = this.resizeStartY - event.clientY;
    this.panelHeight = this.buildLogPanelService.clampHeight(this.resizeStartHeight + delta);
  }

  private handlePointerEnd(event: PointerEvent): void {
    if (event.pointerId !== this.activeResizePointerId) {
      return;
    }
    this.finishResize();
  }

  private finishResize(): void {
    if (!this.isResizing) {
      return;
    }
    this.buildLogPanelService.setPanelHeight(this.panelHeight);
    this.abortResize();
  }

  private abortResize(): void {
    if (this.activeResizePointerId != null) {
      try {
        this.resizeHandle?.nativeElement.releasePointerCapture(this.activeResizePointerId);
      } catch {
        // ignore if capture was already released
      }
    }
    this.isResizing = false;
    this.activeResizePointerId = null;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerEnd);
    window.removeEventListener('pointercancel', this.onPointerEnd);
  }
}
