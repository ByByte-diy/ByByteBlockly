/**
 * Storage Adapter Factory
 * Automatically selects the best storage adapter based on platform
 * 
 * Selection priority:
 * 1. Electron → FileSystem (unlimited, fast)
 * 2. Web → LocalStorage (limited but reliable)
 * 3. Fallback → Memory (temporary)
 */

import { IStorageAdapter, PlatformType } from './storage-adapter.interface';
import { WebLocalStorageAdapter } from './adapters/web-localstorage.adapter';
import { ElectronFileSystemAdapter } from './adapters/electron-filesystem.adapter';
import { detectPlatform, Platform } from '@app/platform/platform';

export class StorageAdapterFactory {
  /**
   * Create appropriate storage adapter for current platform
   */
  static async createAdapter(): Promise<IStorageAdapter> {
    const platform = detectPlatform();

    switch (platform) {
      case Platform.ELECTRON:
        return await this.createElectronAdapter();
      
      case Platform.WEB:
        return this.createWebAdapter();
      
      default:
        console.warn('Unknown platform, falling back to Web adapter');
        return this.createWebAdapter();
    }
  }

  /**
   * Create Electron adapter with fallback
   */
  private static async createElectronAdapter(): Promise<IStorageAdapter> {
    const adapter = new ElectronFileSystemAdapter();
    
    // Wait for async initialization
    await adapter.ensureInitialized();
    
    if (adapter.isAvailable()) {
      console.log('🖥️  Using Electron FileSystem adapter');
      return adapter;
    }

    // Fallback to localStorage if FileSystem is not available
    console.warn('FileSystem not available in Electron, falling back to LocalStorage');
    return this.createWebAdapter();
  }

  /**
   * Create Web adapter
   */
  private static createWebAdapter(): IStorageAdapter {
    const adapter = new WebLocalStorageAdapter();
    
    if (adapter.isAvailable()) {
      console.log('🌐 Using Web LocalStorage adapter');
      return adapter;
    }

    throw new Error('No storage adapter available');
  }

  /**
   * Get recommended adapter for specific platform
   */
  static getAdapterForPlatform(platformType: PlatformType): IStorageAdapter {
    switch (platformType) {
      case PlatformType.ELECTRON:
        return new ElectronFileSystemAdapter();
      
      case PlatformType.WEB:
        return new WebLocalStorageAdapter();
      
      default:
        throw new Error(`No adapter available for platform: ${platformType}`);
    }
  }

  /**
   * List all available adapters for current environment
   */
  static getAvailableAdapters(): IStorageAdapter[] {
    const adapters: IStorageAdapter[] = [
      new WebLocalStorageAdapter(),
      new ElectronFileSystemAdapter(),
    ];

    return adapters.filter(adapter => adapter.isAvailable());
  }
}

