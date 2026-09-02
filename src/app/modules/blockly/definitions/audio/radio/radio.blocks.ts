import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  audioLabel,
  createBlockIconField,
  ensureTea5767Init,
  initBlockLabel,
} from "../audio.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  MADRID_FREQUENCY_OPTIONS,
  RADIO_CATEGORY,
  TEA5767_MUTE_OPTIONS,
  TEA5767_POWER_OPTIONS,
  RADIO_LEVEL,
} from "../config";

const RADIO_LABEL = "📻 ";

function buildRadioTea5767Init() {
  const block = new BlockBuilder("RadioTEA5767_init")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      ensureTea5767Init(generator);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("radio.png"))
      .appendField(initBlockLabel("TEA5767_init", "TEA5767 Radio"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the RadioTEA5767 module");
  };
  return block;
}

function buildRadioTea5767Activate() {
  const block = new BlockBuilder("RadioTEA5767_activate")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, _generator) => {
      const power = b.getFieldValue("TEA5767_POWER");
      return power === "1"
        ? "radio.setStandByOff();\n"
        : "radio.setStandByOn();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(RADIO_LABEL + audioLabel("TEA5767_name", "TEA5767"))
      .appendField(audioLabel("TEA5767_turnOFF_ON", "Power"))
      .appendField(new Blockly.FieldDropdown(TEA5767_POWER_OPTIONS), "TEA5767_POWER");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Option to activate/deactivate the radio module");
  };
  return block;
}

function buildRadioTea5767Mute() {
  const block = new BlockBuilder("RadioTEA5767_mute")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, _generator) => {
      const mute = b.getFieldValue("TEA5767_MUTE");
      return mute === "1" ? "radio.mute();\n" : "radio.turnTheSoundBackOn();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(RADIO_LABEL + audioLabel("TEA5767_name", "TEA5767"))
      .appendField(audioLabel("TEA5767_muteOFF_ON", "Mute"))
      .appendField(new Blockly.FieldDropdown(TEA5767_MUTE_OPTIONS), "TEA5767_MUTE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Option to mute/unmute the radio");
  };
  return block;
}

function buildRadioTea5767LevelSignal() {
  const block = new BlockBuilder("RadioTEA5767_LevelSignal")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "radio.getSignalLevel()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(RADIO_LABEL + audioLabel("TEA5767_name", "TEA5767"))
      .appendField(audioLabel("TEA5767_Level", "Signal level"));
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip("Return the level of signal");
  };
  return block;
}

function buildRadioTea5767Stereo() {
  const block = new BlockBuilder("RadioTEA5767_Stereo")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "radio.isStereo()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(RADIO_LABEL + audioLabel("TEA5767_name", "TEA5767"))
      .appendField(audioLabel("TEA5767_Stereo", "Stereo"));
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setTooltip("Return whether the signal is stereo");
  };
  return block;
}

function buildRadioTea5767SetFrequency() {
  const block = new BlockBuilder("RadioTEA5767_setFrequency")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const value = generator.valueToCode(b, "Value", generator.ORDER_ATOMIC);
      return `radio.selectFrequency((float)${value});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(RADIO_LABEL + audioLabel("TEA5767_name", "TEA5767"))
      .appendField(audioLabel("TEA5767_RadioStation", "Radio station"));
    this.appendValueInput("Value")
      .setCheck("Number")
      .appendField(audioLabel("TEA5767_SetFrequency", "Set frequency"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    attachShadowBlock(this, "Value", "math_number", { NUM: 88.2 });
  };
  return block;
}

function buildFrequenciesMadrid() {
  const block = new BlockBuilder("frequenciesMadrid")
    .setCategory(RADIO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RADIO_LEVEL)
    .setTags(["audio", "radio", "frequency"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => [
      b.getFieldValue("FREQUENCY"),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📡 " + audioLabel("TEA5767_MadridFrequency", "Madrid frequencies"))
      .appendField(
        new Blockly.FieldDropdown(MADRID_FREQUENCY_OPTIONS),
        "FREQUENCY"
      );
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("");
  };
  return block;
}

export const RADIO_BLOCKS = [
  buildRadioTea5767Init(),
  buildRadioTea5767Activate(),
  buildRadioTea5767Mute(),
  buildRadioTea5767LevelSignal(),
  buildRadioTea5767Stereo(),
  buildRadioTea5767SetFrequency(),
  buildFrequenciesMadrid(),
];
