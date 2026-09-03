import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { BlocklyService } from '../../blockly/services/blockly.service';
import { ICodeSource } from '../interfaces/code-source.interface';

const PANEL_OPEN_STORAGE_KEY = 'code-panel-open';
const PANEL_WIDTH_STORAGE_KEY = 'code-panel-width';
export const CODE_PANEL_DEFAULT_WIDTH = 420;
export const CODE_PANEL_MIN_WIDTH = 280;
export const CODE_PANEL_MAX_WIDTH_RATIO = 0.65;

/**
 * Manages generated/edited code state and panel visibility.
 * One-way sync from Blockly when the editor is not dirty.
 */
@Injectable({
  providedIn: 'root',
})
export class CodeEditorService extends ICodeSource implements OnDestroy {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(this.loadPanelOpenState());
  private readonly isDirtySubject = new BehaviorSubject<boolean>(false);
  private readonly editorContentSubject = new BehaviorSubject<string>('');
  private readonly panelOpenChangeSubject = new Subject<boolean>();
  private readonly panelWidthSubject = new BehaviorSubject<number>(
    this.loadPanelWidth(),
  );

  private generatedCode = '';
  private editedCode = '';
  private blocklySubscription: Subscription;

  readonly isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  readonly isDirty$: Observable<boolean> = this.isDirtySubject.asObservable();
  readonly editorContent$: Observable<string> = this.editorContentSubject.asObservable();
  readonly panelOpenChange$ = this.panelOpenChangeSubject.asObservable();
  readonly panelWidth$ = this.panelWidthSubject.asObservable();

  constructor(
    private readonly blocklyService: BlocklyService,
    private readonly ngZone: NgZone,
  ) {
    super();
    this.blocklySubscription = this.blocklyService.code$.subscribe((code) => {
      this.onGeneratedCodeChange(code);
    });
  }

  ngOnDestroy(): void {
    this.blocklySubscription.unsubscribe();
    this.panelOpenChangeSubject.complete();
  }

  isPanelOpen(): boolean {
    return this.isOpenSubject.value;
  }

  togglePanel(): void {
    this.setPanelOpen(!this.isOpenSubject.value);
  }

  setPanelOpen(open: boolean): void {
    this.runInAngularZone(() => {
      if (this.isOpenSubject.value === open) {
        return;
      }

      this.isOpenSubject.next(open);
      localStorage.setItem(PANEL_OPEN_STORAGE_KEY, open ? '1' : '0');
      this.panelOpenChangeSubject.next(open);

      if (open) {
        const width = this.clampPanelWidth(this.panelWidthSubject.value);
        if (width !== this.panelWidthSubject.value) {
          this.panelWidthSubject.next(width);
        }
      }
    });
  }

  closePanel(): void {
    this.setPanelOpen(false);
  }

  getPanelWidth(): number {
    return this.panelWidthSubject.value;
  }

  setPanelWidth(width: number, persist = true): void {
    this.runInAngularZone(() => {
      const clamped = this.clampPanelWidth(width);
      const changed = this.panelWidthSubject.value !== clamped;

      if (changed) {
        this.panelWidthSubject.next(clamped);
      }

      if (persist && changed) {
        localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, String(clamped));
      }
    });
  }

  getMaxPanelWidth(viewportWidth = window.innerWidth): number {
    return Math.max(
      CODE_PANEL_MIN_WIDTH,
      Math.floor(viewportWidth * CODE_PANEL_MAX_WIDTH_RATIO),
    );
  }

  clampPanelWidth(width: number, viewportWidth = window.innerWidth): number {
    return Math.min(
      this.getMaxPanelWidth(viewportWidth),
      Math.max(CODE_PANEL_MIN_WIDTH, Math.round(width)),
    );
  }

  setEditedCode(code: string): void {
    this.editedCode = code;
    this.isDirtySubject.next(true);
    this.editorContentSubject.next(code);
  }

  /** Called when the editor receives content without marking dirty (sync from blocks). */
  setEditorContent(code: string): void {
    this.editedCode = code;
    this.editorContentSubject.next(code);
  }

  getEffectiveCode(): string {
    return this.isDirtySubject.value ? this.editedCode : this.generatedCode;
  }

  isManuallyEdited(): boolean {
    return this.isDirtySubject.value;
  }

  resetToGenerated(): void {
    this.isDirtySubject.next(false);
    this.editedCode = this.generatedCode;
    this.editorContentSubject.next(this.generatedCode);
  }

  copyToClipboard(): Promise<void> {
    return navigator.clipboard.writeText(this.getEffectiveCode());
  }

  private onGeneratedCodeChange(code: string): void {
    this.generatedCode = code;

    if (!this.isDirtySubject.value) {
      this.editedCode = code;
      this.editorContentSubject.next(code);
    }
  }

  /** UI actions from header/panel may run outside Angular zone (see zone-flags.ts). */
  private runInAngularZone(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }

  private loadPanelOpenState(): boolean {
    return localStorage.getItem(PANEL_OPEN_STORAGE_KEY) === '1';
  }

  private loadPanelWidth(): number {
    const saved = Number(localStorage.getItem(PANEL_WIDTH_STORAGE_KEY));
    if (!Number.isFinite(saved) || saved <= 0) {
      return CODE_PANEL_DEFAULT_WIDTH;
    }

    return this.clampPanelWidth(saved);
  }
}
