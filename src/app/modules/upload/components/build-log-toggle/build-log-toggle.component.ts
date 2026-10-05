import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadStatus, UploadManagerService } from '../../services/upload-manager.service';
import { BuildLogPanelService } from '../../services/build-log-panel.service';

const TERMINAL_ICON = "url('assets/icons/header/terminal.svg')";

@Component({
  selector: 'app-build-log-toggle',
  template: `
    <button
      type="button"
      class="header-icon-btn"
      [class.header-icon-btn--active]="isOpen"
      [title]="'ui.btn_build_log' | translate"
      [attr.aria-label]="'ui.btn_build_log' | translate"
      [attr.aria-pressed]="isOpen"
      (click)="toggle($event)"
    >
      <span class="header-icon-mask" [style.--icon]="terminalIcon" aria-hidden="true"></span>
      @if (hasBuildLog) {
        <span
          class="build-log-toggle__dot"
          [class.build-log-toggle__dot--error]="hasError"
          aria-hidden="true"
        ></span>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        flex-shrink: 0;
        position: relative;
      }

      button {
        position: relative;
      }

      .build-log-toggle__dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--app-status-processing);

        &--error {
          background: var(--app-status-error);
        }
      }
    `,
  ],
})
export class BuildLogToggleComponent implements OnInit, OnDestroy {
  private readonly buildLogPanelService = inject(BuildLogPanelService);
  private readonly uploadManager = inject(UploadManagerService);
  private subscriptions: Subscription[] = [];

  readonly terminalIcon = TERMINAL_ICON;
  isOpen = false;
  hasBuildLog = false;
  hasError = false;

  ngOnInit(): void {
    this.isOpen = this.buildLogPanelService.isPanelOpen();
    this.subscriptions.push(
      this.buildLogPanelService.isOpen$.subscribe((open) => {
        this.isOpen = open;
      }),
    );
    this.subscriptions.push(
      this.uploadManager.buildLog$.subscribe((log) => {
        this.hasBuildLog = Boolean(log?.trim());
      }),
    );
    this.subscriptions.push(
      this.uploadManager.status$.subscribe((status) => {
        this.hasError = status === UploadStatus.ERROR;
        if (status === UploadStatus.ERROR) {
          this.hasBuildLog = true;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.buildLogPanelService.togglePanel();
  }
}
