import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  GYRO_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, isInSetupSection, sensingLabel } from "../sensing.helper";

function gyroAxisOptions(): [string, string][] {
  return [
    ["ax", "ax"],
    ["ay", "ay"],
    ["az", "az"],
    ["gx", "gx"],
    ["gy", "gy"],
    ["gz", "gz"],
  ];
}

function buildGyroInit() {
  const block = new BlockBuilder("gyro_init")
    .setCategory(GYRO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gyro", "mpu6050", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_GYRO_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      registerInclude(generator, "Wire.h");
      registerInclude(generator, "I2Cdev.h");
      registerInclude(generator, "MPU6050.h", "MPU6050 gyro/accelerometer (I2C).");
      registerGlobalVariable(
        generator,
        "gyro_vars",
        "int16_t ax, ay, az;\nint16_t gx, gy, gz;",
        "MPU6050 motion sample variables."
      );
      registerDefinition(
        generator,
        "gyro",
        "MPU6050 accelgyro;",
        "MPU6050 accelerometer/gyro instance."
      );
      if (isInSetupSection(b)) {
        return "Wire.begin();\naccelgyro.initialize();\n";
      }
      return "accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_gyro.png"))
      .appendField(
        initBlockLabel("OTTO9_GETG_TEXT", "read accelerations & angular velocity")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "GYRO_INIT_TOOLTIP",
        "Setup: I²C init. Loop: refresh ax–gz values for gyro_getg blocks."
      )
    );
  };
  return block;
}

function buildGyroGetValue() {
  const block = new BlockBuilder("gyro_getg")
    .setCategory(GYRO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gyro", "mpu6050"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_GYRO_GET_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const axis = b.getFieldValue("getg");
      return [axis, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_gyro.png", "value"))
      .appendField(sensingLabel("OTTO9_GETG_TEXT2", "value"))
      .appendField(new Blockly.FieldDropdown(gyroAxisOptions), "getg");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel(
        "GYRO_GET_TOOLTIP",
        "Returns ax/ay/az or gx/gy/gz after gyro_init refresh in loop."
      )
    );
  };
  return block;
}

export const GYRO_BLOCKS = [buildGyroInit(), buildGyroGetValue()];
