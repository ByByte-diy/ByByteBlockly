import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlocklyEditorComponent } from "./components/blockly-editor/blockly-editor.component";
import { BlocklyService } from "./services/blockly.service";
import { BlocksLoaderService } from "./services/blocks-loader.service";
import { DeviceModule } from "../device/device.module";
import { StorageModule } from "../storage/storage.module";

/**
 * Blockly Module
 * Contains components and services for working with Blockly editor
 */
@NgModule({
  declarations: [BlocklyEditorComponent],
  imports: [CommonModule, DeviceModule, StorageModule],
  exports: [BlocklyEditorComponent],
  providers: [BlocklyService, BlocksLoaderService],
})
export class BlocklyModule {}
