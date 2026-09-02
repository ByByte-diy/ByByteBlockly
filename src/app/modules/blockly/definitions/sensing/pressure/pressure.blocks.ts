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
  PRESSURE_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, sensingLabel } from "../sensing.helper";

function ensureBme280Instance(generator: any): void {
  registerInclude(generator, "BME280.h", "BME280 — temperature, humidity, pressure (I2C).");
  registerGlobalVariable(generator, "bme280", "BME280 bme;", "BME280 sensor instance.");
}

function buildBme280Init() {
  const block = new BlockBuilder("BME280")
    .setCategory(PRESSURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "pressure", "bme280", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_BME280_INIT_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => {
      ensureBme280Instance(generator);
      return "bme.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("pressure.png"))
      .appendField(
        initBlockLabel("BME280_INIT_LABEL", "BME280 atmospheric pressure I²C init")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "bme280_tooltip",
        "Initialize BME280 sensor. I2C: SDA A4, SCL A5 on Uno."
      )
    );
  };
  return block;
}

function buildBme280Pressure() {
  const block = new BlockBuilder("BME280_pressure")
    .setCategory(PRESSURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "pressure", "bme280"])
    .setOutput("Number")
    .setTooltip("%{BKY_BME280_PRESSURE_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => [
      "bme.readFloatPressure()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("pressure.png", "pressure"))
      .appendField(sensingLabel("bme280_pressure", "atmospheric pressure (hPa)"));
    this.setOutput(true, "Number");
    this.setTooltip(
      sensingLabel(
        "bme280_pressure_tooltip",
        "Returns atmospheric pressure in hPa from initialized BME280."
      )
    );
  };
  return block;
}

export const PRESSURE_BLOCKS = [buildBme280Init(), buildBme280Pressure()];
