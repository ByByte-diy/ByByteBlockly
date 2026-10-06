import { Component, OnInit } from '@angular/core';
import { I18nService } from './modules/language';
import { ThemeService } from './core/services/theme.service';
import { AssetCacheRefreshService } from '@modules/asset-cache';
import { AssetCacheUiService } from '@app/modules/upload/services/asset-cache-ui.service';

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
    private assetCacheRefresh: AssetCacheRefreshService,
    private assetCacheUi: AssetCacheUiService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.theme.initialize();
    this.assetCacheRefresh.start();
    this.assetCacheUi.start();
    await this.i18n.initialize();
  }
}

