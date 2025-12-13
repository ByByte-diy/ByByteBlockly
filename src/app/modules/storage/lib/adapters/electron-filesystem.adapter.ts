/**
 * Electron FileSystem Adapter
 * For Electron apps using Node.js fs module
 * 
 * Platform: Electron (Windows, Linux, macOS)
 * Capacity: Unlimited (disk space)
 * Speed: Very fast
 * Persistence: Permanent (until deleted)
 * Location: User Data Directory
 */

import { BaseStorageAdapter } from './base-adapter';
import { StorageType, PlatformType, IAdvancedStorageAdapter } from '../storage-adapter.interface';

export class ElectronFileSystemAdapter extends BaseStorageAdapter implements IAdvancedStorageAdapter {
  private fs: any;
  private path: any;
  private storageDir: string | null = null;
  private available = false;
  private initPromise: Promise<void>;

  constructor() {
    super();
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Check if running in Electron
      if (typeof window !== 'undefined' && (window as any).require) {
        this.fs = (window as any).require('fs');
        this.path = (window as any).require('path');
        
        const { ipcRenderer } = (window as any).require('electron');
        
        // Use IPC to get userData path from main process
        const userDataPath = await ipcRenderer.invoke('app:getUserDataPath');
        
        if (userDataPath) {
          this.storageDir = this.path.join(userDataPath, 'blockly-storage');
          
          // Create directory if not exists
          if (!this.fs.existsSync(this.storageDir)) {
            this.fs.mkdirSync(this.storageDir, { recursive: true });
          }
          
          this.available = true;
          console.log('📁 Electron FileSystem storage:', this.storageDir);
        }
      }
    } catch (error) {
      console.warn('Electron FileSystem adapter initialization failed:', error);
      this.available = false;
    }
  }

  /**
   * Wait for initialization to complete
   */
  async ensureInitialized(): Promise<void> {
    await this.initPromise;
  }

  getType(): StorageType {
    return StorageType.FILE_SYSTEM;
  }

  getPlatform(): PlatformType {
    return PlatformType.ELECTRON;
  }

  isAvailable(): boolean {
    return this.available;
  }

  private getFilePath(key: string): string {
    const sanitized = key.replace(/[^a-z0-9_-]/gi, '_');
    return this.path.join(this.storageDir, `${sanitized}.json`);
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.available) return null;

    try {
      const fullKey = this.ensurePrefix(key);
      const filePath = this.getFilePath(fullKey);
      
      if (this.fs.existsSync(filePath)) {
        return this.fs.readFileSync(filePath, 'utf8');
      }
      
      return null;
    } catch (error) {
      this.handleError('getItem', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.available) {
      throw new Error('FileSystem adapter not available');
    }

    try {
      const fullKey = this.ensurePrefix(key);
      const filePath = this.getFilePath(fullKey);
      this.fs.writeFileSync(filePath, value, 'utf8');
    } catch (error) {
      this.handleError('setItem', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.available) return;

    try {
      const fullKey = this.ensurePrefix(key);
      const filePath = this.getFilePath(fullKey);
      
      if (this.fs.existsSync(filePath)) {
        this.fs.unlinkSync(filePath);
      }
    } catch (error) {
      this.handleError('removeItem', error);
    }
  }

  async keys(): Promise<string[]> {
    if (!this.available) return [];

    try {
      const files = this.fs.readdirSync(this.storageDir);
      return files
        .filter((file: string) => file.endsWith('.json'))
        .map((file: string) => file.replace('.json', ''))
        .filter((key: string) => key.startsWith(this.STORAGE_PREFIX));
    } catch (error) {
      this.handleError('keys', error);
      return [];
    }
  }

  override async getCapacity(): Promise<number | null> {
    // Unlimited for filesystem
    return null;
  }

  override async getSize(): Promise<number | null> {
    if (!this.available) return null;

    try {
      let totalSize = 0;
      const files = this.fs.readdirSync(this.storageDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = this.path.join(this.storageDir, file);
          const stats = this.fs.statSync(filePath);
          totalSize += stats.size;
        }
      }

      return totalSize;
    } catch (error) {
      this.handleError('getSize', error);
      return null;
    }
  }

  getStorageLocation(): string | null {
    return this.storageDir;
  }

  async exportToFile(filePath: string): Promise<boolean> {
    if (!this.available) return false;

    try {
      const allKeys = await this.keys();
      const data: Record<string, string> = {};

      for (const key of allKeys) {
        const value = await this.getItem(key);
        if (value !== null) {
          data[key] = value;
        }
      }

      this.fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      this.handleError('exportToFile', error);
      return false;
    }
  }

  async importFromFile(filePath: string): Promise<boolean> {
    if (!this.available) return false;

    try {
      const content = this.fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          await this.setItem(key, value);
        }
      }

      return true;
    } catch (error) {
      this.handleError('importFromFile', error);
      return false;
    }
  }

  async createBackup(): Promise<string | null> {
    if (!this.available || !this.storageDir) return null;

    try {
      const backupDir = this.path.join(this.storageDir, 'backups');
      
      if (!this.fs.existsSync(backupDir)) {
        this.fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = this.path.join(backupDir, `backup-${timestamp}.json`);

      const success = await this.exportToFile(backupPath);
      return success ? backupPath : null;
    } catch (error) {
      this.handleError('createBackup', error);
      return null;
    }
  }

  async restoreBackup(backupPath: string): Promise<boolean> {
    return await this.importFromFile(backupPath);
  }
}

