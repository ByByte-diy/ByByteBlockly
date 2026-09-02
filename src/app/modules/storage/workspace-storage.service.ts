/**
 * Workspace Storage Service
 * Universal storage service with automatic platform detection
 *
 * Features:
 * - Auto-detection of platform (Web/Electron/Mobile)
 * - Automatic workspace saving on changes
 * - App settings persistence
 * - Version compatibility checking
 * - Export/Import functionality
 * - Cross-platform support
 *
 * Supported platforms:
 * - Web (localStorage)
 * - Electron (FileSystem)
 * - Future: Android, iOS, macOS native
 */

import { Injectable } from "@angular/core";
import * as Blockly from "blockly";
import {
  IStorageAdapter,
  IAdvancedStorageAdapter,
} from "./lib/storage-adapter.interface";
import { StorageAdapterFactory } from "./lib/storage-adapter.factory";

/**
 * Storage version (Semantic Versioning)
 */
const STORAGE_VERSION = "1.0.0";

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  VERSION: "storage_version",
  WORKSPACE: "workspace_autosave",
  SETTINGS: "app_settings",
  LAST_SAVED: "last_saved",
} as const;

/**
 * App settings interface
 */
export interface IAppSettings {
  selectedBoard?: string;
  selectedPort?: string;
  language?: string;
  theme?: string;
  /** Toolbox difficulty: 0 = Beginner, 1 = Middle, 2 = Pro */
  toolboxLevel?: number;
  [key: string]: any;
}

/**
 * Storage data structure
 */
export interface IStorageData {
  version: string;
  workspace?: string;
  settings?: IAppSettings;
  timestamp: number;
}

/**
 * Storage info
 */
export interface IStorageInfo {
  type: string;
  platform: string;
  available: boolean;
  size: number | null;
  capacity: number | null;
  location?: string | null;
}

@Injectable({
  providedIn: "root",
})
export class WorkspaceStorageService {
  private adapter!: IStorageAdapter;
  private adapterPromise: Promise<IStorageAdapter>;
  private autoSaveEnabled = true;
  private saveDebounceTimer: any = null;
  private readonly DEBOUNCE_DELAY = 1000; // 1 second

  constructor() {
    this.adapterPromise = this.initializeAdapter();
  }

  private async initializeAdapter(): Promise<IStorageAdapter> {
    this.adapter = await StorageAdapterFactory.createAdapter();
    console.log(
      `💾 Storage initialized: ${this.adapter.getType()} on ${this.adapter.getPlatform()}`
    );
    return this.adapter;
  }

  private async ensureAdapter(): Promise<IStorageAdapter> {
    if (!this.adapter) return this.adapterPromise;
    return this.adapter;
  }

  /**
   * Initialize storage service
   * Check version compatibility and load saved data
   */
  async initialize(): Promise<{ compatible: boolean; data?: IStorageData }> {
    try {
      await this.ensureAdapter();
      const savedVersion = await this.adapter.getItem(STORAGE_KEYS.VERSION);

      if (!savedVersion) {
        await this.setStorageVersion();
        return { compatible: true };
      }

      if (!this.isVersionCompatible(savedVersion)) {
        return {
          compatible: false,
          data: await this.loadStorageData(),
        };
      }

      return {
        compatible: true,
        data: await this.loadStorageData(),
      };
    } catch (error) {
      console.error("Error initializing workspace storage:", error);
      return { compatible: true };
    }
  }

  /**
   * Save workspace to storage
   */
  async saveWorkspace(
    workspace: Blockly.WorkspaceSvg,
    debounce = true
  ): Promise<void> {
    if (!this.autoSaveEnabled || !workspace) {
      return;
    }

    const doSave = async () => {
      try {
        await this.ensureAdapter();
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xml);

        await this.adapter.setItem(STORAGE_KEYS.WORKSPACE, xmlText);
        await this.adapter.setItem(
          STORAGE_KEYS.LAST_SAVED,
          Date.now().toString()
        );

        // console.log("✅ Workspace auto-saved");
      } catch (error) {
        console.error("❌ Error saving workspace:", error);
      }
    };

    if (debounce) {
      if (this.saveDebounceTimer) {
        clearTimeout(this.saveDebounceTimer);
      }
      this.saveDebounceTimer = setTimeout(doSave, this.DEBOUNCE_DELAY);
    } else {
      await doSave();
    }
  }

  /**
   * Load workspace from storage
   */
  async loadWorkspace(workspace: Blockly.WorkspaceSvg): Promise<boolean> {
    try {
      await this.ensureAdapter();
      const xmlText = await this.adapter.getItem(STORAGE_KEYS.WORKSPACE);

      if (!xmlText) {
        return false;
      }

      const xml = Blockly.utils.xml.textToDom(xmlText);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);

      console.log("✅ Workspace loaded from auto-save");
      return true;
    } catch (error) {
      console.error("❌ Error loading workspace:", error);
      return false;
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(settings: IAppSettings): Promise<void> {
    try {
      await this.ensureAdapter();
      const saved = (await this.loadSettings()) || {};
      const mergedSettings = { ...saved, ...settings };
      await this.adapter.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mergedSettings));
      console.log("✅ Settings saved");
    } catch (error) {
      console.error("❌ Error saving settings:", error);
    }
  }

  /**
   * Load app settings
   */
  async loadSettings(): Promise<IAppSettings | null> {
    try {
      await this.ensureAdapter();
      const settingsJson = await this.adapter.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) return null;
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error("❌ Error loading settings:", error);
      return null;
    }
  }

  /**
   * Clear all saved data
   */
  async clearStorage(): Promise<void> {
    try {
      await this.ensureAdapter();
      await this.adapter.clear();
      console.log("✅ Storage cleared");
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
    }
  }

  /**
   * Get last saved timestamp
   */
  async getLastSavedTime(): Promise<Date | null> {
    try {
      await this.ensureAdapter();
      const timestamp = await this.adapter.getItem(STORAGE_KEYS.LAST_SAVED);
      return timestamp ? new Date(parseInt(timestamp, 10)) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if there is saved data
   */
  async hasSavedData(): Promise<boolean> {
    try {
      await this.ensureAdapter();
      const workspace = await this.adapter.getItem(STORAGE_KEYS.WORKSPACE);
      return !!workspace;
    } catch (error) {
      return false;
    }
  }

  /**
   * Enable/disable auto-save
   */
  setAutoSaveEnabled(enabled: boolean): void {
    this.autoSaveEnabled = enabled;
  }

  /**
   * Check if auto-save is enabled
   */
  isAutoSaveEnabled(): boolean {
    return this.autoSaveEnabled;
  }

  /**
   * Export all data
   */
  async exportData(): Promise<IStorageData | null> {
    return await this.loadStorageData();
  }

  /**
   * Import data
   */
  async importData(data: IStorageData): Promise<boolean> {
    try {
      await this.ensureAdapter();
      if (data.workspace) {
        await this.adapter.setItem(STORAGE_KEYS.WORKSPACE, data.workspace);
      }
      if (data.settings) {
        await this.adapter.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(data.settings)
        );
      }
      await this.adapter.setItem(
        STORAGE_KEYS.LAST_SAVED,
        data.timestamp.toString()
      );
      await this.setStorageVersion(data.version);

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  /**
   * Get storage information
   */
  async getStorageInfo(): Promise<IStorageInfo> {
    await this.ensureAdapter();
    const size = await this.adapter.getSize();
    const capacity = await this.adapter.getCapacity();

    const info: IStorageInfo = {
      type: this.adapter.getType(),
      platform: this.adapter.getPlatform(),
      available: this.adapter.isAvailable(),
      size,
      capacity,
    };

    // Add location for advanced adapters
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;
    if (advancedAdapter.getStorageLocation) {
      info.location = advancedAdapter.getStorageLocation();
    }

    return info;
  }

  /**
   * Get storage location (for file-based adapters)
   */
  getStorageLocation(): string | null {
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;
    return advancedAdapter.getStorageLocation?.() || null;
  }

  /**
   * Create backup (for advanced adapters)
   */
  async createBackup(): Promise<string | null> {
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;

    if (advancedAdapter.createBackup) {
      return await advancedAdapter.createBackup();
    }

    console.warn("Backup not supported by current adapter");
    return null;
  }

  /**
   * Restore from backup (for advanced adapters)
   */
  async restoreBackup(backupPath: string): Promise<boolean> {
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;

    if (advancedAdapter.restoreBackup) {
      return await advancedAdapter.restoreBackup(backupPath);
    }

    console.warn("Restore not supported by current adapter");
    return false;
  }

  /**
   * Export to file (for advanced adapters)
   */
  async exportToFile(filePath: string): Promise<boolean> {
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;

    if (advancedAdapter.exportToFile) {
      return await advancedAdapter.exportToFile(filePath);
    }

    console.warn("Export to file not supported by current adapter");
    return false;
  }

  /**
   * Import from file (for advanced adapters)
   */
  async importFromFile(filePath: string): Promise<boolean> {
    const advancedAdapter = this.adapter as IAdvancedStorageAdapter;

    if (advancedAdapter.importFromFile) {
      return await advancedAdapter.importFromFile(filePath);
    }

    console.warn("Import from file not supported by current adapter");
    return false;
  }

  /**
   * Export workspace to .bbb XML format with metadata
   */
  exportWorkspaceToBBB(
    workspace: Blockly.WorkspaceSvg,
    settings: IAppSettings
  ): string {
    // Get workspace XML
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);

    // Create project structure with metadata
    const version = "1.0.0";
    const timestamp = new Date().toISOString();

    // Create XML wrapper with metadata
    const projectXml = `<?xml version="1.0" encoding="UTF-8"?>
<bybyte-project version="${version}" timestamp="${timestamp}">
  <metadata>
    <board>${settings.selectedBoard || ""}</board>
    <port>${settings.selectedPort || ""}</port>
  </metadata>
  <workspace>
${xmlText}
  </workspace>
</bybyte-project>`;

    return projectXml;
  }

  /**
   * Parse .bbb file and extract workspace XML and metadata
   */
  parseProjectFile(xmlContent: string): {
    workspaceXml: string;
    metadata?: {
      board?: string;
      port?: string;
      version?: string;
      timestamp?: string;
    };
  } {
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // Check for parse errors
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("Invalid XML format");
    }

    // Check if it's a .bbb file with wrapper
    const bbbProject = xmlDoc.querySelector("bybyte-project");
    if (bbbProject) {
      // Extract version and timestamp
      const version = bbbProject.getAttribute("version") || undefined;
      const timestamp = bbbProject.getAttribute("timestamp") || undefined;

      // Extract metadata
      const metadataNode = xmlDoc.querySelector("metadata");
      let metadata: any = { version, timestamp };

      if (metadataNode) {
        const board =
          metadataNode.querySelector("board")?.textContent || undefined;
        const port =
          metadataNode.querySelector("port")?.textContent || undefined;
        metadata = { ...metadata, board, port };
      }

      // Extract workspace
      const workspaceNode = xmlDoc.querySelector("workspace");
      if (!workspaceNode) {
        throw new Error("No workspace found in .bbb file");
      }

      // Get inner XML of workspace node
      const workspaceXml = Array.from(workspaceNode.childNodes)
        .map((node) => new XMLSerializer().serializeToString(node))
        .join("");

      return { workspaceXml, metadata };
    } else {
      // Plain XML file (legacy or direct Blockly XML)
      return { workspaceXml: xmlContent };
    }
  }

  /**
   * Load workspace from parsed XML string
   */
  loadWorkspaceFromXml(
    workspace: Blockly.WorkspaceSvg,
    xmlString: string
  ): void {
    const xml = Blockly.utils.xml.textToDom(xmlString);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
  }

  // Private methods

  private isVersionCompatible(savedVersion: string): boolean {
    const [savedMajor] = savedVersion.split(".").map(Number);
    const [currentMajor] = STORAGE_VERSION.split(".").map(Number);
    return savedMajor === currentMajor;
  }

  private async setStorageVersion(
    version: string = STORAGE_VERSION
  ): Promise<void> {
    await this.ensureAdapter();
    await this.adapter.setItem(STORAGE_KEYS.VERSION, version);
  }

  private async loadStorageData(): Promise<IStorageData | null> {
    try {
      await this.ensureAdapter();
      const workspace = await this.adapter.getItem(STORAGE_KEYS.WORKSPACE);
      const settingsJson = await this.adapter.getItem(STORAGE_KEYS.SETTINGS);
      const timestamp = await this.adapter.getItem(STORAGE_KEYS.LAST_SAVED);
      const version = await this.adapter.getItem(STORAGE_KEYS.VERSION);

      if (!workspace && !settingsJson) {
        return null;
      }

      return {
        version: version || "0.0.0",
        workspace: workspace || undefined,
        settings: settingsJson ? JSON.parse(settingsJson) : undefined,
        timestamp: timestamp ? parseInt(timestamp, 10) : Date.now(),
      };
    } catch (error) {
      console.error("Error loading storage data:", error);
      return null;
    }
  }
}
