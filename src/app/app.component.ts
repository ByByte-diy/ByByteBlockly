import { Component, OnInit } from '@angular/core';
import { I18nService } from './modules/language';
import { ThemeService } from './core/services/theme.service';
import { AssetCacheRegistry } from '@modules/asset-cache';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ByByte Blockly';

  constructor(
    private i18n: I18nService,
    private theme: ThemeService,
    private assetCacheRegistry: AssetCacheRegistry,
  ) {}

  async ngOnInit(): Promise<void> {
    this.theme.initialize();
    void this.assetCacheRegistry.validate().catch(() => undefined);
    await this.i18n.initialize();
  }
}

