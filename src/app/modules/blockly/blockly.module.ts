import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BlocklyEditorComponent } from "./components/blockly-editor/blockly-editor.component";
import { LevelSwitcherComponent } from "./components/level-switcher/level-switcher.component";
import { VariablePromptComponent } from "./components/variable-prompt/variable-prompt.component";
import { BlocklyService } from "./services/blockly.service";
import { BlocksLoaderService } from "./services/blocks-loader.service";
import { DeviceModule } from "../device/device.module";
import { StorageModule } from "../storage/storage.module";

/**
 * Blockly Module
 * Contains components and services for working with Blockly editor
 */
@NgModule({
  declarations: [BlocklyEditorComponent, VariablePromptComponent, LevelSwitcherComponent],
  imports: [CommonModule, FormsModule, DeviceModule, StorageModule],
  exports: [BlocklyEditorComponent, LevelSwitcherComponent],
  providers: [BlocklyService, BlocksLoaderService],
})
export class BlocklyModule {}
