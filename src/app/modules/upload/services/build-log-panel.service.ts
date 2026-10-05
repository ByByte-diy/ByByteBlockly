import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UploadManagerService } from './upload-manager.service';

const PANEL_OPEN_STORAGE_KEY = 'build-log-panel-open';
const PANEL_HEIGHT_STORAGE_KEY = 'build-log-panel-height';

export const BUILD_LOG_PANEL_DEFAULT_HEIGHT = 220;
export const BUILD_LOG_PANEL_MIN_HEIGHT = 120;
export const BUILD_LOG_PANEL_MAX_HEIGHT_RATIO = 0.5;

@Injectable({
  providedIn: 'root',
})
export class BuildLogPanelService {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(this.loadPanelOpenState());
  private readonly panelHeightSubject = new BehaviorSubject<number>(this.loadPanelHeight());

  readonly isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  readonly panelHeight$: Observable<number> = this.panelHeightSubject.asObservable();

  constructor(
    private readonly uploadManager: UploadManagerService,
    private readonly ngZone: NgZone,
  ) {
    this.uploadManager.compileResult$.subscribe((result) => {
      if (result && !result.success) {
        this.openPanel();
      }
    });
  }

  isPanelOpen(): boolean {
    return this.isOpenSubject.value;
  }

  togglePanel(): void {
    this.setPanelOpen(!this.isOpenSubject.value);
  }

  openPanel(): void {
    this.setPanelOpen(true);
  }

  closePanel(): void {
    this.setPanelOpen(false);
  }

  getPanelHeight(): number {
    return this.panelHeightSubject.value;
  }

  setPanelHeight(height: number): void {
    this.runInAngularZone(() => {
      const clamped = this.clampHeight(height);
      this.panelHeightSubject.next(clamped);
      this.persistPanelHeight(clamped);
    });
  }

  clampHeight(height: number): number {
    const maxHeight = Math.floor(window.innerHeight * BUILD_LOG_PANEL_MAX_HEIGHT_RATIO);
    return Math.max(BUILD_LOG_PANEL_MIN_HEIGHT, Math.min(maxHeight, Math.round(height)));
  }

  private setPanelOpen(open: boolean): void {
    this.runInAngularZone(() => {
      if (this.isOpenSubject.value === open) {
        return;
      }

      this.isOpenSubject.next(open);
      try {
        localStorage.setItem(PANEL_OPEN_STORAGE_KEY, open ? '1' : '0');
      } catch {
        // ignore storage errors
      }
    });
  }

  /** Header clicks run outside Angular zone (see zone-flags.ts). */
  private runInAngularZone(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }

  private loadPanelOpenState(): boolean {
    try {
      return localStorage.getItem(PANEL_OPEN_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private loadPanelHeight(): number {
    try {
      const stored = Number(localStorage.getItem(PANEL_HEIGHT_STORAGE_KEY));
      if (Number.isFinite(stored) && stored > 0) {
        return this.clampHeight(stored);
      }
    } catch {
      // ignore storage errors
    }
    return BUILD_LOG_PANEL_DEFAULT_HEIGHT;
  }

  private persistPanelHeight(height: number): void {
    try {
      localStorage.setItem(PANEL_HEIGHT_STORAGE_KEY, String(height));
    } catch {
      // ignore storage errors
    }
  }
}
