import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  applyDefaultDigitalPinFields,
  audioLabel,
  createBlockIconField,
  createDigitalPinDropdownField,
  ensureOpenSmartMp3Init,
  initBlockLabel,
  openSmartOperationCode,
} from "../audio.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_OPENSMART_PINS,
  OPENSMART_CATEGORY,
  OPENSMART_OPERATION_OPTIONS,
  OPENSMART_LEVEL,
} from "../config";

const OPENSMART_LABEL = "🎧 ";

function buildOpenSmartMp3InitSs() {
  const block = new BlockBuilder("OpenSmartMp3_init_ss")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      ensureOpenSmartMp3Init(
        generator,
        b.getFieldValue("PIN_RX"),
        b.getFieldValue("PIN_TX")
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("opensmart.png"))
      .appendField(initBlockLabel("MP3OS_name", "OpenSmart MP3"));
    this.appendDummyInput()
      .appendField(audioLabel("MP3OS_TX", "TX"))
      .appendField(createDigitalPinDropdownField(), "PIN_TX");
    this.appendDummyInput()
      .appendField(audioLabel("MP3OS_RX", "RX"))
      .appendField(createDigitalPinDropdownField(), "PIN_RX");
    applyDefaultDigitalPinFields(this, {
      PIN_TX: DEFAULT_OPENSMART_PINS.TX,
      PIN_RX: DEFAULT_OPENSMART_PINS.RX,
    });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the OpenSmart MP3 module");
  };
  return block;
}

function buildOpenSmartMp3SetVolumen() {
  const block = new BlockBuilder("OpenSmartMp3_set_volumen")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const volumen = generator.valueToCode(
        b,
        "Volumen",
        generator.ORDER_ATOMIC
      );
      return `mp3.setVolume(${volumen});\ndelay(50);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(OPENSMART_LABEL + audioLabel("MP3OS_name", "OpenSmart MP3"))
      .appendField(audioLabel("MP3OS_volumen", "Volume"));
    this.appendValueInput("Volumen").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Set the volumen of MP3");
    attachShadowBlock(this, "Volumen", "math_number", { NUM: 20 });
  };
  return block;
}

function buildOpenSmartMp3Operation() {
  const block = new BlockBuilder("OpenSmartMp3_operation")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, _generator) =>
      openSmartOperationCode(b.getFieldValue("MP3_OPERATION"))
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(OPENSMART_LABEL + audioLabel("MP3OS_name", "OpenSmart MP3"))
      .appendField(audioLabel("MP3OS_operation", "Operation"))
      .appendField(
        new Blockly.FieldDropdown(OPENSMART_OPERATION_OPTIONS),
        "MP3_OPERATION"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Make an operation");
  };
  return block;
}

function buildOpenSmartMp3Playsong() {
  const block = new BlockBuilder("OpenSmartMp3_playsong")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const song = generator.valueToCode(b, "Song", generator.ORDER_ATOMIC);
      return `mp3.playWithIndex(${song});\ndelay(50);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(OPENSMART_LABEL + audioLabel("MP3OS_name", "OpenSmart MP3"))
      .appendField(audioLabel("MP3OS_playsong", "Play song"));
    this.appendValueInput("Song").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play one track");
    attachShadowBlock(this, "Song", "math_number", { NUM: 1 });
  };
  return block;
}

function buildOpenSmartMp3PlaysongDirectiry() {
  const block = new BlockBuilder("OpenSmartMp3_playsongdirectiry")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const song = generator.valueToCode(b, "Song", generator.ORDER_ATOMIC);
      const directory = generator.valueToCode(
        b,
        "Directory",
        generator.ORDER_ATOMIC
      );
      return `mp3.playWithFileName(${directory},${song});\ndelay(50);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      OPENSMART_LABEL + audioLabel("MP3OS_name", "OpenSmart MP3")
    );
    this.appendValueInput("Song")
      .setCheck("Number")
      .appendField(audioLabel("MP3OS_playsong", "Play song"));
    this.appendValueInput("Directory")
      .setCheck("Number")
      .appendField(audioLabel("MP3OS_playsongdirectory", "Directory"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play one track in one folder");
    attachShadowBlock(this, "Song", "math_number", { NUM: 1 });
    attachShadowBlock(this, "Directory", "math_number", { NUM: 1 });
  };
  return block;
}

function buildOpenSmartMp3Injectindex() {
  const block = new BlockBuilder("OpenSmartMp3_injectindex")
    .setCategory(OPENSMART_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OPENSMART_LEVEL)
    .setTags(["audio", "opensmart"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const song = generator.valueToCode(b, "Song", generator.ORDER_ATOMIC);
      return `mp3.injectWithIndex(${song});\ndelay(50);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(OPENSMART_LABEL + audioLabel("MP3OS_name", "OpenSmart MP3"))
      .appendField(audioLabel("MP3OS_inject", "Inject index"));
    this.appendValueInput("Song").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Inject a song according to the physical index of song in the TF card when it is playing song."
    );
    attachShadowBlock(this, "Song", "math_number", { NUM: 1 });
  };
  return block;
}

export const OPENSMART_BLOCKS = [
  buildOpenSmartMp3InitSs(),
  buildOpenSmartMp3SetVolumen(),
  buildOpenSmartMp3Operation(),
  buildOpenSmartMp3Playsong(),
  buildOpenSmartMp3PlaysongDirectiry(),
  buildOpenSmartMp3Injectindex(),
];
