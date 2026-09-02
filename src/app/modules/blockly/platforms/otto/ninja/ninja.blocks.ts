import * as Blockly from "blockly";
import { getAllPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { createBlockIconField } from "../../../lib/helpers/block-icon.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CAT_ROBOT_OTTO_NINJA,
  CATEGORY_PLATFORMS,
  NINJA_COLOUR,
  TOOLBOX_LEVEL,
} from "../config";
import {
  buildNinjaCalibrationDefinitions,
  buildNinjaInitDefinitions,
  NINJA_HOME_DEFINITION,
  NINJA_ROLL_DEFINITIONS,
  NINJA_ROLLSTOP_DEFINITION,
  NINJA_SETROLL_DEFINITION,
  NINJA_SETWALK_DEFINITION,
  NINJA_WALK_DEFINITIONS,
  NINJA_WALKSTOP_DEFINITION,
  OTTO9_APP_DEFINITIONS,
  OTTO9_APP_INCLUDES,
  OTTO9_APP_LOOP_CODE,
  OTTO9_APP_SETUP,
  OTTO9_APP_VARIABLES,
  OTTO9_SMOOTH_DEFINITIONS,
  OTTO9_SMOOTH_INCLUDES,
  OTTO9_SMOOTH_LOOP_CODE,
  OTTO9_SMOOTH_SETUP,
  OTTO9_SMOOTH_VARIABLES,
  OTTO_NINJA_APP_DEFINITIONS,
  OTTO_NINJA_APP_INCLUDES,
  OTTO_NINJA_APP_LOOP_CODE,
  OTTO_NINJA_APP_SETUP,
  OTTO_NINJA_APP_VARIABLES,
} from "./ninja-app.codegen";

function msg(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

function createPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

function walkDirectionOptions(): [string, string][] {
  return [
    [msg("AV", "forward"), "F"],
    [msg("AR", "backward"), "B"],
    [msg("right", "right"), "R"],
    [msg("left", "left"), "L"],
  ];
}

function applyNinjaColour(block: BlockDefinition): void {
  block.init = function (this: Blockly.Block) {
    ninjaBlockInits.get(block.type)?.call(this);
    this.setColour(NINJA_COLOUR);
  };
}

const ninjaBlockInits = new Map<string, (this: Blockly.Block) => void>();

function buildOttoNinjaInit() {
  const block = new BlockBuilder("otto_ninja_init")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      generator.includes_["otto_lib"] = "#include <Servo.h>\n";
      generator.definitions_["otto_legs"] = buildNinjaInitDefinitions(
        b.getFieldValue("PIN_LL"),
        b.getFieldValue("PIN_RL"),
        b.getFieldValue("PIN_LF"),
        b.getFieldValue("PIN_RF"),
        b.getFieldValue("PIN_LA"),
        b.getFieldValue("PIN_RA"),
        b.getFieldValue("PIN_H")
      );
      return "";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_ninja.png"))
      .appendField(msg("OTTO_HOME_TEXT", "⚙️") + msg("OTTO_NINJA_TEXT", "ninja"));
    this.appendDummyInput()
      .appendField(msg("OTTO9_CALIBRATION_LEG", "leg ") + msg("left", "left"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_LL")
      .appendField(msg("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_RL")
      .appendField(msg("OTTO9_CALIBRATION_FOOT", "foot ") + msg("left", "left"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_LF")
      .appendField(msg("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_RF");
    this.appendDummyInput()
      .appendField(msg("OTTO9_ARMS_TEXT", "arms ") + msg("left", "left"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_LA")
      .appendField(msg("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_RA")
      .appendField(msg("OTTO_HEAD_TEXT", "head "))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN_H");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaCalibration() {
  const block = new BlockBuilder("otto_ninja_calibration")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "calibration"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const valuela =
        generator.valueToCode(b, "LA0", generator.ORDER_ATOMIC) || "0";
      const valuera =
        generator.valueToCode(b, "RA0", generator.ORDER_ATOMIC) || "0";
      const valuerlatl =
        generator.valueToCode(b, "LATL", generator.ORDER_ATOMIC) || "0";
      const valuerratl =
        generator.valueToCode(b, "RATL", generator.ORDER_ATOMIC) || "0";
      const valuerlatr =
        generator.valueToCode(b, "LATR", generator.ORDER_ATOMIC) || "0";
      const valuerratr =
        generator.valueToCode(b, "RATR", generator.ORDER_ATOMIC) || "0";
      generator.definitions_["ninja_calibration"] =
        buildNinjaCalibrationDefinitions(
          valuela,
          valuera,
          valuerlatl,
          valuerratl,
          valuerlatr,
          valuerratr
        );
      return "";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendValueInput("LA0")
      .setCheck("Number")
      .appendField("🐱‍👤 " + msg("OTTO9_CALIBRATION", "calibrate ") + "° LLS")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RA0")
      .setCheck("Number")
      .appendField("RLS")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("LATL")
      .setCheck("Number")
      .appendField("LLL")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RATL")
      .setCheck("Number")
      .appendField("RLL")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("LATR")
      .setCheck("Number")
      .appendField("LLR")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RATR")
      .setCheck("Number")
      .appendField("RLR")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Ninja Leg servo calibration.            " +
        "LLS: Left Leg standing position (0 default += adjust tilt left -= adjust tilt right)" +
        "RLS: Right Leg standing position (0 default += adjust tilt left -= adjust tilt right)" +
        "LLL: Left Leg tilt left position (40 default += adjust tilt left -= adjust tilt right)" +
        "RLL: Right Leg tilt left position (60 default += adjust tilt left -= adjust tilt right)" +
        "LLR: Left Leg tilt right position (60 default += adjust tilt left -= adjust tilt right)" +
        "RLR: Right Leg tilt right position (40 default += adjust tilt left -= adjust tilt right)"
    );
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
    attachShadowBlock(this, "LA0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "RA0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "LATL", "math_number", { NUM: 40 });
    attachShadowBlock(this, "RATL", "math_number", { NUM: 60 });
    attachShadowBlock(this, "LATR", "math_number", { NUM: 60 });
    attachShadowBlock(this, "RATR", "math_number", { NUM: 40 });
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaSpeed() {
  const block = new BlockBuilder("otto_ninja_speed")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "speed"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const valuellf =
        generator.valueToCode(b, "LFFWRS", generator.ORDER_ATOMIC) || "0";
      const valuerff =
        generator.valueToCode(b, "RFFWRS", generator.ORDER_ATOMIC) || "0";
      const valuelfb =
        generator.valueToCode(b, "LFBWRS", generator.ORDER_ATOMIC) || "0";
      const valuerfb =
        generator.valueToCode(b, "RFBWRS", generator.ORDER_ATOMIC) || "0";
      generator.definitions_["otto_ninja_speed"] =
        "int LFFWRS=" +
        valuellf +
        "; // Left foot forward walking rotation Speed; 0 = Slowest  90 = Fastest    Default = 20\n" +
        "int RFFWRS=" +
        valuerff +
        " ; // Right foot forward walking rotation Speed; 0 = Slowest  90 = Fastest    Default = 20\n" +
        "int LFBWRS= " +
        valuelfb +
        "; // Left foot Backward walking rotation Speed; 0 = Slowest  90 = Fastest    Default = 20\n" +
        "int RFBWRS= " +
        valuerfb +
        "; // Right foot Backward walking rotation Speed; 0 = Slowest  90 = Fastest    Default = 20\n";
      return "";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendValueInput("LFFWRS")
      .setCheck("Number")
      .appendField(
        "🐱‍👤 " +
          msg("OTTO9_CALIBRATION", "calibrate ") +
          msg("OTTO9_MOVE_SPEED_TEXT", "speed") +
          "  FL"
      )
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RFFWRS")
      .setCheck("Number")
      .appendField("FR")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("LFBWRS")
      .setCheck("Number")
      .appendField("BL")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("RFBWRS")
      .setCheck("Number")
      .appendField("BR")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "FL= Formward Left" +
        "FR= Formward Right" +
        "BL= Backward Left" +
        "BR= Backward Right"
    );
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
    attachShadowBlock(this, "LFFWRS", "math_number", { NUM: 12 });
    attachShadowBlock(this, "RFFWRS", "math_number", { NUM: 12 });
    attachShadowBlock(this, "LFBWRS", "math_number", { NUM: 12 });
    attachShadowBlock(this, "RFBWRS", "math_number", { NUM: 12 });
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaHome() {
  const block = new BlockBuilder("otto_ninja_home")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "home"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.definitions_["ninja_home"] = NINJA_HOME_DEFINITION;
      return "NinjaHome();\n";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput().appendField(
      "🐱‍👤 " + msg("OTTO9_HOME_TEXT", "home")
    );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(msg("OTTO9_HOME_TOOLTIP", "Otto goes to home position straight"));
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaSetWalk() {
  const block = new BlockBuilder("otto_ninja_setwalk")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "walk"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.definitions_["ninja_setwalk"] = NINJA_SETWALK_DEFINITION;
      return "NinjaSetWalk();\n";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput().appendField(
      "🐱‍👤 " +
        msg("OTTO_WALK_TEXT", "walk") +
        msg("OTTO_MODE_TEXT", " mode")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaSetRoll() {
  const block = new BlockBuilder("otto_ninja_setroll")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "roll"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.definitions_["ninja_setroll"] = NINJA_SETROLL_DEFINITION;
      return "NinjaSetRoll();\n";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput().appendField(
      "🐱‍👤 " +
        msg("OTTO_ROLL_TEXT", "roll") +
        msg("OTTO_MODE_TEXT", " mode")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaWalkStop() {
  const block = new BlockBuilder("otto_ninja_walkstop")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "walk"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.definitions_["ninja_walkstop"] = NINJA_WALKSTOP_DEFINITION;
      return "NinjaWalkStop();\n";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput().appendField(
      "🐱‍👤 " +
        msg("OTTO_WALK_TEXT", "walk") +
        msg("moteurstop", "🛑 stop")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaRollStop() {
  const block = new BlockBuilder("otto_ninja_rollstop")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "roll"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.definitions_["ninja_rollstop"] = NINJA_ROLLSTOP_DEFINITION;
      return "NinjaRollStop();\n";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput().appendField(
      "🐱‍👤 " +
        msg("OTTO_ROLL_TEXT", "roll") +
        msg("moteurstop", "🛑 stop")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaWalk() {
  const block = new BlockBuilder("otto_ninja_walk")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "walk"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const walk = b.getFieldValue("Walk");
      generator.definitions_["ninja_walk"] = NINJA_WALK_DEFINITIONS;
      switch (walk) {
        case "F":
          return "NinjaWalkForward(); \n";
        case "B":
          return "NinjaWalkBackward(); \n";
        case "L":
          return "NinjaWalkLeft(); \n";
        case "R":
          return "NinjaWalkRight();\n";
        default:
          return "";
      }
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🐱‍👤" + msg("OTTO_WALK_TEXT", "walk"))
      .appendField(new Blockly.FieldDropdown(walkDirectionOptions()), "Walk");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaRoll() {
  const block = new BlockBuilder("otto_ninja_roll")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "roll"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const roll = b.getFieldValue("Roll");
      generator.definitions_["ninja_roll"] = NINJA_ROLL_DEFINITIONS;
      let speed =
        generator.valueToCode(b, "SPEED", generator.ORDER_ATOMIC) || "100";
      speed = "map(" + speed + ", 0, 100, 0, 90)";
      switch (roll) {
        case "F":
          return "NinjaRollForward(" + speed + ");\n";
        case "B":
          return "NinjaRollBackward(" + speed + ");\n";
        case "L":
          return "NinjaRollLeft(" + speed + ");\n";
        case "R":
          return "NinjaRollRight(" + speed + ");\n";
        default:
          return "";
      }
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🐱‍👤 " + msg("OTTO_ROLL_TEXT", "roll"))
      .appendField(new Blockly.FieldDropdown(walkDirectionOptions()), "Roll");
    this.appendValueInput("SPEED")
      .appendField("with power (1-100)%")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.ottodiy.com/ninja");
    attachShadowBlock(this, "SPEED", "math_number", { NUM: 100 });
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaWifi() {
  const block = new BlockBuilder("otto_ninja_wifi")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "wifi"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const ssid = b.getFieldValue("SSID");
      const wifipassword = b.getFieldValue("PASSWORD");
      generator.includes_["include_wifi"] =
        '#include "ESP8266WiFi.h"\n' + "#define REMOTEXY_SERVER_PORT 6377 \n";
      generator.definitions_["define_wifi_ninja"] =
        '#define REMOTEXY_WIFI_SSID "' +
        ssid +
        '"\n' +
        '#define REMOTEXY_WIFI_PASSWORD "' +
        wifipassword +
        '"\n';
      return "";
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "medium"))
      .appendField(msg("WIFI_ssid", "Wifi ssid:"))
      .appendField(new Blockly.FieldTextInput("MyOttoNinja"), "SSID")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendDummyInput()
      .appendField(msg("WIFI_password", "password:"))
      .appendField(new Blockly.FieldTextInput("12345678"), "PASSWORD")
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init Wifi for Otto Ninja App");
    this.setHelpUrl("");
  });
  applyNinjaColour(block);
  return block;
}

function buildOttoNinjaApp() {
  const block = new BlockBuilder("otto_ninja_app")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "ninja", "wifi", "app"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.includes_["otto_ninja_app"] = OTTO_NINJA_APP_INCLUDES;
      generator.variables_["otto_ninja_app"] = OTTO_NINJA_APP_VARIABLES;
      generator.definitions_["otto_ninja_app"] = OTTO_NINJA_APP_DEFINITIONS;
      generator.setups_["otto_ninja_app"] = OTTO_NINJA_APP_SETUP;
      return OTTO_NINJA_APP_LOOP_CODE;
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "medium"))
      .appendField("🐱‍👤 WiFi App code");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Use alone with wifi, pins and calibration blocks");
    this.setHelpUrl("https://www.ottodiy.com/ninja");
  });
  applyNinjaColour(block);
  return block;
}

function buildOtto9App() {
  const block = new BlockBuilder("otto9_app")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "app", "bluetooth"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.includes_["otto9_lib"] = OTTO9_APP_INCLUDES;
      generator.variables_["otto9_var"] = OTTO9_APP_VARIABLES;
      generator.definitions_["otto9_legs"] = OTTO9_APP_DEFINITIONS;
      generator.setups_["otto9_init"] = OTTO9_APP_SETUP;
      return OTTO9_APP_LOOP_CODE;
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("bt.png"))
      .appendField("App code");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(msg("OTTO9_DANCE_TOOLTIP", "Otto dance!"));
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
  });
  applyNinjaColour(block);
  return block;
}

function buildOtto9Smooth() {
  const block = new BlockBuilder("otto9_smooth")
    .setCategory(CAT_ROBOT_OTTO_NINJA)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "dance", "smooth"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      generator.includes_["otto9_lib"] = OTTO9_SMOOTH_INCLUDES;
      generator.variables_["otto9_var"] = OTTO9_SMOOTH_VARIABLES;
      generator.definitions_["otto9_legs"] = OTTO9_SMOOTH_DEFINITIONS;
      generator.setups_["otto9_init"] = OTTO9_SMOOTH_SETUP;
      return OTTO9_SMOOTH_LOOP_CODE;
    })
    .build();

  ninjaBlockInits.set(block.type, function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("smooth.png"))
      .appendField("Dance smooth criminal");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(msg("OTTO9_DANCE_TOOLTIP", "Otto dance!"));
    this.setHelpUrl(msg("OTTO9_DIY_URL", "https://www.ottodiy.com"));
  });
  applyNinjaColour(block);
  return block;
}

export const NINJA_BLOCKS: BlockDefinition[] = [
  buildOttoNinjaInit(),
  buildOttoNinjaCalibration(),
  buildOttoNinjaSpeed(),
  buildOttoNinjaHome(),
  buildOttoNinjaSetWalk(),
  buildOttoNinjaSetRoll(),
  buildOttoNinjaWalkStop(),
  buildOttoNinjaRollStop(),
  buildOttoNinjaWalk(),
  buildOttoNinjaRoll(),
  buildOttoNinjaWifi(),
  buildOttoNinjaApp(),
  buildOtto9App(),
  buildOtto9Smooth(),
];
