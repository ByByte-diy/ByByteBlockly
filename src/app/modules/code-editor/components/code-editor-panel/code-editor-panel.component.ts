import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { cpp } from '@codemirror/lang-cpp';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { Compartment, EditorState } from '@codemirror/state';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { ThemeService, ResolvedAppTheme } from '@core/services/theme.service';
import { getEditorTheme } from '../../constants/editor-theme.config';
import { CodeEditorService } from '../../services/code-editor.service';

const COPY_ICON = "url('assets/icons/header/copy.svg')";
const CLOSE_ICON = "url('assets/icons/header/close.svg')";

@Component({
  selector: 'app-code-editor-panel',
  templateUrl: './code-editor-panel.component.html',
  styleUrls: ['./code-editor-panel.component.scss'],
  host: {
    class: 'code-editor-panel-host',
    '[class.code-editor-panel-host--open]': 'isOpen',
    '[class.code-editor-panel-host--resizing]': 'isResizing',
    '[style.--panel-width.px]': 'panelWidth',
  },
})
export class CodeEditorPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  @ViewChild('resizeHandle', { static: true })
  private readonly resizeHandle!: ElementRef<HTMLDivElement>;

  private readonly codeEditorService = inject(CodeEditorService);
  private readonly themeService = inject(ThemeService);
  private readonly ngZone = inject(NgZone);

  readonly copyIcon = COPY_ICON;
  readonly closeIcon = CLOSE_ICON;

  isOpen = this.codeEditorService.isPanelOpen();
  isDirty = false;
  panelWidth = this.codeEditorService.getPanelWidth();
  isResizing = false;

  private view: EditorView | null = null;
  private readonly themeCompartment = new Compartment();
  private suppressEditorChange = false;
  private subscriptions: Subscription[] = [];
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private activeResizePointerId: number | null = null;
  private readonly onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private readonly onPointerEnd = (event: PointerEvent) => this.handlePointerEnd(event);

  ngOnInit(): void {
    this.subscriptions.push(
      this.codeEditorService.isOpen$.subscribe((open) => {
        this.abortResize();
        this.isOpen = open;
        this.panelWidth = this.codeEditorService.getPanelWidth();
        if (open) {
          queueMicrotask(() => this.view?.requestMeasure());
        }
      }),
    );

    this.subscriptions.push(
      this.codeEditorService.panelWidth$.subscribe((width) => {
        if (this.panelWidth !== width) {
          this.panelWidth = width;
        }
      }),
    );

    this.subscriptions.push(
      this.codeEditorService.isDirty$.subscribe((dirty) => {
        this.isDirty = dirty;
      }),
    );

    this.subscriptions.push(
      this.codeEditorService.editorContent$.subscribe((content) => {
        this.setEditorDocument(content);
      }),
    );

    this.subscriptions.push(
      this.themeService.onResolvedThemeChange.subscribe((resolved) => {
        this.applyTheme(resolved);
      }),
    );
  }

  ngAfterViewInit(): void {
    try {
      this.initEditor();
    } catch (error) {
      console.error('Code editor initialization failed:', error);
    }
  }

  ngOnDestroy(): void {
    this.abortResize();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.view?.destroy();
    this.view = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const clamped = this.codeEditorService.clampPanelWidth(this.panelWidth);
    if (clamped !== this.panelWidth) {
      this.codeEditorService.setPanelWidth(clamped);
    }
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    if (this.isResizing) {
      this.commitResize();
    }
  }

  onClose(event?: MouseEvent): void {
    event?.stopPropagation();
    this.abortResize();
    this.codeEditorService.closePanel();
  }

  onResetToGenerated(event?: MouseEvent): void {
    event?.stopPropagation();
    this.codeEditorService.resetToGenerated();
  }

  async onCopy(event?: MouseEvent): Promise<void> {
    event?.stopPropagation();
    try {
      await this.codeEditorService.copyToClipboard();
    } catch {
      // Clipboard may be unavailable in some contexts.
    }
  }

  onResizeStart(event: PointerEvent): void {
    if (!this.isOpen || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.runInAngularZone(() => {
      this.isResizing = true;
      this.resizeStartX = event.clientX;
      this.resizeStartWidth = this.panelWidth;
      this.activeResizePointerId = event.pointerId;
    });

    this.resizeHandle.nativeElement.setPointerCapture(event.pointerId);
    document.body.classList.add('code-editor-panel-resizing');
    document.addEventListener('pointermove', this.onPointerMove, { passive: false });
    document.addEventListener('pointerup', this.onPointerEnd);
    document.addEventListener('pointercancel', this.onPointerEnd);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (
      !this.isResizing ||
      this.activeResizePointerId === null ||
      event.pointerId !== this.activeResizePointerId
    ) {
      return;
    }

    event.preventDefault();

    const delta = this.resizeStartX - event.clientX;
    const nextWidth = this.codeEditorService.clampPanelWidth(this.resizeStartWidth + delta);

    if (nextWidth === this.panelWidth) {
      return;
    }

    this.runInAngularZone(() => {
      this.panelWidth = nextWidth;
    });
  }

  private handlePointerEnd(event: PointerEvent): void {
    if (
      !this.isResizing ||
      this.activeResizePointerId === null ||
      event.pointerId !== this.activeResizePointerId
    ) {
      return;
    }

    this.runInAngularZone(() => this.commitResize());
  }

  private abortResize(): void {
    this.detachResizeListeners();
    this.isResizing = false;
    this.activeResizePointerId = null;
  }

  private commitResize(): void {
    this.detachResizeListeners();

    if (!this.isResizing) {
      this.activeResizePointerId = null;
      return;
    }

    this.isResizing = false;
    this.activeResizePointerId = null;
    this.codeEditorService.setPanelWidth(this.panelWidth, true);
  }

  private detachResizeListeners(): void {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerEnd);
    document.removeEventListener('pointercancel', this.onPointerEnd);
    document.body.classList.remove('code-editor-panel-resizing');

    if (this.activeResizePointerId !== null && this.resizeHandle?.nativeElement) {
      try {
        if (this.resizeHandle.nativeElement.hasPointerCapture(this.activeResizePointerId)) {
          this.resizeHandle.nativeElement.releasePointerCapture(this.activeResizePointerId);
        }
      } catch {
        // Pointer may already be released.
      }
    }
  }

  private runInAngularZone(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }

  private initEditor(): void {
    const resolved = this.themeService.currentResolvedTheme;

    this.view = new EditorView({
      state: EditorState.create({
        doc: this.codeEditorService.getEffectiveCode(),
        extensions: this.buildExtensions(resolved),
      }),
      parent: this.editorHost.nativeElement,
    });
  }

  private buildExtensions(resolved: ResolvedAppTheme) {
    return [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      cpp(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      this.themeCompartment.of(getEditorTheme(resolved)),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged || this.suppressEditorChange) {
          return;
        }

        const value = update.state.doc.toString();
        this.codeEditorService.setEditedCode(value);
      }),
      EditorView.theme({
        '&': { height: '100%' },
        '.cm-scroller': { overflow: 'auto' },
      }),
    ];
  }

  private setEditorDocument(content: string): void {
    if (!this.view) {
      return;
    }

    const current = this.view.state.doc.toString();
    if (current === content) {
      return;
    }

    this.suppressEditorChange = true;
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: content,
      },
    });
    this.suppressEditorChange = false;
  }

  private applyTheme(resolved: ResolvedAppTheme): void {
    if (!this.view) {
      return;
    }

    this.view.dispatch({
      effects: this.themeCompartment.reconfigure(getEditorTheme(resolved)),
    });
  }
}
