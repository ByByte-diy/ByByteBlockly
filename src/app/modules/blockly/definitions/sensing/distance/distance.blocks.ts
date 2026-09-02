import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DISTANCE_CATEGORY,
  SENSOR_INSTANCE_OPTIONS,
  DISTANCE_LEVEL,
  ULTRASONIC_DEFAULT_PINS,
} from "../config";
import {
  applyDefaultAllPinFields,
  createAllPinDropdownField,
  createBlockIconField,
  sensingLabel,
} from "../sensing.helper";

import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { formatPinMode } from "../../../lib/generators/pin-definitions.helper";

function ensureUltrasonicFunction(
  generator: any,
  pinTrig: string,
  pinEcho: string
): string {
  const useShortPulse = pinTrig === "4" && pinEcho === "5";
  const delayHigh = useShortPulse ? "100" : "10";
  const delayLow = useShortPulse ? "100" : "2";
  const divisor = useShortPulse ? "55" : "58";

  const functionBody =
    "long ultrasound_distance_simple() {\n" +
    "   long duration, distance;\n" +
    `   digitalWrite(${pinTrig},LOW);\n` +
    `   delayMicroseconds(${delayLow});\n` +
    `   digitalWrite(${pinTrig}, HIGH);\n` +
    `   delayMicroseconds(${delayHigh});\n` +
    `   digitalWrite(${pinTrig}, LOW);\n` +
    `   duration = pulseIn(${pinEcho}, HIGH);\n` +
    `   distance = duration/${divisor};\n` +
    "   return distance;\n" +
    "}";

  registerDefinition(
    generator,
    `var_ultrasonic${pinTrig}`,
    functionBody,
    "Function ultrasound_distance_simple(): distance in centimeters (HC-SR04)."
  );

  return formatPinMode(pinTrig, "OUTPUT") + formatPinMode(pinEcho, "INPUT");
}

function buildUltrasonicInit() {
  const block = new BlockBuilder("ultrasonic_sensor")
    .setCategory(DISTANCE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DISTANCE_LEVEL)
    .setTags(["sensing", "distance", "ultrasonic", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ULTRASONIC_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pinTrig = b.getFieldValue("PIN_TRIG");
      const pinEcho = b.getFieldValue("PIN_ECHO");
      return ensureUltrasonicFunction(generator, pinTrig, pinEcho);
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_ultrasound.png"))
      .appendField(initBlockLabel("ULTRASONIC_INIT_LABEL", "HC-SR04 init"))
      .appendField("#")
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "US_NUMBER"
      )
      .appendField(sensingLabel("ultrasonic_ranger", "ultrasonic"))
      .appendField(sensingLabel("TRIG", "trigger"))
      .appendField(createAllPinDropdownField(), "PIN_TRIG");
    this.appendDummyInput()
      .appendField(sensingLabel("Echo", "echo"))
      .appendField(createAllPinDropdownField(), "PIN_ECHO");
    applyDefaultAllPinFields(this, ULTRASONIC_DEFAULT_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "ultrason_tooltip",
        "HC-SR04 ultrasonic distance sensor (3–400 cm). Set TRIG and ECHO pins."
      )
    );
  };
  return block;
}

function buildUltrasonicDistance() {
  const block = new BlockBuilder("ultrasonic_distance")
    .setCategory(DISTANCE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DISTANCE_LEVEL)
    .setTags(["sensing", "distance", "ultrasonic"])
    .setOutput("Number")
    .setTooltip("%{BKY_ULTRASONIC_DISTANCE_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => [
      "ultrasound_distance_simple()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_ultrasound.png", "wide"))
      .appendField("#")
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "US_NUMBER"
      )
      .appendField(sensingLabel("ultrason_distance1", "distance"));
    this.setOutput(true, "Number");
    this.setTooltip(
      sensingLabel(
        "ultrason_distance2",
        "Returns distance in cm from HC-SR04 (requires init block)."
      )
    );
  };
  return block;
}

function buildVl53l0xInit() {
  const block = new BlockBuilder("VL53L0X")
    .setCategory(DISTANCE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DISTANCE_LEVEL)
    .setTags(["sensing", "distance", "vl53l0x", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_VL53L0X_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => {
      registerInclude(generator, "Wire.h");
      registerInclude(generator, "VL53L0X.h");
      registerGlobalVariable(
        generator,
        "VL53L0X",
        "VL53L0X cpt;",
        "VL53L0X ToF distance sensor object (I2C)."
      );
      return (
        "Wire.begin();\n" +
        "cpt.init();\n" +
        "cpt.setTimeout(500);\n" +
        "cpt.startContinuous();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("laser.png"))
      .appendField(
        initBlockLabel("VL53L0X_INIT_LABEL", "VL53L0X laser I²C init")
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "VL53L0X_tooltip",
        "Initialize VL53L0X ToF sensor (I²C: SDA A4, SCL A5 on Uno)."
      )
    );
  };
  return block;
}

function buildVl53l0xDistance() {
  const block = new BlockBuilder("VL53L0X_distance")
    .setCategory(DISTANCE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DISTANCE_LEVEL)
    .setTags(["sensing", "distance", "vl53l0x"])
    .setOutput("Number")
    .setTooltip("%{BKY_VL53L0X_DISTANCE_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => [
      "cpt.readRangeContinuousMillimeters()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("laser.png", "value"))
      .appendField(sensingLabel("VL53L0X_distance", "distance (mm)"));
    this.setOutput(true, "Number");
    this.setTooltip(
      sensingLabel(
        "VL53L0X_distance_tooltip",
        "Returns distance measured by VL53L0X in millimeters."
      )
    );
  };
  return block;
}

export const DISTANCE_BLOCKS = [
  buildUltrasonicInit(),
  buildUltrasonicDistance(),
  buildVl53l0xInit(),
  buildVl53l0xDistance(),
];
