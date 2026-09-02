import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_PLATFORMS,
  OTTO_MOVEMENT_COLOUR,
  OTTO_WHEELS_MOVE_OPTIONS,
  OTTO_WHEELS_SPEED_OPTIONS,
  TOOLBOX_LEVEL,
  WHEELS_CATEGORY,
} from "../config";
import {
  createBlockIconField,
  createOttoPinDropdown,
  ottoLabel,
  registerSetup,
  wrapOttoBlock,
} from "../otto.helper";

function buildServo2WheelsInit() {
  const block = new BlockBuilder("servo_2wheels_init")
    .setCategory(WHEELS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "wheels", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pinL = b.getFieldValue("PINL");
      const pinR = b.getFieldValue("PINR");

      registerInclude(
        generator,
        "Servo.h",
        "Servo library for Otto wheels."
      );
      registerInclude(
        generator,
        "math.h",
        "Math library for Otto wheel control."
      );
      registerGlobalVariable(
        generator,
        "otto9_wheels",
        "Servo rightServo;\n" + "Servo leftServo;",
        "Otto wheel servo instances."
      );
      registerDefinition(
        generator,
        "otto9_wheels",
        "int rightSpeed = 0;\n" +
          "int leftSpeed = 0;\n" +
          "void motorControl(int rightSpeed, int leftSpeed, int stepDelay) {\n" +
          "rightServo.write(90 + rightSpeed);  leftServo.write(90 - leftSpeed);\n" +
          "delay(stepDelay*1000);rightServo.write(90);leftServo.write(90);}",
        "Otto wheel speed variables and motorControl helper."
      );
      registerSetup(
        generator,
        "otto9_initw",
        "rightServo.write(90);\n" +
          "leftServo.write(90);\n" +
          "delay(1000);\n" +
          `leftServo.attach(${pinL});\n` +
          `rightServo.attach(${pinR});\n`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_wheels.png"))
      .appendField(
        ottoLabel("OTTO_HOME_TEXT", "⚙️") +
          ottoLabel("OTTO_WHEELS_TEXT", "wheels")
      );
    this.appendDummyInput()
      .appendField(ottoLabel("left", "left"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PINL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "PINR");
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

function buildServo2Wheels() {
  const block = new BlockBuilder("servo_2wheels")
    .setCategory(WHEELS_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "wheels", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const direction = b.getFieldValue("otto_move_sens");
      const speed = b.getFieldValue("otto_move_speed");
      const time = b.getFieldValue("time");
      switch (direction) {
        case "FORWARD":
          return `motorControl (${-1 * Number(speed)}, ${Number(speed) * -1}, ${time} );\n`;
        case "BACKWARD":
          return `motorControl (${speed}, ${speed}, ${time} );\n`;
        case "LEFT":
          return `motorControl (${Number(speed) * -1}, ${speed}, ${time} );\n`;
        case "RIGHT":
          return `motorControl (${speed}, ${-1 * Number(speed)}, ${time} );\n`;
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("💿 " + ottoLabel("OTTO_WHEELS_TEXT", "wheels"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(
        new Blockly.FieldDropdown(OTTO_WHEELS_MOVE_OPTIONS),
        "otto_move_sens"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("OTTO9_MOVE_SPEED_TEXT", "speed"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_WHEELS_SPEED_OPTIONS),
        "otto_move_speed"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ottoLabel("m_pap_step", "step"))
      .appendField(new Blockly.FieldNumber("1"), "time");
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

export const servo2WheelsInitBlock = buildServo2WheelsInit();
export const servo2WheelsBlock = buildServo2Wheels();

export const WHEELS_BLOCKS: BlockDefinition[] = [
  servo2WheelsInitBlock,
  servo2WheelsBlock,
];
