import { Component, OnInit } from '@angular/core';
import { I18nService } from './modules/language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ByByte Blockly';

  constructor(private i18n: I18nService) {}

  async ngOnInit(): Promise<void> {
    await this.i18n.initialize();
  }
}

