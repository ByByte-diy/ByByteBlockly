import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';
import { HeaderIconButtonComponent } from './header-icon-button.component';

@NgModule({
  declarations: [HeaderIconButtonComponent, SimpleDialogComponent],
  imports: [CommonModule, TranslateModule],
  exports: [HeaderIconButtonComponent, SimpleDialogComponent],
})
export class HeaderUiModule {}
