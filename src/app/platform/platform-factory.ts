import { Type } from '@angular/core';
import { detectPlatform, Platform } from './platform';
import { ElectronPlatformModule } from './electron/electron-platform.module';
import { WebPlatformModule } from './web/web-platform.module';

/**
 * Factory for choosing the correct platform module
 * based on the execution environment
 */
export function getPlatformModule(): Type<any> {
  const platform = detectPlatform();
  
  switch (platform) {
    case Platform.ELECTRON:
      console.log('🖥️ Running in Electron mode');
      return ElectronPlatformModule;
    
    case Platform.WEB:
      console.log('🌐 Running in Web mode');
      return WebPlatformModule;
    
    default:
      console.warn('⚠️ Unknown platform, defaulting to Web');
      return WebPlatformModule;
  }
}

