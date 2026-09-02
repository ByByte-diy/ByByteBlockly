import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  BIPED_CATEGORY,
  CATEGORY_PLATFORMS,
  OTTO_DANCE_OPTIONS,
  OTTO_DANCE_SIZE_OPTIONS,
  OTTO_DO_OPTIONS,
  OTTO_EEPROM_COLOUR,
  OTTO_GESTURE_OPTIONS,
  OTTO_MOVEMENT_COLOUR,
  OTTO_MOVE_OPTIONS,
  OTTO_MOVE_SPEED_OPTIONS,
  OTTO_SENSOR_COLOUR,
  OTTO_SOUND_COLOUR,
  OTTO_SOUND_OPTIONS,
  OTTO_TONE_DURATION_OPTIONS,
  OTTO_TONE_NOTE_OPTIONS,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createOttoPinDropdown,
  ottoLabel,
  registerSetup,
  wrapOttoBlock,
} from "../otto.helper";

function buildOttoConfiguration() {
  const block = new BlockBuilder("otto_configuration")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pinYl = b.getFieldValue("PIN_YL");
      const pinYr = b.getFieldValue("PIN_YR");
      const pinRl = b.getFieldValue("PIN_RL");
      const pinRr = b.getFieldValue("PIN_RR");
      const pinBuzzer = b.getFieldValue("PIN_Buzzer");

      registerInclude(generator, "Otto.h", "Otto biped robot library.");
      registerGlobalVariable(
        generator,
        "otto_lib",
        "Otto Otto;",
        "Otto robot instance."
      );
      registerDefinition(
        generator,
        "otto_legs",
        `#define LeftLeg ${pinYl} // left leg pin, servo[0]\n` +
          `#define RightLeg ${pinYr} // right leg pin, servo[1]\n` +
          `#define LeftFoot ${pinRl} // left foot pin, servo[2]\n` +
          `#define RightFoot ${pinRr} // right foot pin, servo[3]\n` +
          `#define Buzzer ${pinBuzzer} //buzzer pin \n`,
        "Otto leg and buzzer pin definitions."
      );
      registerSetup(
        generator,
        "otto_init",
        "Otto.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);\n" +
          "Otto.home();\n"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_emoji.png"))
      .appendField(
        ottoLabel("OTTO_HOME_TEXT", "⚙️") +
          ottoLabel("OTTO9_HOME_TEXT", "home") +
          ottoLabel("OTTO_BIPED_TEXT", "biped")
      );
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_LEG", "leg ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_YL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_YR");
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_FOOT", "foot ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_RL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_RR");
    this.appendDummyInput()
      .appendField(ottoLabel("OTTO9_BUZZER", "buzzer"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_Buzzer");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoHome() {
  const block = new BlockBuilder("otto_home")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Otto.home();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_plus.png", "medium"))
      .appendField(ottoLabel("OTTO9_HOME_TEXT", "home"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_HOME_TOOLTIP",
    fallback: "Otto goes to home position straight",
  });
  return block;
}

function buildOttoCalibration() {
  const block = new BlockBuilder("otto_calibration")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "calibration"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const ll =
        generator.valueToCode(b, "LL", generator.ORDER_ATOMIC) || "0";
      const rl =
        generator.valueToCode(b, "RL", generator.ORDER_ATOMIC) || "0";
      const lf =
        generator.valueToCode(b, "LF", generator.ORDER_ATOMIC) || "0";
      const rf =
        generator.valueToCode(b, "RF", generator.ORDER_ATOMIC) || "0";
      return `Otto.setTrims(${ll},${rl},${lf},${rf});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendValueInput("LL")
      .setCheck("Number")
      .appendField(
        "🦿 " +
          ottoLabel("OTTO9_CALIBRATION", "calibrate ") +
          ottoLabel("OTTO9_CALIBRATION_LEG", "leg ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RL")
      .setCheck("Number")
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("LF")
      .setCheck("Number")
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_FOOT", "foot ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RF")
      .setCheck("Number")
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_CALIBRATION_TOOLTIP",
    fallback:
      "Use small positive and negative values iteratively,change gradually until is completely straight (90º)",
  });
  return block;
}

function buildOttoEeprom() {
  const block = new BlockBuilder("otto_eeprom")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "eeprom"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Otto.saveTrimsOnEEPROM();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("💾 " + ottoLabel("OTTO9_EEPROM_TEXT", "save trims on EEPROM"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_EEPROM_COLOUR, {
    key: "OTTO9_EEPROM_TOOLTIP",
    fallback:
      "Use only after completely straight(90º) one time, delete this BLOCK after for further programming",
  });
  return block;
}

function buildOttoMoveLegs() {
  const block = new BlockBuilder("otto_movelegs")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pinYl =
        generator.valueToCode(b, "PIN_YL", generator.ORDER_ATOMIC) || "0";
      const pinYr =
        generator.valueToCode(b, "PIN_YR", generator.ORDER_ATOMIC) || "0";
      const pinRl =
        generator.valueToCode(b, "PIN_RL", generator.ORDER_ATOMIC) || "0";
      const pinRr =
        generator.valueToCode(b, "PIN_RR", generator.ORDER_ATOMIC) || "0";
      const tempo =
        generator.valueToCode(b, "TEMPO", generator.ORDER_ATOMIC) || "0";

      registerDefinition(
        generator,
        "otto_movelegs",
        "void Otto_moveLegs(int T, int posLegL, int posLegR, int posFootL, int posFootR) {   int posLegs[]={ posLegL,posLegR,posFootL,posFootR };   Otto._moveServos(T,posLegs); }",
        "Helper to move Otto leg servos to explicit positions."
      );
      registerSetup(
        generator,
        "otto_movelegs",
        "Otto_moveLegs(200,90,90,90,90);\n"
      );
      return `Otto_moveLegs(${tempo},${pinYl},${pinYr},${pinRl},${pinRr});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🦿 " + ottoLabel("OTTO9_MOVE_TEXT", "move"));
    this.appendValueInput("PIN_YL")
      .setCheck("Number")
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_LEG", "leg ") +
          ottoLabel("left", "left")
      );
    this.appendValueInput("PIN_YR")
      .setCheck("Number")
      .appendField(ottoLabel("right", "right"));
    this.appendValueInput("PIN_RL")
      .setCheck("Number")
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_FOOT", "foot ") +
          ottoLabel("left", "left")
      );
    this.appendValueInput("PIN_RR")
      .setCheck("Number")
      .appendField(ottoLabel("right", "right"));
    this.appendValueInput("TEMPO")
      .setCheck("Number")
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoMoveServos() {
  const block = new BlockBuilder("otto_moveservos")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const period =
        generator.valueToCode(b, "Period", generator.ORDER_ATOMIC) || "0";
      const pos =
        generator.valueToCode(b, "Pos", generator.ORDER_ATOMIC) || "0";
      return ` Otto._moveServos(${period}, ${pos});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🦿 " + ottoLabel("OTTO9_MOVE_TEXT", "move"));
    this.appendValueInput("Period")
      .setCheck("Number")
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"));
    this.appendValueInput("Pos")
      .setCheck("Number")
      .appendField("Positions");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoMove() {
  const block = new BlockBuilder("otto_move")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const direction = b.getFieldValue("otto_move_sens");
      const speed = b.getFieldValue("otto_move_speed");
      switch (direction) {
        case "FORWARD":
          return `Otto.walk(1,${speed},1); // FORWARD\n`;
        case "BACKWARD":
          return `Otto.walk(1,${speed},-1); // BACKWARD\n`;
        case "LEFT":
          return `Otto.turn(1,${speed},1); // LEFT\n`;
        case "RIGHT":
          return `Otto.turn(1,${speed},-1); // RIGHT\n`;
        case "BENDLEFT":
          return `Otto.bend(1,${speed},1);\n`;
        case "BENDRIGHT":
          return `Otto.bend(1,${speed},-1);\n`;
        case "SHAKERIGHT":
          return `Otto.shakeLeg(1,${speed},1);\n`;
        case "SHAKELEFT":
          return `Otto.shakeLeg(1,${speed},-1);\n`;
        case "jump":
          return `Otto.jump(1,${speed});\n`;
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_bend.png", "medium"))
      .appendField(ottoLabel("OTTO9_MOVE_TEXT", "move"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_MOVE_OPTIONS),
        "otto_move_sens"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_MOVE_SPEED_OPTIONS),
        "otto_move_speed"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_MOVE_TOOLTIP",
    fallback: "Otto basic movements",
  });
  return block;
}

function buildOttoDance() {
  const block = new BlockBuilder("otto_dance")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "dance"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const movement = b.getFieldValue("otto_dance_movement");
      const speed = b.getFieldValue("otto_move_speed");
      const size = b.getFieldValue("otto_dance_size");
      switch (movement) {
        case "moonwalkerLEFT":
          return `Otto.moonwalker(1, ${speed}, ${size}, 1);\n`;
        case "moonwalkerRIGHT":
          return `Otto.moonwalker(1, ${speed}, ${size}, -1);\n`;
        case "crusaitoLEFT":
          return `Otto.crusaito(1, ${speed}, ${size}, 1);\n`;
        case "crusaitoRIGHT":
          return `Otto.crusaito(1, ${speed}, ${size}, -1);\n`;
        case "flappingFRONT":
          return `Otto.flapping(1, ${speed}, ${size}, 1);\n`;
        case "flappingBACK":
          return `Otto.flapping(1, ${speed}, ${size}, -1);\n`;
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_moonwalk.png", "medium"))
      .appendField(ottoLabel("OTTO9_DANCE_TEXT", "dance"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_DANCE_OPTIONS),
        "otto_dance_movement"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_MOVE_SPEED_OPTIONS),
        "otto_move_speed"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_DANCE_SIZE_TEXT", "size"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_DANCE_SIZE_OPTIONS),
        "otto_dance_size"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_DANCE_TOOLTIP",
    fallback: "Otto dance!",
  });
  return block;
}

function buildOttoDo() {
  const block = new BlockBuilder("otto_do")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const movement = b.getFieldValue("otto_do_movement");
      const speed = b.getFieldValue("otto_move_speed");
      const size = b.getFieldValue("otto_dance_size");
      return `Otto.${movement}(1, ${speed}, ${size});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_do.png", "medium"))
      .appendField(ottoLabel("OTTO9_DO_TEXT", "do"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_DO_OPTIONS),
        "otto_do_movement"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_MOVE_SPEED_OPTIONS),
        "otto_move_speed"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_DANCE_SIZE_TEXT", "size"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_DANCE_SIZE_OPTIONS),
        "otto_dance_size"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_DO_TOOLTIP",
    fallback: "Otto complex movements",
  });
  return block;
}

function buildOttoGesture() {
  const block = new BlockBuilder("otto_gesture")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "gesture"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const gesture = b.getFieldValue("otto_gesture");
      return `Otto.playGesture(${gesture});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_emoji.png", "medium"))
      .appendField(ottoLabel("OTTO9_GESTURE_TEXT", "gesture"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_GESTURE_OPTIONS),
        "otto_gesture"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_GESTURE_TOOLTIP",
    fallback: "Emotional sounds combined with movements",
  });
  return block;
}

function buildOttoSound() {
  const block = new BlockBuilder("otto_sound")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "sound"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const sound = b.getFieldValue("otto_sound");
      return `Otto.sing(${sound});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_music.png", "medium"))
      .appendField(ottoLabel("OTTO9_SOUND_TEXT", "sound"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_SOUND_OPTIONS),
        "otto_sound"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_SOUND_COLOUR, {
    key: "OTTO9_SOUND_TOOLTIP",
    fallback: "Emotional sounds",
  });
  return block;
}

function buildOttoTone() {
  const block = new BlockBuilder("otto_tone")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "sound"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const note = b.getFieldValue("otto_note");
      const duration = b.getFieldValue("otto_note_duration");
      return `Otto._tone( ${note},${duration},1);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🎼")
      .appendField(
        new Blockly.FieldDropdown(OTTO_TONE_NOTE_OPTIONS),
        "otto_note"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(" ")
      .appendField(
        new Blockly.FieldDropdown(OTTO_TONE_DURATION_OPTIONS),
        "otto_note_duration"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_SOUND_COLOUR, {
    key: "OTTO9_SOUND_TOOLTIP",
    fallback: "Emotional sounds",
  });
  return block;
}

function buildOttoToneHz() {
  const block = new BlockBuilder("otto_tonehz")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "sound"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const hz =
        generator.valueToCode(b, "Hz1", generator.ORDER_ATOMIC) || "0";
      const duration =
        generator.valueToCode(b, "duration", generator.ORDER_ATOMIC) || "0";
      const silent =
        generator.valueToCode(b, "silent", generator.ORDER_ATOMIC) || "0";
      return `Otto._tone( ${hz},${duration},${silent}); //(float noteFrequency, long noteDuration, int silentDuration)\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput().appendField("🎼 Hz");
    this.appendValueInput("Hz1");
    this.appendValueInput("duration")
      .setCheck("Number")
      .appendField("⏰");
    this.appendValueInput("silent")
      .setCheck("Number")
      .appendField("🔇");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_SOUND_COLOUR, {
    key: "OTTO9_SOUND_TOOLTIP",
    fallback: "Emotional sounds",
  });
  return block;
}

function buildOttoBendTone() {
  const block = new BlockBuilder("otto_bendtone")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "sound"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const hz1 =
        generator.valueToCode(b, "Hz1", generator.ORDER_ATOMIC) || "0";
      const hz2 =
        generator.valueToCode(b, "Hz2", generator.ORDER_ATOMIC) || "0";
      const prop =
        generator.valueToCode(b, "prop", generator.ORDER_ATOMIC) || "0";
      const duration =
        generator.valueToCode(b, "duration", generator.ORDER_ATOMIC) || "0";
      const silent =
        generator.valueToCode(b, "silent", generator.ORDER_ATOMIC) || "0";
      return `Otto.bendTones( ${hz1},${hz2},${prop},${duration},${silent}); // (float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration) \n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput().appendField("🎼 Hz1");
    this.appendValueInput("Hz1");
    this.appendValueInput("Hz2").appendField("Hz2");
    this.appendValueInput("prop")
      .setCheck("Number")
      .appendField("P");
    this.appendValueInput("duration")
      .setCheck("Number")
      .appendField("⏰");
    this.appendValueInput("silent")
      .setCheck("Number")
      .appendField("🔇");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_SOUND_COLOUR, {
    key: "OTTO9_SOUND_TOOLTIP",
    fallback: "Emotional sounds",
  });
  return block;
}

function buildOttoGetSensor() {
  const block = new BlockBuilder("otto_getsensor")
    .setCategory(BIPED_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "biped", "sensor"])
    .setOutput("Number")
    .setArduinoGenerator((_b, generator) => {
      registerGlobalVariable(
        generator,
        "otto_sensor",
        "bool estado = false;",
        "Otto noise sensor state flag (legacy)."
      );
      return ["Otto.getSensor()", generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_noise.png", "medium"))
      .appendField(ottoLabel("OTTO9_GETNOISE_TEXT", "noise measured"));
    this.setInputsInline(true);
    this.setOutput(true, "Number");
  };
  wrapOttoBlock(block, OTTO_SENSOR_COLOUR, {
    key: "OTTO9_GETNOISE_TOOLTIP",
    fallback:
      "Pin A6, 100 is quiet, 500 noise and more than 1000 is loud, also adjust the sensor trimpot sensibility",
  });
  return block;
}

export const ottoConfigurationBlock = buildOttoConfiguration();
export const ottoHomeBlock = buildOttoHome();
export const ottoCalibrationBlock = buildOttoCalibration();
export const ottoEepromBlock = buildOttoEeprom();
export const ottoMoveLegsBlock = buildOttoMoveLegs();
export const ottoMoveServosBlock = buildOttoMoveServos();
export const ottoMoveBlock = buildOttoMove();
export const ottoDanceBlock = buildOttoDance();
export const ottoDoBlock = buildOttoDo();
export const ottoGestureBlock = buildOttoGesture();
export const ottoSoundBlock = buildOttoSound();
export const ottoToneBlock = buildOttoTone();
export const ottoToneHzBlock = buildOttoToneHz();
export const ottoBendToneBlock = buildOttoBendTone();
export const ottoGetSensorBlock = buildOttoGetSensor();

export const BIPED_BLOCKS: BlockDefinition[] = [
  ottoConfigurationBlock,
  ottoHomeBlock,
  ottoCalibrationBlock,
  ottoEepromBlock,
  ottoMoveLegsBlock,
  ottoMoveServosBlock,
  ottoMoveBlock,
  ottoDanceBlock,
  ottoDoBlock,
  ottoGestureBlock,
  ottoSoundBlock,
  ottoToneBlock,
  ottoToneHzBlock,
  ottoBendToneBlock,
  ottoGetSensorBlock,
];
