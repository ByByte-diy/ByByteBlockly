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
  COMPASS_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, sensingLabel } from "../sensing.helper";

function buildHmc5883Init() {
  const block = new BlockBuilder("Init_Compass_HMC5883")
    .setCategory(COMPASS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "compass", "hmc5883", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      registerInclude(generator, "Wire.h");
      registerInclude(generator, "Adafruit_Sensor.h");
      registerInclude(
        generator,
        "Adafruit_HMC5883_U.h",
        "HMC5883 magnetometer (I2C)."
      );
      registerGlobalVariable(
        generator,
        "hmc5883_mag",
        "Adafruit_HMC5883_Unified mag = Adafruit_HMC5883_Unified(12345);",
        "HMC5883 compass sensor instance."
      );
      registerGlobalVariable(
        generator,
        "hmc5883_event",
        "sensors_event_t eventmag;",
        "Latest HMC5883 sensor reading."
      );
      return "mag.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("hmc5883.png"))
      .appendField(
        initBlockLabel("HMC5883_INIT_LABEL", "HMC5883 compass I²C init")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildHmc5883Read() {
  const block = new BlockBuilder("order_to_read_HMC5883_values")
    .setCategory(COMPASS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "compass", "hmc5883"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) => "mag.getEvent(&eventmag);\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      sensingLabel("HMC5883_read", "compass read values")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function hmc5883ValueOptions(): [string, string][] {
  return [
    [sensingLabel("HMC5883_X", "magnetic vector X"), "0"],
    [sensingLabel("HMC5883_Y", "magnetic vector Y"), "1"],
    [sensingLabel("HMC5883_Z", "magnetic vector Z"), "2"],
    [sensingLabel("HMC5883_HEADING", "Heading º"), "3"],
  ];
}

function buildHmc5883Values() {
  const block = new BlockBuilder("HMC5883_values")
    .setCategory(COMPASS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "compass", "hmc5883"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const typeMag = b.getFieldValue("TypeMag");
      let code = "eventmag.magnetic.x";
      if (typeMag === "1") {
        code = "eventmag.magnetic.y";
      } else if (typeMag === "2") {
        code = "eventmag.magnetic.z";
      } else if (typeMag === "3") {
        code = "(atan2(eventmag.magnetic.y, eventmag.magnetic.x)*(180/M_PI))";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(hmc5883ValueOptions), "TypeMag")
      .appendField(sensingLabel("HMC5883_values", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const COMPASS_BLOCKS = [
  buildHmc5883Init(),
  buildHmc5883Read(),
  buildHmc5883Values(),
];
