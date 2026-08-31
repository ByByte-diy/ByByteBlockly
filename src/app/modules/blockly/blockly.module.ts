import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BlocklyEditorComponent } from "./components/blockly-editor/blockly-editor.component";
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
  declarations: [BlocklyEditorComponent, VariablePromptComponent],
  imports: [CommonModule, FormsModule, DeviceModule, StorageModule],
  exports: [BlocklyEditorComponent],
  providers: [BlocklyService, BlocksLoaderService],
})
export class BlocklyModule {}
