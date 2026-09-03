import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
} from "@angular/core";
import * as Blockly from "blockly";
import { BlocksLoaderService } from "../../services/blocks-loader.service";
import { BlocklyService } from "../../services/blockly.service";
import { DeviceManagerService } from "../../../device/services/device-manager.service";
import { DEFAULT_WORKSPACE_OPTIONS } from "../../constants";
import {
  getBlocklyTheme,
  BLOCKLY_GRID_COLOURS,
  ResolvedAppTheme,
} from "../../constants/blockly-themes";
import { scheduleToolboxIcons } from "../../lib/toolbox/toolbox-icons.helper";
import { scheduleToolboxCategories } from "../../lib/toolbox/toolbox-categories.helper";
import { scheduleWorkspaceRerender } from "../../lib/helpers/workspace-render.helper";
import { registerVariablesFlyoutOnWorkspace } from "../../lib/toolbox/variables-flyout.helper";
import { registerProceduresFlyoutOnWorkspace } from "../../lib/toolbox/procedures-flyout.helper";
import { normalizeVariableTypes } from "../../lib/variables/variable-type.helper";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { WorkspaceStorageService } from "@app/modules/storage/workspace-storage.service";
import { ThemeService } from "@app/core/services/theme.service";
import { ToolboxLevelService } from "../../services/toolbox-level.service";
import { ProjectActionsService } from "../../services/project-actions.service";
import { BlockLevelE } from "../../types/block.types";
import { CodeEditorService } from "@app/modules/code-editor/services/code-editor.service";
import { Subscription } from "rxjs";

/**
 * Blockly Editor Component
 */
@Component({
  selector: "app-blockly-editor",
  templateUrl: "./blockly-editor.component.html",
  styleUrls: ["./blockly-editor.component.scss"],
})
export class BlocklyEditorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("blocklyDiv", { static: false }) blocklyDiv!: ElementRef<HTMLElement>;

  private workspace: Blockly.WorkspaceSvg | null = null;
  private toolboxConfig: ToolboxDefinition | null = null;
  private themeSubscription: Subscription | null = null;
  private levelSubscription: Subscription | null = null;
  private layoutSubscription: Subscription | null = null;
  private containerResizeObserver: ResizeObserver | null = null;
  private resizeAnimationFrame: number | null = null;
  private codeGenTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private blocksLoader: BlocksLoaderService,
    private blocklyService: BlocklyService,
    private deviceManager: DeviceManagerService,
    private storage: WorkspaceStorageService,
    private themeService: ThemeService,
    private toolboxLevelService: ToolboxLevelService,
    private projectActions: ProjectActionsService,
    private codeEditorService: CodeEditorService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    Blockly.utils.colour.setHsvSaturation(0.5);
    Blockly.utils.colour.setHsvValue(0.7);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.loadBlocksAndInitialize();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.themeSubscription = null;
    this.levelSubscription?.unsubscribe();
    this.levelSubscription = null;
    this.layoutSubscription?.unsubscribe();
    this.layoutSubscription = null;
    this.containerResizeObserver?.disconnect();
    this.containerResizeObserver = null;
    if (this.resizeAnimationFrame !== null) {
      cancelAnimationFrame(this.resizeAnimationFrame);
      this.resizeAnimationFrame = null;
    }
    if (this.codeGenTimer) {
      clearTimeout(this.codeGenTimer);
      this.codeGenTimer = null;
    }
    if (this.workspace) {
      this.projectActions.unregister();
      this.workspace.dispose();
      this.workspace = null;
    }
  }

  /**
   * Load blocks and initialize Blockly
   */
  private async loadBlocksAndInitialize(): Promise<void> {
    try {
      // Check storage version compatibility
      const storageCheck = await this.storage.initialize();
      if (!storageCheck.compatible) {
        this.handleIncompatibleStorage(storageCheck.data);
      }

      // Load blocks and generators
      await this.blocksLoader.loadAllBlocks();

      // Load toolbox for the current board
      console.log(
        "===============BLOCKLY EDITOR",
        this.deviceManager.getSelectedBoard()
      );
      const board = this.deviceManager.getSelectedBoard();
      this.toolboxConfig = await this.blocksLoader.loadToolbox(board.id);

      // Initialize Blockly workspace
      this.initializeBlockly();
      this.projectActions.register({
        getWorkspace: () => this.workspace,
      });

      // Load saved workspace if exists
      if (this.workspace && (await this.storage.hasSavedData())) {
        const loaded = await this.storage.loadWorkspace(this.workspace);
        if (loaded) {
          normalizeVariableTypes(this.workspace);
          scheduleWorkspaceRerender(this.workspace);
          console.log("✅ Workspace loaded from auto-save");
        }
      }

      // Subscribe to board change and save to settings
      this.deviceManager.selectedBoard$.subscribe(async (board) => {
        if (board && this.workspace) {
          await this.refreshToolbox(board.id);
          await this.saveCurrentSettings();
        }
      });

      // Subscribe to toolbox level changes
      this.levelSubscription = this.toolboxLevelService.level$.subscribe(
        async (level) => {
          if (!this.workspace) {
            return;
          }
          const board = this.deviceManager.getSelectedBoard();
          await this.refreshToolbox(board.id, level);
        }
      );

      // Subscribe to port change and save to settings
      this.deviceManager.selectedPort$.subscribe(async (port) => {
        if (port) {
          await this.saveCurrentSettings();
        }
      });

      // Listen for language changes
      window.addEventListener("language-changed", async (event: any) => {
        if (this.workspace && this.toolboxConfig) {
          console.log(
            "🌐 Refreshing toolbox for new language:",
            event.detail?.language
          );

          // Save workspace state before updating
          const workspaceState = Blockly.serialization.workspaces.save(
            this.workspace
          );

          // Reload toolbox with new translations
          const board = this.deviceManager.getSelectedBoard();
          await this.refreshToolbox(board.id);

          // Reload workspace with new translations (avoid workspace.clear() —
          // Blockly 13 throws "Non-empty variable map" when variables exist)
          this.reloadWorkspaceFromState(workspaceState);

          console.log("✅ Toolbox and workspace refreshed successfully");
        }
      });
    } catch (err) {
      console.error("Failed to load blocks:", err);
      // Initialize Blockly with default toolbox
      this.initializeBlockly();
      this.projectActions.register({
        getWorkspace: () => this.workspace,
      });
    }
  }

  /** Reload toolbox for the current board and optional difficulty level. */
  private async refreshToolbox(
    boardId: string,
    userLevel?: BlockLevelE
  ): Promise<void> {
    if (!this.workspace) {
      return;
    }

    const newToolbox = await this.blocksLoader.loadToolbox(boardId, userLevel);
    this.toolboxConfig = newToolbox;
    this.workspace.updateToolbox(newToolbox);
    this.setupToolboxIcons();
    this.workspace.refreshToolboxSelection();
  }

  /**
   * Initialize Blockly workspace
   */
  private initializeBlockly(): void {
    if (!this.blocklyDiv) {
      console.error("Blockly div not found");
      return;
    }

    const resolvedTheme = this.themeService.currentResolvedTheme;

    this.ngZone.runOutsideAngular(() => {
      this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
        toolbox: this.toolboxConfig,
        ...DEFAULT_WORKSPACE_OPTIONS,
        theme: getBlocklyTheme(resolvedTheme),
        grid: {
          ...DEFAULT_WORKSPACE_OPTIONS.grid!,
          colour: BLOCKLY_GRID_COLOURS[resolvedTheme],
        },
      });

      this.workspace.addChangeListener((event: Blockly.Events.Abstract) => {
        this.ngZone.run(() => this.onWorkspaceChange(event));
        this.scheduleCodeGeneration(event);
        this.onToolboxChange(event);
      });

      registerVariablesFlyoutOnWorkspace(this.workspace);
      registerProceduresFlyoutOnWorkspace(this.workspace);

      Blockly.svgResize(this.workspace);
      this.updateGridColour(resolvedTheme);
    });

    this.themeSubscription = this.themeService.onResolvedThemeChange.subscribe(
      (theme) => this.applyBlocklyTheme(theme)
    );

    this.setupContainerResizeObserver();
    this.layoutSubscription = this.codeEditorService.panelOpenChange$.subscribe(() => {
      this.scheduleWorkspaceResize();
    });

    if (this.codeEditorService.isPanelOpen()) {
      this.scheduleWorkspaceResize();
    }

    this.setupToolboxIcons();
    this.scheduleCodeGeneration();
  }

  /** Debounced code generation — skips UI/drag events. */
  private scheduleCodeGeneration(event?: Blockly.Events.Abstract): void {
    if (
      event &&
      [
        Blockly.Events.UI,
        Blockly.Events.CLICK,
        Blockly.Events.VIEWPORT_CHANGE,
        Blockly.Events.BUBBLE_OPEN,
        Blockly.Events.BLOCK_MOVE,
        Blockly.Events.SELECTED,
      ].includes(event.type as any)
    ) {
      return;
    }

    if (this.codeGenTimer) {
      clearTimeout(this.codeGenTimer);
    }

    this.codeGenTimer = setTimeout(() => {
      this.ngZone.run(() => {
        const code = this.generateCode();
        console.log(code);
      });
    }, 200);
  }

  /** Attach SVG icons to toolbox categories after toolbox/flyout updates. */
  private setupToolboxIcons(): void {
    this.ngZone.runOutsideAngular(() => {
      const findToolbox = (): HTMLElement | null =>
        (this.blocklyDiv?.nativeElement?.querySelector('.blocklyToolboxDiv') ??
          this.blocklyDiv?.nativeElement?.querySelector('.blocklyToolbox') ??
          document.querySelector('.blocklyToolboxDiv') ??
          document.querySelector('.blocklyToolbox')) as HTMLElement | null;

      const attach = () => {
        const toolboxDiv = findToolbox();
        if (!toolboxDiv) {
          return;
        }
        scheduleToolboxIcons(toolboxDiv);
        scheduleToolboxCategories(toolboxDiv);
      };

      attach();
      setTimeout(attach, 150);
    });
  }

  /** Re-layout flyout after category selection; refresh toolbox icons safely. */
  private onToolboxChange(event: Blockly.Events.Abstract): void {
    if (event.type !== Blockly.Events.TOOLBOX_ITEM_SELECT || !this.workspace) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.workspace) {
          Blockly.svgResize(this.workspace);
        }
        this.setupToolboxIcons();
      }, 0);
    });
  }

  /** Switch Blockly workspace theme (background, toolbox, flyout, scrollbars). */
  private applyBlocklyTheme(resolved: ResolvedAppTheme): void {
    if (!this.workspace) {
      return;
    }

    this.workspace.setTheme(getBlocklyTheme(resolved));
    this.updateGridColour(resolved);
    scheduleWorkspaceRerender(this.workspace);
  }

  private updateGridColour(resolved: ResolvedAppTheme): void {
    const colour = BLOCKLY_GRID_COLOURS[resolved];
    const root = this.blocklyDiv?.nativeElement;

    // Blockly 13 renders grid as an SVG pattern (not .blocklyGridLine).
    root
      ?.querySelectorAll('pattern[id^="blocklyGridPattern"] line')
      .forEach((line) => {
        line.setAttribute('stroke', colour);
      });
  }

  private setupContainerResizeObserver(): void {
    const container = this.blocklyDiv?.nativeElement?.parentElement;
    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.containerResizeObserver = new ResizeObserver(() => {
      this.scheduleWorkspaceResize();
    });
    this.containerResizeObserver.observe(container);
    this.containerResizeObserver.observe(this.blocklyDiv.nativeElement);
  }

  private scheduleWorkspaceResize(): void {
    if (this.workspace) {
      Blockly.svgResize(this.workspace);
    }

    if (this.resizeAnimationFrame !== null) {
      cancelAnimationFrame(this.resizeAnimationFrame);
    }

    this.resizeAnimationFrame = requestAnimationFrame(() => {
      this.resizeAnimationFrame = null;
      if (this.workspace) {
        Blockly.svgResize(this.workspace);
      }
    });
  }

  /**
   * Replace workspace contents from saved state without workspace.clear().
   * Blockly 13 VariableMap.clear() throws when variables still exist.
   */
  private reloadWorkspaceFromState(state: object): void {
    if (!this.workspace) {
      return;
    }

    Blockly.Events.disable();
    try {
      this.workspace.getTopBlocks(false).forEach((block) => block.dispose(false));

      const variableMap = this.workspace.getVariableMap();
      [...variableMap.getAllVariables()].forEach((variable) => {
        variableMap.deleteVariable(variable);
      });

      Blockly.serialization.workspaces.load(state, this.workspace, {
        recordUndo: false,
      });

      this.workspace.refreshToolboxSelection();
    } finally {
      Blockly.Events.enable();
    }

    scheduleWorkspaceRerender(this.workspace);
  }

  /**
   * Handler for workspace changes
   */
  private onWorkspaceChange(event: Blockly.Events.Abstract): void {
    // Auto-save workspace on changes (except UI events like selection)
    if (
      event.type !== Blockly.Events.UI &&
      event.type !== Blockly.Events.VIEWPORT_CHANGE &&
      this.workspace
    ) {
      this.storage.saveWorkspace(this.workspace, true); // with debounce
    }
  }

  /**
   * Generate code from blocks
   */
  public generateCode(language: string = "Arduino"): string {
    if (!this.workspace) return "";

    try {
      // Arduino generator is loaded through JavaScript files
      // and available through the global object window.Blockly
      const BlocklyGlobal = (window as any).Blockly;

      if (
        BlocklyGlobal &&
        BlocklyGlobal.Arduino &&
        typeof BlocklyGlobal.Arduino.workspaceToCode === "function"
      ) {
        const code = BlocklyGlobal.Arduino.workspaceToCode(this.workspace);
        this.blocklyService.updateCode(code);
        return code;
      } else {
        // Arduino generator is not loaded yet
        this.blocklyService.updateCode("");
        return "";
      }
    } catch (err) {
      console.error("Error generating code:", err);
      return "";
    }
  }

  /**
   * Load blocks from JSON
   */
  public loadFromJson(json: string | object): void {
    if (!this.workspace) {
      return;
    }

    try {
      const state = typeof json === "string" ? JSON.parse(json) : json;
      Blockly.serialization.workspaces.load(state, this.workspace);
      scheduleWorkspaceRerender(this.workspace);
    } catch (err) {
      console.error("Error loading JSON:", err);
    }
  }

  /**
   * Clear the workspace
   */
  public clear(): void {
    if (this.workspace) {
      this.workspace.clear();
    }
  }

  /**
   * Save current app settings
   */
  private async saveCurrentSettings(): Promise<void> {
    const board = this.deviceManager.getSelectedBoard();
    const port = this.deviceManager.getSelectedPort();

    await this.storage.saveSettings({
      selectedBoard: board.id,
      selectedPort: port?.path,
    });
  }

  /**
   * Handle incompatible storage version
   */
  private handleIncompatibleStorage(data: any): void {
    const message = `
Version of saved data is outdated and incompatible with the current version of the application.

Saved data will be cleared after pressing OK.
    `.trim();

    if (confirm(message)) {
      this.storage.clearStorage();
      console.log("✅ Incompatible storage cleared");
    }
  }

  /**
   * Get storage info
   */
  public async getStorageInfo() {
    return await this.storage.getStorageInfo();
  }
}
