import { Injectable } from '@angular/core';
import * as Blockly from 'blockly';
import { WorkspaceStorageService } from '@app/modules/storage/workspace-storage.service';
import { DeviceManagerService } from '@app/modules/device/services/device-manager.service';
import { scheduleWorkspaceRerender } from '../lib/helpers/workspace-render.helper';

export interface IProjectActionsContext {
  getWorkspace: () => Blockly.WorkspaceSvg | null;
}

@Injectable({ providedIn: 'root' })
export class ProjectActionsService {
  private context: IProjectActionsContext | null = null;

  constructor(
    private readonly storage: WorkspaceStorageService,
    private readonly deviceManager: DeviceManagerService,
  ) {}

  register(context: IProjectActionsContext): void {
    this.context = context;
  }

  unregister(): void {
    this.context = null;
  }

  isReady(): boolean {
    return this.context?.getWorkspace() != null;
  }

  async newProject(): Promise<void> {
    const workspace = this.requireWorkspace();
    const message =
      (Blockly.Msg['NEW_PROJECT_CONFIRM'] as string) ||
      'Create a new project? Unsaved changes will be lost.';
    if (!confirm(message)) return;

    workspace.clear();
    scheduleWorkspaceRerender(workspace);
    await this.storage.saveWorkspace(workspace, false);
  }

  async saveProject(): Promise<void> {
    const workspace = this.requireWorkspace();
    await this.storage.saveWorkspace(workspace, false);
  }

  async saveAs(): Promise<void> {
    const workspace = this.requireWorkspace();
    const board = this.deviceManager.getSelectedBoard();
    const port = this.deviceManager.getSelectedPort();
    const settings = {
      selectedBoard: board.id,
      selectedPort: port?.path,
    };
    const projectXml = this.storage.exportWorkspaceToBBB(workspace, settings);
    const blob = new Blob([projectXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.bbb`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async openProject(): Promise<void> {
    const workspace = this.requireWorkspace();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bbb,.xml';

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const xmlContent = event.target?.result as string;
          const parsed = this.storage.parseProjectFile(xmlContent);
          this.storage.loadWorkspaceFromXml(workspace, parsed.workspaceXml);
          scheduleWorkspaceRerender(workspace);
          await this.storage.saveWorkspace(workspace, false);
        } catch {
          const message =
            (Blockly.Msg['IMPORT_ERROR'] as string) ||
            'Import error. Check the file format.';
          alert(message);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  private requireWorkspace(): Blockly.WorkspaceSvg {
    const workspace = this.context?.getWorkspace();
    if (!workspace) {
      throw new Error('Workspace not initialized');
    }
    return workspace;
  }
}
