/**
 * Base Storage Adapter
 * Abstract base class with common functionality for all adapters
 */

import { IStorageAdapter, StorageType, PlatformType } from '../storage-adapter.interface';

export abstract class BaseStorageAdapter implements IStorageAdapter {
  protected readonly STORAGE_PREFIX = 'blockly_';

  abstract getType(): StorageType;
  abstract getPlatform(): PlatformType;
  abstract isAvailable(): boolean;
  abstract getItem(key: string): Promise<string | null>;
  abstract setItem(key: string, value: string): Promise<void>;
  abstract removeItem(key: string): Promise<void>;
  abstract keys(): Promise<string[]>;

  /**
   * Clear only blockly-related keys
   */
  async clear(): Promise<void> {
    const allKeys = await this.keys();
    const blocklyKeys = allKeys.filter(key => key.startsWith(this.STORAGE_PREFIX));

    for (const key of blocklyKeys) {
      await this.removeItem(key);
    }
  }

  /**
   * Get storage size (default implementation)
   */
  async getSize(): Promise<number | null> {
    try {
      const allKeys = await this.keys();
      const blocklyKeys = allKeys.filter(key => key.startsWith(this.STORAGE_PREFIX));
      
      let totalSize = 0;
      for (const key of blocklyKeys) {
        const value = await this.getItem(key);
        if (value) {
          // Calculate size in bytes (approximation)
          totalSize += new Blob([value]).size + new Blob([key]).size;
        }
      }
      
      return totalSize;
    } catch {
      return null;
    }
  }

  /**
   * Get storage capacity (default: unknown)
   */
  async getCapacity(): Promise<number | null> {
    return null;
  }

  /**
   * Sanitize key to ensure it starts with prefix
   */
  protected ensurePrefix(key: string): string {
    return key.startsWith(this.STORAGE_PREFIX) ? key : `${this.STORAGE_PREFIX}${key}`;
  }

  /**
   * Remove prefix from key
   */
  protected removePrefix(key: string): string {
    return key.startsWith(this.STORAGE_PREFIX) 
      ? key.substring(this.STORAGE_PREFIX.length) 
      : key;
  }

  /**
   * Handle errors consistently
   */
  protected handleError(operation: string, error: any): void {
    console.error(`[${this.getType()}] ${operation} error:`, error);
  }
}

