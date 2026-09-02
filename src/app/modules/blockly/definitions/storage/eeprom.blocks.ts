import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerInclude } from "../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../types/block.types";
import {
  CATEGORY_COLOUR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

function ensureEepromInclude(generator: any): void {
  registerInclude(generator, "EEPROM.h", "EEPROM.h library — persistent storage.");
}

function applyStorageColour(block: BlockDefinition): BlockDefinition {
  const originalInit = block.init;
  block.init = function (this: Blockly.Block) {
    originalInit.call(this);
    this.setColour(CATEGORY_COLOUR);
  };
  return block;
}

export const eepromReadBlock = applyStorageColour(
  new BlockBuilder("eeprom_read")
    .setCategory(CATEGORY_NAME)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["storage", "eeprom"])
    .setOutput("Number")
    .addValueInput("adr", "%{BKY_EEPROM_READ_ADDRESS}", "Number")
    .setShadowBlock("math_number", { NUM: 0 })
    .setTooltip("%{BKY_EEPROM_READ_TOOLTIP}")
    .setArduinoGenerator((block, generator) => {
      const address =
        generator.valueToCode(block, "adr", generator.ORDER_ATOMIC) || "0";
      ensureEepromInclude(generator);
      return [`EEPROM.read(${address})`, generator.ORDER_ATOMIC];
    })
    .build()
);

export const eepromWriteBlock = applyStorageColour(
  new BlockBuilder("eeprom_write")
    .setCategory(CATEGORY_NAME)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["storage", "eeprom"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .addValueInput("val", "%{BKY_EEPROM_WRITE_VALUE}")
    .setShadowBlock("math_number", { NUM: 0 })
    .addValueInput("adr", "%{BKY_EEPROM_WRITE_ADDRESS}", "Number")
    .setShadowBlock("math_number", { NUM: 0 })
    .setTooltip("%{BKY_EEPROM_WRITE_TOOLTIP}")
    .setArduinoGenerator((block, generator) => {
      const address =
        generator.valueToCode(block, "adr", generator.ORDER_ATOMIC) || "0";
      const value =
        generator.valueToCode(block, "val", generator.ORDER_ATOMIC) || "0";
      ensureEepromInclude(generator);
      return `EEPROM.write(${address}, ${value});\n`;
    })
    .build()
);
