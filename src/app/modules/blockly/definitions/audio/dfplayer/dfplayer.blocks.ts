import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  applyDefaultPinFields,
  audioLabel,
  createBlockIconField,
  createPinDropdownField,
  ensureDfPlayerInit,
  initBlockLabel,
  volumeToDfPlayerHex,
} from "../audio.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_DFPLAYER_PINS,
  DFPLAYER_CATEGORY,
  DFPLAYER_LEVEL,
} from "../config";

function buildLp2iMp3Init() {
  const block = new BlockBuilder("lp2i_mp3_init")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_lp2i_mp3_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator((b, generator) => {
      const pinRx = b.getFieldValue("PIN_RX");
      const pinTx = b.getFieldValue("PIN_TX");
      const autoplay = b.getFieldValue("play") === "TRUE";
      const vol = generator.valueToCode(b, "Volume", generator.ORDER_ATOMIC);
      ensureDfPlayerInit(
        generator,
        pinRx,
        pinTx,
        volumeToDfPlayerHex(vol),
        autoplay
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("dfplayer.png"))
      .appendField(initBlockLabel("lp2i_mp3", "DFMini MP3"));
    this.appendDummyInput()
      .appendField(audioLabel("MP3OS_TX", "TX"))
      .appendField(createPinDropdownField(), "PIN_TX");
    this.appendDummyInput()
      .appendField(audioLabel("MP3OS_RX", "RX"))
      .appendField(createPinDropdownField(), "PIN_RX");
    this.appendValueInput("Volume")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("lp2i_mp3_Volume", "Volume"));
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("lp2i_mp3_autoplay", "Autoplay"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "play");
    applyDefaultPinFields(this, {
      PIN_TX: DEFAULT_DFPLAYER_PINS.TX,
      PIN_RX: DEFAULT_DFPLAYER_PINS.RX,
    });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      audioLabel("lp2i_mp3_tooltip", "Initialize the DFPlayer Mini MP3 module.")
    );
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
    attachShadowBlock(this, "Volume", "math_number", { NUM: 20 });
  };
  return block;
}

function buildLp2iMp3PlayTrack() {
  const block = new BlockBuilder("lp2i_mp3_play_track")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_lp2i_mp3_play_track_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator((b, generator) => {
      const track = generator.valueToCode(b, "num", generator.ORDER_ATOMIC);
      return `exe_cmd(0x03,0,${track});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("num")
      .setCheck("Number")
      .appendField(`${audioLabel("lp2i_mp3_play", "Play")} #`);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      audioLabel("lp2i_mp3_play_track_tooltip", "Play a specific track by number.")
    );
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
    attachShadowBlock(this, "num", "math_number", { NUM: 1 });
  };
  return block;
}

function buildLp2iMp3Play() {
  const block = new BlockBuilder("lp2i_mp3_play")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_lp2i_mp3_play_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator(() => "exe_cmd(0x0D,0,1);\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(audioLabel("lp2i_mp3_play", "Play"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("lp2i_mp3_play_tooltip", "Resume or start playback."));
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
  };
  return block;
}

function buildLp2iMp3Volume() {
  const block = new BlockBuilder("lp2i_mp3_volume")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_lp2i_mp3_vol_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator((b, generator) => {
      const vol = generator.valueToCode(b, "Volume", generator.ORDER_ATOMIC);
      return `exe_cmd(0x06,0,${volumeToDfPlayerHex(vol)});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("Volume")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("lp2i_mp3_vol", "Volume"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("lp2i_mp3_vol_tooltip", "Set the playback volume (0-48)."));
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
    attachShadowBlock(this, "Volume", "math_number", { NUM: 20 });
  };
  return block;
}

function buildLp2iMp3Next() {
  const block = new BlockBuilder("lp2i_mp3_next")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_lp2i_mp3_next_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator(() => "exe_cmd(0x01,0,1);\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(audioLabel("lp2i_mp3_next", "Next track"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("lp2i_mp3_next_tooltip", "Play the next track."));
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
  };
  return block;
}

function buildLp2iMp3Prev() {
  const block = new BlockBuilder("lp2i_mp3_prev")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_lp2i_mp3_prev_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator(() => "exe_cmd(0x02,0,1);\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(audioLabel("lp2i_mp3_prev", "Previous track"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("lp2i_mp3_prev_tooltip", "Play the previous track."));
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
  };
  return block;
}

function buildLp2iMp3Pause() {
  const block = new BlockBuilder("lp2i_mp3_pause")
    .setCategory(DFPLAYER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(DFPLAYER_LEVEL)
    .setTags(["audio", "dfplayer"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_lp2i_mp3_pause_tooltip}")
    .setHelpUrl("%{BKY_lp2i_mp3_helpurl}")
    .setArduinoGenerator(() => "exe_cmd(0x0E,0,0);\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(audioLabel("lp2i_mp3_pause", "Pause"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("lp2i_mp3_pause_tooltip", "Pause playback."));
    this.setHelpUrl(audioLabel("lp2i_mp3_helpurl", ""));
  };
  return block;
}

export const DFPLAYER_BLOCKS = [
  buildLp2iMp3Init(),
  buildLp2iMp3PlayTrack(),
  buildLp2iMp3Play(),
  buildLp2iMp3Volume(),
  buildLp2iMp3Next(),
  buildLp2iMp3Prev(),
  buildLp2iMp3Pause(),
];
