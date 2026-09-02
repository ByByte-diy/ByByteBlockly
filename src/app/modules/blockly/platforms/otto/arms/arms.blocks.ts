import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  ARMS_CATEGORY,
  CATEGORY_PLATFORMS,
  OTTO_ARMS_OPTIONS,
  OTTO_MOVEMENT_COLOUR,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createOttoDigitalPinDropdown,
  createOttoPinDropdown,
  ottoLabel,
  registerSetup,
  wrapOttoBlock,
} from "../otto.helper";

function buildOttoI2cConfig() {
  const block = new BlockBuilder("otto_i2cConfig")
    .setCategory(ARMS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "arms", "i2c", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pinSda = b.getFieldValue("PIN_SDA");
      const pinScl = b.getFieldValue("PIN_SCL");

      registerInclude(generator, "Wire.h", "I²C Wire library.");
      registerDefinition(
        generator,
        "otto_i2cConfig_def",
        `#define PIN_SDA ${pinSda}\n` + `#define PIN_SCL ${pinScl}\n`,
        "Otto I²C SDA/SCL pin definitions."
      );
      registerSetup(
        generator,
        "otto_i2cConfig_begin",
        "Wire.begin(PIN_SDA, PIN_SCL);"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_bend.png"))
      .appendField(ottoLabel("OTTO_HOME_TEXT", "⚙️"))
      .appendField("I²C");
    this.appendDummyInput()
      .appendField("SDA")
      .appendField(createOttoDigitalPinDropdown(), "PIN_SDA");
    this.appendDummyInput()
      .appendField("SCL")
      .appendField(createOttoDigitalPinDropdown(), "PIN_SCL");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoArmsInit() {
  const block = new BlockBuilder("otto_arms_init")
    .setCategory(ARMS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "arms", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pinAl = b.getFieldValue("PIN_AL");
      const pinAr = b.getFieldValue("PIN_AR");

      registerInclude(
        generator,
        "Servo.h",
        "Servo library for Otto arms."
      );
      registerGlobalVariable(
        generator,
        "otto_arms",
        "Servo AL, AR;",
        "Otto arm servo instances."
      );
      registerGlobalVariable(
        generator,
        "otto_arms_vars",
        "int adj[]={ 0, 0,};\n" +
          "int pos[]={ 90,90}; \n" +
          "int shift = 60; \n" +
          "int shift_inc = 10;  \n" +
          "int shift_delay = 50;  \n",
        "Otto arms calibration and wave timing variables."
      );
      registerDefinition(
        generator,
        "otto_arms",
        `#define PIN_AL ${pinAl} // left arm\n` +
          `#define PIN_AR ${pinAr} // right arm \n` +
          "void move_servo(){ AL.write(pos[1]+adj[1]); AR.write(pos[2]+adj[2]);}",
        "Otto arm pin definitions and helper."
      );
      registerSetup(
        generator,
        "otto_arms",
        "AL.attach(PIN_AR);\n" +
          "AR.attach(PIN_AL);\n" +
          "move_servo();\n" +
          "delay(100);"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("humanoid_arms.png"))
      .appendField(
        ottoLabel("OTTO_HOME_TEXT", "⚙️") +
          ottoLabel("OTTO9_ARMS_TEXT", "arms ")
      );
    this.appendDummyInput()
      .appendField(ottoLabel("left", "left"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_AL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PIN_AR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoArms() {
  const block = new BlockBuilder("otto_arms")
    .setCategory(ARMS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "arms"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const choice = b.getFieldValue("otto_arms_choice");
      switch (choice) {
        case "HANDSUP":
          return (
            "AL.write(160);\n" +
            "AR.write(20);\n" +
            "delay(shift_delay);"
          );
        case "HANDSDOWN":
          return (
            "AL.write(20);\n" +
            "AR.write(160);\n" +
            "delay(shift_delay);"
          );
        case "HANDWAVE1":
          return (
            "for(int angle=90; angle<90+shift; angle+=shift_inc){  pos[1] = angle;    move_servo();  delay(shift_delay);}\n" +
            "for(int angle=90+shift; angle>90-shift; angle-=shift_inc) { pos[1] = angle;  move_servo(); delay(shift_delay); }\n" +
            "for(int angle=90-shift; angle<90; angle+=shift_inc) {pos[1] = angle;  move_servo();   delay(shift_delay); }\n"
          );
        case "HANDWAVE2":
          return (
            "for(int angle=90; angle<90+shift; angle+=shift_inc){  pos[2] = angle;    move_servo();  delay(shift_delay);}\n" +
            "for(int angle=90+shift; angle>90-shift; angle-=shift_inc) { pos[2] = angle;  move_servo(); delay(shift_delay); }\n" +
            "for(int angle=90-shift; angle<90; angle+=shift_inc) {pos[2] = angle;  move_servo();   delay(shift_delay); }\n"
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🦾 " + ottoLabel("OTTO9_ARMS_TEXT", "arms "))
      .appendField(
        new Blockly.FieldDropdown(OTTO_ARMS_OPTIONS),
        "otto_arms_choice"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR, {
    key: "OTTO9_ARMS_TOOLTIP",
    fallback: "Otto arm gestures",
  });
  return block;
}

function buildOttoArmsHome() {
  const block = new BlockBuilder("otto_arms_home")
    .setCategory(ARMS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "arms"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(
      () => "AL.write(90);\n" + "AR.write(90);\n" + "delay(shift_delay);"
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🦾 " + ottoLabel("OTTO9_HOME_TEXT", "home"));
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

export const ottoI2cConfigBlock = buildOttoI2cConfig();
export const ottoArmsInitBlock = buildOttoArmsInit();
export const ottoArmsBlock = buildOttoArms();
export const ottoArmsHomeBlock = buildOttoArmsHome();

export const ARMS_BLOCKS: BlockDefinition[] = [
  ottoI2cConfigBlock,
  ottoArmsInitBlock,
  ottoArmsBlock,
  ottoArmsHomeBlock,
];
