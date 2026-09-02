import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerPinDefines,
  formatPinModesFromMacros,
} from "../../../lib/generators/pin-definitions.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DC_CATEGORY,
  DRV8833_DEFAULT_PINS,
  ADVANCED_MOTOR_LEVEL,
} from "../config";
import {
  applyDefaultPinFields,
  createBlockIconField,
  createPwmPinDropdownField,
  initBlockLabel,
  motorLabel,
} from "../motors.helper";

function buildDrv8833Init() {
  const block = new BlockBuilder("drv8833_init")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "init", "drv8833"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_DRV8833_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const ain1 = b.getFieldValue("AIN1");
      const ain2 = b.getFieldValue("AIN2");
      const bin1 = b.getFieldValue("BIN1");
      const bin2 = b.getFieldValue("BIN2");

      registerPinDefines(
        generator,
        "drv8833_pins",
        {
          drv8833_ain1: ain1,
          drv8833_ain2: ain2,
          drv8833_bin1: bin1,
          drv8833_bin2: bin2,
        },
        "DRV8833 driver PWM pins (AIN1, AIN2, BIN1, BIN2)."
      );

      return formatPinModesFromMacros(
        ["drv8833_ain1", "drv8833_ain2", "drv8833_bin1", "drv8833_bin2"],
        "OUTPUT"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorDC.png"))
      .appendField(initBlockLabel("DRV8833_INIT_LABEL", "DRV8833 init"));
    this.appendDummyInput()
      .appendField("AIN1")
      .appendField(createPwmPinDropdownField(), "AIN1");
    this.appendDummyInput()
      .appendField("AIN2")
      .appendField(createPwmPinDropdownField(), "AIN2");
    this.appendDummyInput()
      .appendField("BIN1")
      .appendField(createPwmPinDropdownField(), "BIN1");
    this.appendDummyInput()
      .appendField("BIN2")
      .appendField(createPwmPinDropdownField(), "BIN2");
    applyDefaultPinFields(this, DRV8833_DEFAULT_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "DRV8833_INIT_TOOLTIP",
        "Configure DRV8833 dual motor driver (4 PWM inputs)"
      )
    );
  };
  return block;
}

export const DRV8833_BLOCKS = [buildDrv8833Init()];
