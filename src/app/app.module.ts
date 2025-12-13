import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { WebPlatformModule } from './platform/web/web-platform.module';

/**
 * App Module
 * 
 * For web build uses WebPlatformModule
 * For Electron build uses ElectronPlatformModule
 * (connected through a separate main-electron.ts)
 */
@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    WebPlatformModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

