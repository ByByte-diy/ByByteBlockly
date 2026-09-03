import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderUiModule } from '../../shared/components/header/header-ui.module';
import { LangSwitcherComponent } from './components/lang-switcher/lang-switcher.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { BlocklyI18nService } from './blockly-i18n.service';
import { I18nService } from './i18n.service';

@NgModule({
  declarations: [LangSwitcherComponent, ThemeToggleComponent],
  imports: [CommonModule, HttpClientModule, HeaderUiModule, TranslateModule.forRoot({
    fallbackLang: 'en',
    loader: provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),
  })],
  providers: [BlocklyI18nService, I18nService],
  exports: [TranslateModule, LangSwitcherComponent, ThemeToggleComponent],
})
export class I18nModule {}
