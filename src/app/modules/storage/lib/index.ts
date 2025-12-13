/**
 * Storage Module
 * Universal cross-platform storage system
 */

// Main service
export * from '../workspace-storage.service';

// Interfaces
export * from './storage-adapter.interface';

// Factory
export * from './storage-adapter.factory';

// Base adapter
export * from './adapters/base-adapter';

// Platform-specific adapters
export * from './adapters/web-localstorage.adapter';
export * from './adapters/electron-filesystem.adapter';

