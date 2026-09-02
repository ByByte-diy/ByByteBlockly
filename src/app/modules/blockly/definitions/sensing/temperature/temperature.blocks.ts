import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_DHT_PIN,
  SENSOR_INSTANCE_OPTIONS,
  TEMPERATURE_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadExpression,
  applyDefaultAllPinFields,
  applyDefaultAnalogPinFields,
  createAllPinDropdownField,
  createAnalogPinDropdownField,
  createBlockIconField,
  createDigitalPinDropdownField,
  ensureMrtnodeAnalogResolution,
  registerDigitalInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

function dhtTypeOptions(): [string, string][] {
  return [
    [sensingLabel("DHT_Type11", "DHT11"), "0"],
    [sensingLabel("DHT_Type21", "DHT21"), "1"],
    [sensingLabel("DHT_Type22", "DHT22"), "2"],
  ];
}

function dhtMeasureOptions(): [string, string][] {
  return [
    [sensingLabel("DHT_Temp", "🌡️ temperature ºC"), "0"],
    [sensingLabel("DHT_Humi", "💧 humidity %"), "1"],
    [sensingLabel("DHT_Head", "☀️ heat Index ºC"), "2"],
  ];
}

const DEFAULT_ANALOG_TEMP_PIN = "A0";
const DEFAULT_LM35_PIN = "A0";

const THERMISTOR_FUNCTION =
  "double Thermister(int RawADC) \n" +
  "{\n" +
  "  double Temp;\n" +
  "  Temp = log(((10240000/RawADC) - 10000));\n" +
  "  Temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * Temp * Temp ))* Temp );\n" +
  "  Temp = Temp - 273.15;\n" +
  "  return Temp;\n" +
  "}\n";

function dhtArduinoType(type: string): string {
  if (type === "1") {
    return "DHT21";
  }
  if (type === "2") {
    return "DHT22";
  }
  return "DHT11";
}

function buildAnalogTemperature() {
  const block = new BlockBuilder("Analog_temperature_sensor2")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "ntc"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      ensureMrtnodeAnalogResolution(generator);
      registerDefinition(
        generator,
        "define_thermister",
        THERMISTOR_FUNCTION.trimEnd(),
        "Function Thermister(): temperature from NTC thermistor (analog pin)."
      );
      return [`Thermister(analogRead(${pin}))`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("Analog_temperature.png"))
      .appendField(sensingLabel("VAR_TemSens", "temperature NTC (ºC)"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN");
    applyDefaultAnalogPinFields(this, { PIN: DEFAULT_ANALOG_TEMP_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildLm35Temperature() {
  const block = new BlockBuilder("LM35_temperature_sensor2")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "lm35"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      ensureMrtnodeAnalogResolution(generator);
      return [
        `((analogRead(${pin})*500)/1024)`,
        generator.ORDER_ATOMIC,
      ];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("LM35_temperature.png"))
      .appendField(sensingLabel("VAR_LM35", "temperature LM35 (ºC)"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN");
    applyDefaultAnalogPinFields(this, { PIN: DEFAULT_LM35_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildDhtInit() {
  const block = new BlockBuilder("dht_sensor2")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "humidity", "dht", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_DHT");
      const type = b.getFieldValue("OUTPUT_TYPE");
      const dhtNumber = b.getFieldValue("DHT_NUMBER");
      registerInclude(generator, "DHT.h");
      registerDefinition(
        generator,
        `begin_dht_${dhtNumber}`,
        `DHT dht_${dhtNumber}(${pin},${dhtArduinoType(type)});`,
        `DHT sensor object #${dhtNumber} (type ${dhtArduinoType(type)}).`
      );
      return `dht_${dhtNumber}.begin();\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("humidity11.png"))
      .appendField(initBlockLabel("DHT_INIT_LABEL", "DHT init"))
      .appendField("#")
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "DHT_NUMBER"
      )
      .appendField(
        new Blockly.FieldDropdown(dhtTypeOptions),
        "OUTPUT_TYPE"
      )
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_DHT");
    applyDefaultAllPinFields(this, { PIN_DHT: DEFAULT_DHT_PIN });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildDhtMeasure() {
  const block = new BlockBuilder("dht_measure")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "humidity", "dht"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_DHT_MEASURE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const measure = b.getFieldValue("OUTPUT_VALUE");
      const dhtNumber = b.getFieldValue("DHT_NUMBER");
      let code: string;
      if (measure === "1") {
        code = `dht_${dhtNumber}.readHumidity()`;
      } else if (measure === "2") {
        code = `dht_${dhtNumber}.computeHeatIndex(dht_${dhtNumber}.readTemperature(),dht_${dhtNumber}.readHumidity(),true)`;
      } else {
        code = `dht_${dhtNumber}.readTemperature()`;
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("humidity11.png", "value"))
      .appendField("#")
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "DHT_NUMBER"
      )
      .appendField(
        new Blockly.FieldDropdown(dhtTypeOptions),
        "OUTPUT_TYPE"
      )
      .appendField(
        new Blockly.FieldDropdown(dhtMeasureOptions),
        "OUTPUT_VALUE"
      );
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel(
        "dht22_tooltip",
        "Read temperature, humidity or heat index from initialized DHT sensor."
      )
    );
  };
  return block;
}

function buildFlameAnalog() {
  const block = new BlockBuilder("Flame_sensor2")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "flame"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_FLAME");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("flame.png"))
      .appendField(sensingLabel("FLAME_NAME", "flame"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_FLAME");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, { PIN_FLAME: DEFAULT_ANALOG_TEMP_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildFlameDigital() {
  const block = new BlockBuilder("Flame_status_sensor2")
    .setCategory(TEMPERATURE_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "temperature", "flame"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_FLAME");
      registerDigitalInputSetup(generator, "setup_flame", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("flame.png"))
      .appendField(sensingLabel("FLAME_NAME", "flame"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createDigitalPinDropdownField(), "PIN_FLAME")
      .appendField(sensingLabel("FLAME_DETECTED", "detected"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

export const TEMPERATURE_BLOCKS = [
  buildAnalogTemperature(),
  buildLm35Temperature(),
  buildDhtInit(),
  buildDhtMeasure(),
  buildFlameAnalog(),
  buildFlameDigital(),
];
