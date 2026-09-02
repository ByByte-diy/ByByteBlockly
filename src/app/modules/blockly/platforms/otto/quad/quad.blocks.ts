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
  OTTO_MOVE_OPTIONS,
  OTTO_MOVE_SPEED_OPTIONS,
  OTTO_MOVEMENT_COLOUR,
  QUAD_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createOttoPinDropdown,
  ottoLabel,
  registerSetup,
  wrapOttoBlock,
} from "../otto.helper";

function buildOttoQuadConfiguration() {
  const block = new BlockBuilder("otto_quad_configuration")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const flh = b.getFieldValue("FLH");
      const frh = b.getFieldValue("FRH");
      const fll = b.getFieldValue("FLL");
      const frl = b.getFieldValue("FRL");
      const blh = b.getFieldValue("BLH");
      const brh = b.getFieldValue("BRH");
      const bll = b.getFieldValue("BLL");
      const brl = b.getFieldValue("BRL");

      registerInclude(generator, "Quad.h", "Otto Quad robot library.");
      registerGlobalVariable(
        generator,
        "otto_lib",
        "Quad Quad;",
        "Otto Quad robot instance."
      );
      registerDefinition(
        generator,
        "otto_legs",
        `#define FRH ${frh} // FRONT_RIGHT_HIP pin, servo[0]\n` +
          `#define FLH ${flh} // FRONT_LEFT_HIP pin, servo[1]\n` +
          `#define FRL ${frl} // FRONT_RIGHT_LEG pin, servo[2]\n` +
          `#define FLL ${fll} // FRONT_LEFT_LEG pin, servo[3]\n` +
          `#define BLH ${blh} // BACK_RIGHT_HIP pin, servo[4]\n` +
          `#define BRH ${brh} // BACK_LEFT_HIP pin, servo[5]\n` +
          `#define BRL ${brl} // BACK_RIGHT_LEG pin, servo[6]\n` +
          `#define BLL ${bll} // BACK_LEFT_LEG pin, servo[7]\n` +
          "void pause(int period) { long timeout = millis() + period;  do   {  Quad.refresh(); } \n" +
          " while (millis() <= timeout); }",
        "Otto Quad servo pin definitions and pause helper."
      );
      registerSetup(
        generator,
        "otto_init",
        "Quad.init(FRH, FLH, FRL, FLL, BLH, BRH, BRL, BLL);\n" +
          "Quad.home();\n"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField(createBlockIconField("otto_quad.png"))
      .appendField(ottoLabel("OTTO_HOME_TEXT", "⚙️"));
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO_FRONT_TEXT", "front ") +
          ottoLabel("OTTO_HIP_TEXT", "hip ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "FLH");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "FRH");
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_LEG", "leg ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "FLL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "FRL");
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO_BACK_TEXT", "back ") +
          ottoLabel("OTTO_HIP_TEXT", "hip ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "BLH");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "BRH");
    this.appendDummyInput()
      .appendField(
        ottoLabel("OTTO9_CALIBRATION_LEG", "leg ") +
          ottoLabel("left", "left")
      )
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "BLL");
    this.appendDummyInput()
      .appendField(ottoLabel("right", "right"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createOttoPinDropdown(), "BRL");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoQuadHome() {
  const block = new BlockBuilder("otto_quad_home")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Quad.home();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🕷️ " + ottoLabel("OTTO9_HOME_TEXT", "home"));
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

function buildOttoQuadHello() {
  const block = new BlockBuilder("otto_quad_hello")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Quad.hello();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🕷️ " + ottoLabel("OTTO_HELLO_TEXT", "hello"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoQuadJump() {
  const block = new BlockBuilder("otto_quad_jump")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Quad.jump();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🕷️ " + ottoLabel("OTTO_JUMP_TEXT", "jump"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoQuadScared() {
  const block = new BlockBuilder("otto_quad_scared")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator(() => "Quad.scared();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🕷️ " + ottoLabel("OTTO_SCARED_TEXT", "scared"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  wrapOttoBlock(block, OTTO_MOVEMENT_COLOUR);
  return block;
}

function buildOttoQuadMove() {
  const block = new BlockBuilder("otto_quad_move")
    .setCategory(QUAD_CATEGORY)
    .setColor(20)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["otto", "quad", "move"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const direction = b.getFieldValue("otto_move_sens");
      const speed = b.getFieldValue("otto_move_speed");
      switch (direction) {
        case "FORWARD":
          return `Quad.walk(1,4,${speed}); // FORWARD\n`;
        case "BACKWARD":
          return `Quad.walk(0,4,${speed}); // BACKWARD\n`;
        case "LEFT":
          return `Quad.turnL(2,${speed}); // LEFT\n`;
        case "RIGHT":
          return `Quad.turnR(2,${speed}); // RIGHT\n`;
        case "BENDLEFT":
          return `Quad.pushUp(1,${speed});\n`;
        case "BENDRIGHT":
          return `Quad.frontBack(1,${speed});\n`;
        case "SHAKERIGHT":
          return `Quad.waveHAND(1,${speed});\n`;
        case "SHAKELEFT":
          return `Quad.dance(1,${speed});\n`;
        case "jump":
          return `Quad.upDown(1,${speed});\n`;
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField("🕷️ " + ottoLabel("OTTO9_MOVE_TEXT", "move"))
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

export const ottoQuadConfigurationBlock = buildOttoQuadConfiguration();
export const ottoQuadHomeBlock = buildOttoQuadHome();
export const ottoQuadHelloBlock = buildOttoQuadHello();
export const ottoQuadJumpBlock = buildOttoQuadJump();
export const ottoQuadScaredBlock = buildOttoQuadScared();
export const ottoQuadMoveBlock = buildOttoQuadMove();

export const QUAD_BLOCKS: BlockDefinition[] = [
  ottoQuadConfigurationBlock,
  ottoQuadHomeBlock,
  ottoQuadHelloBlock,
  ottoQuadJumpBlock,
  ottoQuadScaredBlock,
  ottoQuadMoveBlock,
];
