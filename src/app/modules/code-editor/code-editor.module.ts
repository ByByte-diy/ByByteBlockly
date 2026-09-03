import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderUiModule } from '../../shared/components/header/header-ui.module';
import { CodeEditorPanelComponent } from './components/code-editor-panel/code-editor-panel.component';
import { CodeEditorToggleComponent } from './components/code-editor-toggle/code-editor-toggle.component';
import { CodeEditorService } from './services/code-editor.service';
import { ICodeSource } from './interfaces/code-source.interface';

@NgModule({
  declarations: [CodeEditorPanelComponent, CodeEditorToggleComponent],
  imports: [CommonModule, TranslateModule, HeaderUiModule],
  exports: [CodeEditorPanelComponent, CodeEditorToggleComponent],
  providers: [{ provide: ICodeSource, useExisting: CodeEditorService }],
})
export class CodeEditorModule {}
