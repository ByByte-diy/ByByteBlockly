import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LangSwitcherComponent } from './components/lang-switcher/lang-switcher.component';
import { BlocklyI18nService } from './blockly-i18n.service';
import { I18nService } from './i18n.service';

@NgModule({
  declarations: [
    LangSwitcherComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })
  ],
  providers: [
    BlocklyI18nService,
    I18nService
  ],
  exports: [
    TranslateModule,
    LangSwitcherComponent
  ]
})
export class I18nModule { }

