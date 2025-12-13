/**
 * Detection of the current platform
 */
export enum Platform {
  WEB = 'web',
  ELECTRON = 'electron'
}

/**
 * Detects on which platform the application is running
 */
export function detectPlatform(): Platform {
  // Check if Electron is present
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      (window as any).require('electron');
      return Platform.ELECTRON;
    } catch {
      return Platform.WEB;
    }
  }
  return Platform.WEB;
}

/**
 * Checks if the application is running in Electron
 */
export function isElectron(): boolean {
  return detectPlatform() === Platform.ELECTRON;
}

/**
 * Checks if the application is running in the browser
 */
export function isWeb(): boolean {
  return detectPlatform() === Platform.WEB;
}

