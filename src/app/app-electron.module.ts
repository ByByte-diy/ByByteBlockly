import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { ElectronPlatformModule } from './platform/electron/electron-platform.module';
import { I18nModule } from './modules/language';
import { AssetCacheModule } from './modules/asset-cache';

/**
 * App Module for Electron platform
 * Uses ElectronPlatformModule for platform services
 */
@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    AssetCacheModule,
    I18nModule,
    ElectronPlatformModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppElectronModule { }

