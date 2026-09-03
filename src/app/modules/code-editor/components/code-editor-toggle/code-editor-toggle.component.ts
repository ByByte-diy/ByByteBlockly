import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CodeEditorService } from '../../services/code-editor.service';

const CODE_ICON = "url('assets/icons/header/code.svg')";

@Component({
  selector: 'app-code-editor-toggle',
  template: `
    <button
      type="button"
      class="header-icon-btn"
      [class.header-icon-btn--active]="isOpen"
      [title]="'ui.btn_code_panel' | translate"
      [attr.aria-label]="'ui.btn_code_panel' | translate"
      [attr.aria-pressed]="isOpen"
      (click)="toggle($event)"
    >
      <span class="header-icon-mask" [style.--icon]="codeIcon" aria-hidden="true"></span>
    </button>
  `,
})
export class CodeEditorToggleComponent implements OnInit, OnDestroy {
  private readonly codeEditorService = inject(CodeEditorService);
  private subscription: Subscription | null = null;

  readonly codeIcon = CODE_ICON;
  isOpen = false;

  ngOnInit(): void {
    this.isOpen = this.codeEditorService.isPanelOpen();
    this.subscription = this.codeEditorService.isOpen$.subscribe((open) => {
      this.isOpen = open;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.codeEditorService.togglePanel();
  }
}
