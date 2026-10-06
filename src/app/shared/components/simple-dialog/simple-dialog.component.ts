import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SimpleDialogConfig } from './simple-dialog.model';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss'],
})
export class SimpleDialogComponent {
  @Input({ required: true }) config!: SimpleDialogConfig;
  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  get primaryLabelKey(): string {
    if (this.config.primaryKey) {
      return this.config.primaryKey;
    }
    return this.config.mode === 'confirm' ? 'ui.btn_confirm' : 'ui.btn_ok';
  }

  get secondaryLabelKey(): string {
    return this.config.secondaryKey ?? 'ui.btn_close';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (this.config.mode === 'confirm') {
      this.secondary.emit();
      return;
    }
    this.dismiss.emit();
  }

  onPrimaryClick(): void {
    this.primary.emit();
  }

  onSecondaryClick(): void {
    this.secondary.emit();
  }
}
