/**
 * Web LocalStorage Adapter
 * For web browsers using localStorage API
 * 
 * Platform: Web (All browsers)
 * Capacity: ~5-10 MB (browser dependent)
 * Speed: Fast
 * Persistence: Until cleared by user
 */

import { BaseStorageAdapter } from './base-adapter';
import { StorageType, PlatformType } from '../storage-adapter.interface';

export class WebLocalStorageAdapter extends BaseStorageAdapter {
  getType(): StorageType {
    return StorageType.LOCAL_STORAGE;
  }

  getPlatform(): PlatformType {
    return PlatformType.WEB;
  }

  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const fullKey = this.ensurePrefix(key);
      return localStorage.getItem(fullKey);
    } catch (error) {
      this.handleError('getItem', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const fullKey = this.ensurePrefix(key);
      localStorage.setItem(fullKey, value);
    } catch (error) {
      this.handleError('setItem', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const fullKey = this.ensurePrefix(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      this.handleError('removeItem', error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      return Object.keys(localStorage).filter(key => 
        key.startsWith(this.STORAGE_PREFIX)
      );
    } catch (error) {
      this.handleError('keys', error);
      return [];
    }
  }

  override async getCapacity(): Promise<number | null> {
    // Typical localStorage capacity
    return 5 * 1024 * 1024; // 5 MB (conservative estimate)
  }
}

