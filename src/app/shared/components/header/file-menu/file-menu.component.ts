import {
  Component,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProjectActionsService } from '@app/modules/blockly/services/project-actions.service';

const FOLDER_ICON = "url('assets/icons/header/folder.svg')";

@Component({
  selector: 'app-file-menu',
  template: `
    <div class="header-dropdown">
      <button
        type="button"
        class="header-icon-btn"
        title="File"
        aria-label="File menu"
        (click)="toggle($event)"
      >
        <span class="header-icon-mask" [style.--icon]="folderIcon" aria-hidden="true"></span>
      </button>
      @if (open) {
        <div class="header-dropdown__menu" role="menu" aria-label="File menu">
          <button type="button" class="header-menu-item" (click)="onNew()">
            {{ 'ui.btn_new' | translate }}
          </button>
          <button type="button" class="header-menu-item" (click)="onOpen()">
            {{ 'ui.btn_open' | translate }}
          </button>
          <button type="button" class="header-menu-item" (click)="onSave()">
            {{ 'ui.btn_save' | translate }}
          </button>
          <button type="button" class="header-menu-item" (click)="onSaveAs()">
            {{ 'ui.btn_save_as' | translate }}
          </button>
        </div>
      }
    </div>
  `,
})
export class FileMenuComponent {
  readonly folderIcon = FOLDER_ICON;
  open = false;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly projectActions = inject(ProjectActionsService);
  private readonly translate = inject(TranslateService);

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

  async onNew(): Promise<void> {
    this.close();
    if (!this.projectActions.isReady()) {
      this.alertNotReady();
      return;
    }
    await this.projectActions.newProject();
  }

  async onOpen(): Promise<void> {
    this.close();
    if (!this.projectActions.isReady()) {
      this.alertNotReady();
      return;
    }
    await this.projectActions.openProject();
  }

  async onSave(): Promise<void> {
    this.close();
    if (!this.projectActions.isReady()) {
      this.alertNotReady();
      return;
    }
    await this.projectActions.saveProject();
  }

  async onSaveAs(): Promise<void> {
    this.close();
    if (!this.projectActions.isReady()) {
      this.alertNotReady();
      return;
    }
    await this.projectActions.saveAs();
  }

  private alertNotReady(): void {
    alert(this.translate.instant('ui.workspace_not_ready'));
  }
}
