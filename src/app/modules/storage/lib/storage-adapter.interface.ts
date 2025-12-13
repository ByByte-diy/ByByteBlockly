/**
 * Storage Adapter Interface
 * Universal abstraction for different storage backends across all platforms
 * 
 * Supported platforms:
 * - Web (localStorage, IndexedDB)
 * - Electron (FileSystem via Node.js)
 * - Mobile (Native Storage via Capacitor/Cordova)
 * - Future: Android, iOS native storage
 */

export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  FILE_SYSTEM = 'fileSystem',
  INDEXED_DB = 'indexedDB',
  NATIVE_STORAGE = 'nativeStorage',
  MEMORY = 'memory'
}

export enum PlatformType {
  WEB = 'web',
  ELECTRON = 'electron',
  ANDROID = 'android',
  IOS = 'ios',
  UNKNOWN = 'unknown'
}

/**
 * Storage adapter interface
 * All adapters must implement this interface
 */
export interface IStorageAdapter {
  /**
   * Wait for initialization to complete
   */
  ensureInitialized?(): Promise<void>;

  /**
   * Get value by key
   */
  getItem(key: string): Promise<string | null>;

  /**
   * Set value by key
   */
  setItem(key: string, value: string): Promise<void>;

  /**
   * Remove value by key
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all storage (only blockly-related keys)
   */
  clear(): Promise<void>;

  /**
   * Get all keys
   */
  keys(): Promise<string[]>;

  /**
   * Check if storage is available
   */
  isAvailable(): boolean;

  /**
   * Get storage type
   */
  getType(): StorageType;

  /**
   * Get platform type
   */
  getPlatform(): PlatformType;

  /**
   * Get storage size in bytes (if available)
   */
  getSize(): Promise<number | null>;

  /**
   * Get maximum storage capacity in bytes (if known)
   */
  getCapacity(): Promise<number | null>;
}

/**
 * Optional methods for advanced adapters
 */
export interface IAdvancedStorageAdapter extends IStorageAdapter {
  /**
   * Export all data to external file/location
   */
  exportToFile?(path: string): Promise<boolean>;

  /**
   * Import data from external file/location
   */
  importFromFile?(path: string): Promise<boolean>;

  /**
   * Get storage location path (for file-based systems)
   */
  getStorageLocation?(): string | null;

  /**
   * Create backup
   */
  createBackup?(): Promise<string | null>;

  /**
   * Restore from backup
   */
  restoreBackup?(backupPath: string): Promise<boolean>;
}

