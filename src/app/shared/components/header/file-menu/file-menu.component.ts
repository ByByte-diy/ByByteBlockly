import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProjectActionsService } from '@app/modules/blockly/services/project-actions.service';
import {
  AssetCacheUiService,
  CompilerUpdateCheckResult,
} from '@app/modules/upload/services/asset-cache-ui.service';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';
import { SimpleDialogConfig } from '@shared/components/simple-dialog/simple-dialog.model';

const FOLDER_ICON = "url('assets/icons/header/folder.svg')";
const FILE_NEW_ICON = "url('assets/icons/header/file-new.svg')";
const FILE_OPEN_ICON = "url('assets/icons/header/file-open.svg')";
const FILE_SAVE_ICON = "url('assets/icons/header/file-save.svg')";

@Component({
  selector: 'app-file-menu',
  templateUrl: './file-menu.component.html',
})
export class FileMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly folderIcon = FOLDER_ICON;
  readonly fileNewIcon = FILE_NEW_ICON;
  readonly fileOpenIcon = FILE_OPEN_ICON;
  readonly fileSaveIcon = FILE_SAVE_ICON;
  open = false;
  dialog: SimpleDialogConfig | null = null;
  checkingCompilerUpdates = false;
  clearingDownloadCache = false;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly projectActions = inject(ProjectActionsService);
  private readonly translate = inject(TranslateService);
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly assetCacheUi = inject(AssetCacheUiService);
  private readonly popoverId = HEADER_POPOVER_IDS.file;
  private popoverSubscription?: Subscription;
  private dialogPrimaryAction?: () => void | Promise<void>;

  ngOnInit(): void {
    this.popoverSubscription = this.headerPopover.activeId$.subscribe((id) => {
      this.open = id === this.popoverId;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.popoverSubscription?.unsubscribe();
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  close(): void {
    this.headerPopover.close(this.popoverId);
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

  async onCheckCompilerUpdates(): Promise<void> {
    this.close();
    if (this.checkingCompilerUpdates) {
      return;
    }

    this.checkingCompilerUpdates = true;
    console.info('[FileMenu] Check compiler updates clicked');
    try {
      const result = await this.assetCacheUi.checkForCompilerUpdates();
      this.showCacheCheckResult(result);
    } catch (error: unknown) {
      console.warn('[FileMenu] Compiler update check failed:', error);
      this.showCacheCheckResult({
        status: 'error',
        invalidatedBundleIds: [],
        messageKey: 'ui.cache_check_failed',
        messageParams: {
          error: error instanceof Error ? error.message : String(error),
        },
      });
    } finally {
      this.checkingCompilerUpdates = false;
      this.cdr.detectChanges();
    }
  }

  onClearDownloadCache(): void {
    this.close();
    if (this.clearingDownloadCache) {
      return;
    }

    this.openDialog(
      {
        mode: 'confirm',
        titleKey: 'ui.cache_clear_title',
        messageKey: 'ui.cache_clear_confirm',
        primaryKey: 'ui.btn_confirm_clear',
      },
      () => void this.runClearDownloadCache(),
    );
  }

  onDialogPrimary(): void {
    const action = this.dialogPrimaryAction;
    this.closeDialog();
    void action?.();
  }

  onDialogSecondary(): void {
    this.closeDialog();
  }

  onDialogDismiss(): void {
    this.closeDialog();
  }

  private async runClearDownloadCache(): Promise<void> {
    this.clearingDownloadCache = true;
    console.info('[FileMenu] Clear download cache confirmed');
    try {
      await this.assetCacheUi.clearDownloadCache();
      this.openAlertDialog('ui.cache_clear_title_done', 'ui.cache_cleared');
    } catch (error: unknown) {
      console.warn('[FileMenu] Clear download cache failed:', error);
      this.openAlertDialog('ui.cache_clear_title_error', 'ui.cache_clear_failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.clearingDownloadCache = false;
      this.cdr.detectChanges();
    }
  }

  private showCacheCheckResult(result: CompilerUpdateCheckResult): void {
    const titleKey =
      result.status === 'error'
        ? 'ui.cache_check_title_error'
        : result.status === 'updated'
          ? 'ui.cache_check_title_updated'
          : 'ui.cache_check_title_up_to_date';

    this.openAlertDialog(titleKey, result.messageKey, result.messageParams);
  }

  private openAlertDialog(
    titleKey: string,
    messageKey: string,
    messageParams?: Record<string, string | number>,
  ): void {
    this.openDialog({
      mode: 'alert',
      titleKey,
      messageKey,
      messageParams,
    });
  }

  private openDialog(
    config: SimpleDialogConfig,
    primaryAction?: () => void | Promise<void>,
  ): void {
    this.dialog = config;
    this.dialogPrimaryAction = primaryAction;
    this.cdr.detectChanges();
  }

  private closeDialog(): void {
    this.dialog = null;
    this.dialogPrimaryAction = undefined;
    this.cdr.detectChanges();
  }

  private alertNotReady(): void {
    alert(this.translate.instant('ui.workspace_not_ready'));
  }
}
