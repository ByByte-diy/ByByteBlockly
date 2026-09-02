import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerDefinition } from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { registerLedOutputSetup } from "../../led/led.helper";
import {
  audioLabel,
  createBlockIconField,
  createPinDropdownField,
  ensureBuzzerPin,
  ensureEsp32BuzzerToneSetup,
  ensurePlayRtttlInclude,
  esp32BuzzerStopCode,
  esp32BuzzerToneCode,
  initBlockLabel,
  melodyVarNameFromCode,
  rtttlPlayCall,
} from "../audio.helper";
import {
  BUZZER_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  MRTX_BOARD_IDS,
  MRTX_INTERNAL_BUZZER_PIN,
  NOTE_OPTIONS,
  RTTTL_MELODY_OPTIONS,
  TEMPO_OPTIONS,
  BUZZER_LEVEL,
} from "../config";
import { BlockDefinition } from "../../../types/block.types";

function setAvrBoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["arduino"] };
}

function setEsp32BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp32"] };
}

function registerCustomMelody(
  generator: any,
  rtttlMelody: string
): string {
  const nameMelody = melodyVarNameFromCode(rtttlMelody);
  registerDefinition(
    generator,
    `Melody_${nameMelody}`,
    `static const char melody_${nameMelody}[] PROGMEM = ${rtttlMelody};`,
    `Custom RTTTL melody: melody_${nameMelody}.`
  );
  return nameMelody;
}

function buildBuzzerInit() {
  const block = new BlockBuilder("buzzer_init")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_del_tooltip}")
    .setArduinoGenerator((b, generator) => {
      ensureBuzzerPin(generator, b.getFieldValue("PIN"));
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("buzzer.png"))
      .appendField(initBlockLabel("OTTO9_BUZZER", "buzzer"))
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("del_tooltip", "Configure the buzzer output pin."));
  };
  return block;
}

function buildRtttlMusic() {
  const block = new BlockBuilder("RTTTL_music")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const melody = b.getFieldValue("MELODY");
      const pin = b.getFieldValue("PIN_BUZZER");
      ensurePlayRtttlInclude(generator);
      return rtttlPlayCall(pin, melody);
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_TONE_INPUT1", "Buzzer"))
      .appendField(createPinDropdownField(), "PIN_BUZZER");
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"))
      .appendField(new Blockly.FieldDropdown(RTTTL_MELODY_OPTIONS), "MELODY");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

function buildRtttlMusicCustom() {
  const block = new BlockBuilder("RTTTL_music_custom")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUZZER");
      const rtttlMelody = generator.valueToCode(
        b,
        "rtttl_melody",
        generator.ORDER_ATOMIC
      );
      ensurePlayRtttlInclude(generator);
      const nameMelody = registerCustomMelody(generator, rtttlMelody);
      return rtttlPlayCall(pin, `melody_${nameMelody}`);
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_TONE_INPUT1", "Buzzer"))
      .appendField(createPinDropdownField(), "PIN_BUZZER");
    this.appendValueInput("rtttl_melody")
      .setCheck("String")
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

function buildRtttlMusicX() {
  const block = new BlockBuilder("RTTTL_music_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const melody = b.getFieldValue("MELODY");
      ensurePlayRtttlInclude(generator);
      return `playRtttlBlocking(${MRTX_INTERNAL_BUZZER_PIN},(char*)${melody});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1_X", "Buzzer (MRTX)")
    );
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"))
      .appendField(new Blockly.FieldDropdown(RTTTL_MELODY_OPTIONS), "MELODY");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

function buildRtttlMusicCustomX() {
  const block = new BlockBuilder("RTTTL_music_custom_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const rtttlMelody = generator.valueToCode(
        b,
        "rtttl_melody",
        generator.ORDER_ATOMIC
      );
      ensurePlayRtttlInclude(generator);
      const nameMelody = registerCustomMelody(generator, rtttlMelody);
      return `playRtttlBlocking(${MRTX_INTERNAL_BUZZER_PIN},(char*) melody_${nameMelody});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1_X", "Buzzer (MRTX)")
    );
    this.appendValueInput("rtttl_melody")
      .setCheck("String")
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

function buildPlay() {
  const block = new BlockBuilder("play")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_play_tooltip}")
    .setHelpUrl("%{BKY_play_helpurl}")
    .setArduinoGenerator((b, _generator) => {
      const note = b.getFieldValue("note");
      const tempo = b.getFieldValue("tempo");
      return `tone( buzzer,${note},${tempo});\n delay(${tempo});\n`;
    })
    .build();

  setAvrBoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1", "Buzzer")
    );
    this.appendDummyInput()
      .appendField(audioLabel("play", "play"))
      .appendField(new Blockly.FieldDropdown(NOTE_OPTIONS), "note")
      .appendField(new Blockly.FieldDropdown(TEMPO_OPTIONS), "tempo");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("play_tooltip", "Play a musical note on the buzzer."));
    this.setHelpUrl(audioLabel("play_helpurl", ""));
  };
  return block;
}

function buildTone() {
  const block = new BlockBuilder("tone")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_TONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((b, generator) => {
      const num = generator.valueToCode(b, "NUM", generator.ORDER_ATOMIC);
      const tps = generator.valueToCode(b, "TPS", generator.ORDER_ATOMIC);
      return `tone( buzzer,${num},${tps});\ndelay(${tps});\n`;
    })
    .build();

  setAvrBoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1", "Buzzer")
    );
    this.appendValueInput("NUM")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT2", "frequency"))
      .setCheck("Number");
    this.appendValueInput("TPS")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT3", "duration"))
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      audioLabel("ARDUINO_TONE_TOOLTIP", "Play a tone at the given frequency and duration.")
    );
    this.setHelpUrl(audioLabel("HELPURL", ""));
    attachShadowBlock(this, "NUM", "math_number", { NUM: 440 });
    attachShadowBlock(this, "TPS", "math_number", { NUM: 500 });
  };
  return block;
}

function buildBeep() {
  const block = new BlockBuilder("beep")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "beep"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_beep_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      registerLedOutputSetup(generator, `setup_output${pin}`, pin);
      return `tone(${pin},440,1000);\ndelay(1000);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("beep", "beep"))
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("beep_TOOLTIP", "Play a 440 Hz beep for 1 second."));
    this.setHelpUrl(audioLabel("HELPURL", ""));
  };
  return block;
}

function buildNotone() {
  const block = new BlockBuilder("notone")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_NOTONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((_b, _generator) => "noTone( buzzer);\n")
    .build();

  setAvrBoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_NOTONE_INPUT", "stop tone")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("ARDUINO_NOTONE_TOOLTIP", "Stop the buzzer tone."));
    this.setHelpUrl(audioLabel("HELPURL", ""));
  };
  return block;
}

function buildPlayX() {
  const block = new BlockBuilder("play_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_play_tooltip}")
    .setHelpUrl("%{BKY_play_helpurl}")
    .setArduinoGenerator((b, generator) => {
      const note = b.getFieldValue("note");
      const tempo = b.getFieldValue("tempo");
      registerLedOutputSetup(generator, "setup_output", MRTX_INTERNAL_BUZZER_PIN);
      return `tone(${MRTX_INTERNAL_BUZZER_PIN},${note},${tempo});\n delay(${tempo});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1_X", "Buzzer (MRTX)")
    );
    this.appendDummyInput()
      .appendField(audioLabel("play", "play"))
      .appendField(new Blockly.FieldDropdown(NOTE_OPTIONS), "note")
      .appendField(new Blockly.FieldDropdown(TEMPO_OPTIONS), "tempo");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("play_tooltip", "Play a musical note on the buzzer."));
    this.setHelpUrl(audioLabel("play_helpurl", ""));
  };
  return block;
}

function buildToneX() {
  const block = new BlockBuilder("tone_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_TONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((b, generator) => {
      const num = generator.valueToCode(b, "NUM", generator.ORDER_ATOMIC);
      const tps = generator.valueToCode(b, "TPS", generator.ORDER_ATOMIC);
      registerLedOutputSetup(generator, "setup_output", MRTX_INTERNAL_BUZZER_PIN);
      return `tone(${MRTX_INTERNAL_BUZZER_PIN},${num},${tps});\ndelay(${tps});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1_X", "Buzzer (MRTX)")
    );
    this.appendValueInput("NUM")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT2", "frequency"))
      .setCheck("Number");
    this.appendValueInput("TPS")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT3", "duration"))
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      audioLabel("ARDUINO_TONE_TOOLTIP", "Play a tone at the given frequency and duration.")
    );
    this.setHelpUrl(audioLabel("HELPURL", ""));
    attachShadowBlock(this, "NUM", "math_number", { NUM: 440 });
    attachShadowBlock(this, "TPS", "math_number", { NUM: 500 });
  };
  return block;
}

function buildBeepX() {
  const block = new BlockBuilder("beep_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "beep", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_beep_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((_b, generator) => {
      registerLedOutputSetup(generator, "setup_output", MRTX_INTERNAL_BUZZER_PIN);
      return `tone(${MRTX_INTERNAL_BUZZER_PIN},440,1000);\ndelay(1000);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(audioLabel("beep", "beep"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("beep_TOOLTIP", "Play a 440 Hz beep for 1 second."));
    this.setHelpUrl(audioLabel("HELPURL", ""));
  };
  return block;
}

function buildNotoneX() {
  const block = new BlockBuilder("notone_x")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_NOTONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((_b, generator) => {
      registerLedOutputSetup(generator, "setup_output", MRTX_INTERNAL_BUZZER_PIN);
      return `noTone(${MRTX_INTERNAL_BUZZER_PIN});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_NOTONE_INPUT", "stop tone"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("ARDUINO_NOTONE_TOOLTIP", "Stop the buzzer tone."));
    this.setHelpUrl(audioLabel("HELPURL", ""));
  };
  return block;
}

function buildPlayEsp32() {
  const block = new BlockBuilder("play_esp32")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_play_tooltip}")
    .setHelpUrl("%{BKY_play_helpurl}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUZZER");
      const note = b.getFieldValue("note");
      const tempo = b.getFieldValue("tempo");
      ensureEsp32BuzzerToneSetup(generator, pin);
      return esp32BuzzerToneCode(note, tempo);
    })
    .build();

  setEsp32BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_TONE_INPUT1", "Buzzer"))
      .appendField(createPinDropdownField(), "PIN_BUZZER");
    this.appendDummyInput()
      .appendField(audioLabel("play", "play"))
      .appendField(new Blockly.FieldDropdown(NOTE_OPTIONS), "note")
      .appendField(new Blockly.FieldDropdown(TEMPO_OPTIONS), "tempo");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("play_tooltip", "Play a musical note on the buzzer."));
    this.setHelpUrl(audioLabel("play_helpurl", ""));
  };
  return block;
}

function buildToneEsp32() {
  const block = new BlockBuilder("tone_esp32")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_TONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUZZER");
      const num = generator.valueToCode(b, "NUM", generator.ORDER_ATOMIC);
      const tps = generator.valueToCode(b, "TPS", generator.ORDER_ATOMIC);
      ensureEsp32BuzzerToneSetup(generator, pin);
      return esp32BuzzerToneCode(num, tps);
    })
    .build();

  setEsp32BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_TONE_INPUT1", "Buzzer"))
      .appendField(createPinDropdownField(), "PIN_BUZZER");
    this.appendValueInput("NUM")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT2", "frequency"))
      .setCheck("Number");
    this.appendValueInput("TPS")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(audioLabel("ARDUINO_TONE_INPUT3", "duration"))
      .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      audioLabel("ARDUINO_TONE_TOOLTIP", "Play a tone at the given frequency and duration.")
    );
    this.setHelpUrl(audioLabel("HELPURL", ""));
    attachShadowBlock(this, "NUM", "math_number", { NUM: 440 });
    attachShadowBlock(this, "TPS", "math_number", { NUM: 500 });
  };
  return block;
}

function buildNotoneEsp32() {
  const block = new BlockBuilder("notone_esp32")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "tone", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_NOTONE_TOOLTIP}")
    .setHelpUrl("%{BKY_HELPURL}")
    .setArduinoGenerator((b, generator) => {
      ensureEsp32BuzzerToneSetup(generator, b.getFieldValue("PIN_BUZZER"));
      return esp32BuzzerStopCode();
    })
    .build();

  setEsp32BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_NOTONE_INPUT", "stop tone"))
      .appendField(createPinDropdownField(), "PIN_BUZZER");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(audioLabel("ARDUINO_NOTONE_TOOLTIP", "Stop the buzzer tone."));
    this.setHelpUrl(audioLabel("HELPURL", ""));
  };
  return block;
}

function buildBuzzerMusic() {
  const block = new BlockBuilder("buzzer_music")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const melody = b.getFieldValue("MELODY");
      ensurePlayRtttlInclude(generator);
      return `playRtttlBlockingPGM(buzzer,(char*)${melody});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1", "Buzzer")
    );
    this.appendDummyInput()
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"))
      .appendField(new Blockly.FieldDropdown(RTTTL_MELODY_OPTIONS), "MELODY");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

function buildBuzzerMusicCustom() {
  const block = new BlockBuilder("buzzer_music_custom")
    .setCategory(BUZZER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BUZZER_LEVEL)
    .setTags(["audio", "buzzer", "rtttl"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const rtttlMelody = generator.valueToCode(
        b,
        "rtttl_melody",
        generator.ORDER_ATOMIC
      );
      ensurePlayRtttlInclude(generator);
      const nameMelody = registerCustomMelody(generator, rtttlMelody);
      return `playRtttlBlockingPGM(buzzer,(char*) melody_${nameMelody});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      audioLabel("ARDUINO_TONE_INPUT1", "Buzzer")
    );
    this.appendValueInput("rtttl_melody")
      .setCheck("String")
      .appendField(audioLabel("ARDUINO_RTTTL_BLOCK", "RTTTL melody"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Play RTTTL melody");
  };
  return block;
}

export const BUZZER_BLOCKS = [
  buildBuzzerInit(),
  buildRtttlMusic(),
  buildRtttlMusicCustom(),
  buildRtttlMusicX(),
  buildRtttlMusicCustomX(),
  buildPlay(),
  buildTone(),
  buildBeep(),
  buildNotone(),
  buildPlayX(),
  buildToneX(),
  buildBeepX(),
  buildNotoneX(),
  buildPlayEsp32(),
  buildToneEsp32(),
  buildNotoneEsp32(),
  buildBuzzerMusic(),
  buildBuzzerMusicCustom(),
];
