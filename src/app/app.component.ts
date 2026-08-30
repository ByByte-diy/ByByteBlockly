import { Component, OnInit } from '@angular/core';
import { I18nService } from './modules/language';
import { ThemeService } from './core/services/theme.service';

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
  ) {}

  async ngOnInit(): Promise<void> {
    this.theme.initialize();
    await this.i18n.initialize();
  }
}

