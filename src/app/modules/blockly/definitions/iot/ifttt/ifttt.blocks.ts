import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerUserFunction,
} from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  createBlockIconField,
  ensureHttpClientInclude,
  iotLabel,
} from "../iot.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  IFTTT_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";

function buildIftttInit() {
  const block = new BlockBuilder("ifttt_init")
    .setCategory(IFTTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ifttt", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const apiKey = b.getFieldValue("API_KEY");
      registerDefinition(
        generator,
        "define_IFTTT",
        `#define IFTTTKEY "${apiKey}"`,
        "IFTTT maker webhook API key."
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ifttt.png", "remoteWide"))
      .appendField(iotLabel("IFTTT_init", "Configuration.Api key"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxxxxxxxxx"), "API_KEY");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init IFTTT configuration");
  };
  return block;
}

function buildIftttSend() {
  const block = new BlockBuilder("ifttt_send")
    .setCategory(IFTTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ifttt"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const value1 = generator.valueToCode(b, "value1", generator.ORDER_ATOMIC);
      const value2 = generator.valueToCode(b, "value2", generator.ORDER_ATOMIC);
      const value3 = generator.valueToCode(b, "value3", generator.ORDER_ATOMIC);
      const evento = generator.valueToCode(b, "evento", generator.ORDER_ATOMIC);

      ensureHttpClientInclude(generator);

      registerUserFunction(
        generator,
        "send_ifttt_function",
        "void enviar_ifttt(String evento,String valor1, String valor2, String valor3)\n" +
          "{\n" +
          " // Cerramos cualquier conexión anterior\n" +
          " HTTPClient http;\n" +
          " WiFiClient client;\n" +
          "\n" +
          'String servername="http://maker.ifttt.com/trigger/"+evento+"/with/key/"+IFTTTKEY;\n' +
          "http.begin(client,servername);\n" +
          "\n" +
          ' http.addHeader("Content-Type","application/x-www-form-urlencoded");\n' +
          "\n" +
          " // Hacemos la petición final\n" +
          'String httpRequestData = "value1="+String(valor1)+"&value2="+String(valor2)+"&value3="+String(valor3);\n' +
          "     \n" +
          " // Send HTTP POST request\n" +
          " http.POST(httpRequestData);\n" +
          " http.end();\n" +
          "}\n",
        "Send an HTTP POST request to IFTTT maker webhook."
      );

      return `enviar_ifttt(${evento},${value1},${value2},${value3});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ifttt.png", "remoteWide"))
      .appendField(iotLabel("IFTTT_send", "Send information"));
    this.appendValueInput("evento")
      .appendField(iotLabel("IFTTT_event", "Event as String"));
    this.appendValueInput("value1")
      .appendField(iotLabel("IFTTT_value1", "Value 1 as String"));
    this.appendValueInput("value2")
      .appendField(iotLabel("IFTTT_value2", "Value 2 as String"));
    this.appendValueInput("value3")
      .appendField(iotLabel("IFTTT_value3", "Value 3 as String"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Send request to IFTTT");
    attachShadowBlock(this, "evento", "text", { TEXT: "event" });
    attachShadowBlock(this, "value1", "text", { TEXT: "value1" });
    attachShadowBlock(this, "value2", "text", { TEXT: "value2" });
    attachShadowBlock(this, "value3", "text", { TEXT: "value3" });
  };
  return block;
}

export const IFTTT_BLOCKS = [buildIftttInit(), buildIftttSend()];
