import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  THINGSPEAK_CATEGORY,
  THINGSPEAK_FIELD_OPTIONS,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  iotLabel,
  registerGlobal,
  registerSetup,
} from "../iot.helper";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";

function buildThingspeakInit() {
  const block = new BlockBuilder("thingspeak_init")
    .setCategory(THINGSPEAK_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "thingspeak", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const channel = b.getFieldValue("CHANNEL");
      const apiWriteKey = b.getFieldValue("API_WRITE_KEY");
      const apiReadKey = b.getFieldValue("API_READ_KEY");
      registerInclude(generator, "ThingSpeak.h", "ThingSpeak IoT channel library.");
      registerGlobal(
        generator,
        "define_thingspeak_variables",
        "WiFiClient client;\n" +
          `unsigned long myChannelNumber =${channel};\n` +
          `const char * myWriteAPIKey ="${apiWriteKey}";\n` +
          `const char * myReadAPIKey="${apiReadKey}";\n`
      );
      registerSetup(generator, "setup_thingspeak", "ThingSpeak.begin(client);\n");
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("thingspeak.png"))
      .appendField(iotLabel("Thingspeak_name_init", "Configuration Thingspeak."))
      .appendField(iotLabel("Thingspeak_channel", "Channel"))
      .appendField(new Blockly.FieldTextInput("1233456"), "CHANNEL");
    this.appendDummyInput()
      .appendField(iotLabel("Thingspeak_apiwrite", "Api write key"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxx"), "API_WRITE_KEY")
      .appendField(iotLabel("Thingspeak_apiread", "Api read key"))
      .appendField(new Blockly.FieldTextInput("yyyyyyyy"), "API_READ_KEY");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init thingspeak functions");
    this.setHelpUrl("");
  };
  return block;
}

function buildThingspeakWrite() {
  const block = new BlockBuilder("thingspeak_write")
    .setCategory(THINGSPEAK_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "thingspeak"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const variable = generator.valueToCode(b, "variable", generator.ORDER_ATOMIC);
      const field = b.getFieldValue("FIELD");
      return `ThingSpeak.writeField(myChannelNumber,${field},${variable}, myWriteAPIKey);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("thingspeak.png"))
      .appendField(iotLabel("Thingspeak_name", "Thingspeak."))
      .appendField(iotLabel("Thingspeak_Write", "Write value"));
    this.appendValueInput("variable");
    this.appendDummyInput()
      .appendField(iotLabel("Thingspeak_field", "in field"))
      .appendField(new Blockly.FieldDropdown(THINGSPEAK_FIELD_OPTIONS), "FIELD");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write field in thingspeak");
    this.setHelpUrl("You need to wait >20 second to send another value");
  };
  return block;
}

function buildThingspeakWriteLong() {
  const block = new BlockBuilder("thingspeak_write_long")
    .setCategory(THINGSPEAK_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "thingspeak"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const field = b.getFieldValue("FIELD");
      return [
        `ThingSpeak.readLongField(myChannelNumber,${field},myReadAPIKey)`,
        generator.ORDER_ATOMIC,
      ];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("thingspeak.png"))
      .appendField(iotLabel("Thingspeak_name", "Thingspeak."))
      .appendField(iotLabel("Thingspeak_ReadLong", "Read as long the field"))
      .appendField(new Blockly.FieldDropdown(THINGSPEAK_FIELD_OPTIONS), "FIELD");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the field in long or number");
    this.setHelpUrl("");
  };
  return block;
}

function buildThingspeakWriteFloat() {
  const block = new BlockBuilder("thingspeak_write_float")
    .setCategory(THINGSPEAK_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "thingspeak"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const field = b.getFieldValue("FIELD");
      return [
        `ThingSpeak.readFloatField(myChannelNumber,${field},myReadAPIKey)`,
        generator.ORDER_ATOMIC,
      ];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("thingspeak.png"))
      .appendField(iotLabel("Thingspeak_name", "Thingspeak."))
      .appendField(iotLabel("Thingspeak_ReadFloat", "Read as float the field"))
      .appendField(new Blockly.FieldDropdown(THINGSPEAK_FIELD_OPTIONS), "FIELD");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the field in long or number");
    this.setHelpUrl("");
  };
  return block;
}

export const THINGSPEAK_BLOCKS = [
  buildThingspeakInit(),
  buildThingspeakWrite(),
  buildThingspeakWriteLong(),
  buildThingspeakWriteFloat(),
];
