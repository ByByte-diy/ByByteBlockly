import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  GESTURE_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, sensingLabel } from "../sensing.helper";

function ensureApds9960Instance(generator: any): void {
  registerInclude(
    generator,
    "Adafruit_APDS9960.h",
    "Adafruit APDS9960 — gesture and color sensor (I2C)."
  );
  registerGlobalVariable(
    generator,
    "apds9960",
    "Adafruit_APDS9960 apds;",
    "APDS9960 sensor instance (I2C)."
  );
}

function enableOptions(): [string, string][] {
  return [
    [sensingLabel("ENABLE", "Enable"), "1"],
    [sensingLabel("DISABLE", "Disable"), "0"],
  ];
}

function gestureGainOptions(): [string, string][] {
  return [
    [sensingLabel("APDS9960_GAIN_X1", "Gain x1"), "0"],
    [sensingLabel("APDS9960_GAIN_X2", "Gain x2"), "1"],
    [sensingLabel("APDS9960_GAIN_X4", "Gain x4"), "2"],
    [sensingLabel("APDS9960_GAIN_X8", "Gain x8"), "3"],
  ];
}

function gestureDirectionOptions(): [string, string][] {
  return [
    [sensingLabel("APDS9960_DIR_UP", "Dir Up"), "APDS9960_UP"],
    [sensingLabel("APDS9960_DIR_DOWN", "Dir Down"), "APDS9960_DOWN"],
    [sensingLabel("APDS9960_DIR_LEFT", "Dir Left"), "APDS9960_LEFT"],
    [sensingLabel("APDS9960_DIR_RIGHT", "Dir Right"), "APDS9960_RIGHT"],
  ];
}

function buildApds9960Init() {
  const block = new BlockBuilder("APDS9960_init")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_APDS9960_INIT_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => {
      ensureApds9960Instance(generator);
      return "apds.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("APDS9960.png"))
      .appendField(
        initBlockLabel("APDS9960_INIT_LABEL", "APDS9960 gesture & color I²C init")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "APDS9960_init_tooltip",
        "Initialize APDS9960 gesture and color sensor (I2C)."
      )
    );
  };
  return block;
}

function buildApds9960GestureInit() {
  const block = new BlockBuilder("APDS9960_gesture_init")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, _generator) => {
      const enable = b.getFieldValue("ENABLE");
      if (enable === "1") {
        return "apds.enableProximity(true);\napds.enableGesture(true);\n";
      }
      return "apds.enableProximity(false);\napds.enableGesture(false);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("APDS9960_name_gesture", "gesture"))
      .appendField(sensingLabel("APDS9960_detection", "detection"))
      .appendField(new Blockly.FieldDropdown(enableOptions), "ENABLE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildApds9960GestureGain() {
  const block = new BlockBuilder("APDS9960_gesture_gain")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, _generator) => {
      const gain = b.getFieldValue("GAIN");
      return `apds.setGestureGain(${gain});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("APDS9960_name_gesture", "gesture"))
      .appendField(sensingLabel("APDS9960_gesture_gain", "config gesture gain"))
      .appendField(new Blockly.FieldDropdown(gestureGainOptions), "GAIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildApds9960GestureDetected() {
  const block = new BlockBuilder("APDS9960_gesture_detected")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "apds.gestureValid()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("APDS9960_name_gesture", "gesture"))
      .appendField(sensingLabel("APDS9960_gesture_detected", "detected"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildApds9960ReadGesture() {
  const block = new BlockBuilder("APDS9960_readgesture")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "apds.readGesture()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("APDS9960_name_gesture", "gesture"))
      .appendField(sensingLabel("APDS9960_readgesture", "read"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildApds9960GestureDirection() {
  const block = new BlockBuilder("APDS9960_gesture")
    .setCategory(GESTURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gesture", "apds9960"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const direction = b.getFieldValue("DIRECTION");
      return [direction, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("APDS9960_name_gesture", "gesture"))
      .appendField(
        new Blockly.FieldDropdown(gestureDirectionOptions),
        "DIRECTION"
      );
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const GESTURE_BLOCKS = [
  buildApds9960Init(),
  buildApds9960GestureInit(),
  buildApds9960GestureGain(),
  buildApds9960GestureDetected(),
  buildApds9960ReadGesture(),
  buildApds9960GestureDirection(),
];
