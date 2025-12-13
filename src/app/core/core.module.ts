import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Core module contains interfaces and basic functionality
 * It should be imported only once in AppModule
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule already loaded. Import it only in AppModule.'
      );
    }
  }
}

