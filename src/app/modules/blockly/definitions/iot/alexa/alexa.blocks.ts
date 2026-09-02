import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import {
  ALEXA_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  iotLabel,
  registerGlobal,
  registerSetup,
} from "../iot.helper";

const ALEXA_ICON = "alexa.png";

const ALEXA_DEVICE_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
  ["10", "10"],
];

const ALEXA_PARAM_OPTIONS: [string, string][] = [
  ["On/Off state", "4"],
  ["Red color(R)", "0"],
  ["Green Color(G)", "1"],
  ["Blue color(B)", "2"],
  ["Level of Color(0-255)", "3"],
  ["% Color(0-100)", "5"],
  ["Brightness(0-100)", "6"],
];

function buildAlexaInitEsp() {
  const block = new BlockBuilder("Alexa_init_esp")
    .setCategory(ALEXA_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "alexa", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const numDevice = b.getFieldValue("NumDevice");
      const nameDevice = b.getFieldValue("NameDevice");
      registerInclude(generator, "Espalexa.h", "Espalexa Alexa voice control.");
      registerGlobal(
        generator,
        "define_espalexa_variable",
        "Espalexa ESP_alexa;\n"
      );
      registerSetup(generator, "setup_alexa", "ESP_alexa.begin();\n");
      registerSetup(
        generator,
        `setup_cb_device${numDevice}`,
        `ESP_alexa.addDevice("${nameDevice}",cb_espalexa_on_device_${numDevice},EspalexaDeviceType::color,0);`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ALEXA_ICON, "large"))
      .appendField(iotLabel("Alexa_init", "Alexa.Device number:"))
      .appendField(new Blockly.FieldDropdown(ALEXA_DEVICE_OPTIONS), "NumDevice");
    this.appendDummyInput()
      .appendField(iotLabel("Alexa_init2", "Name:"))
      .appendField(new Blockly.FieldTextInput(""), "NameDevice");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the library to communicate with Alexa");
  };
  return block;
}

function buildAlexaReceptionFunction() {
  const block = new BlockBuilder("Alexa_reception_function")
    .setCategory(ALEXA_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "alexa", "callback"])
    .setArduinoGenerator((b, generator) => {
      const numDevice = b.getFieldValue("NumDevice");
      const branch = generator.statementToCode(b, "DO");
      generator.codeFunctions_[`esp_reception_function${numDevice}`] =
        `void cb_espalexa_on_device_${numDevice}(EspalexaDevice* d){\n${branch}}\n`;
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ALEXA_ICON, "large"))
      .appendField(iotLabel("Alexa_cb", "Alexa callback"))
      .appendField(new Blockly.FieldDropdown(ALEXA_DEVICE_OPTIONS), "NumDevice");
    this.appendStatementInput("DO").appendField(
      Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do"
    );
    this.setInputsInline(false);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setHelpUrl(Blockly.Msg["HELPURL"] || "");
  };
  return block;
}

function buildAlexaLoop() {
  const block = new BlockBuilder("Alexa_loop")
    .setCategory(ALEXA_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "alexa", "loop"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator(() => "ESP_alexa.loop();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ALEXA_ICON, "large"))
      .appendField(iotLabel("Alexa_Loop", "Alexa loop"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Topic attend in the loop");
  };
  return block;
}

function buildAlexaParam() {
  const block = new BlockBuilder("Alexa_param")
    .setCategory(ALEXA_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "alexa", "param"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const resultAlexa = b.getFieldValue("PARAM_ALEXA");
      let code: string;
      switch (resultAlexa) {
        case "0":
          code = "(d->getR())";
          break;
        case "1":
          code = "(d->getG())";
          break;
        case "2":
          code = "(d->getB())";
          break;
        case "3":
          code = "(d->getValue())";
          break;
        case "4":
          code = "((bool)d->getValue())";
          break;
        case "5":
          code = "(d->getPercent())";
          break;
        default:
          code = "(d->getDegrees())";
          break;
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ALEXA_ICON, "large"))
      .appendField(iotLabel("Alexa_Param", "Alexa parameter"))
      .appendField(new Blockly.FieldDropdown(ALEXA_PARAM_OPTIONS), "PARAM_ALEXA");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const ALEXA_BLOCKS = [
  buildAlexaInitEsp(),
  buildAlexaReceptionFunction(),
  buildAlexaLoop(),
  buildAlexaParam(),
];
