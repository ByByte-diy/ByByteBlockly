import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DC_CATEGORY,
  MRT_CONNECTOR_OPTIONS,
  MRT_DIRECTION_OPTIONS,
  MRT_NODE_CONNECTOR_OPTIONS,
  MRT_NODE_DIRECTION_OPTIONS,
  MRTDUINO_BOARD_IDS,
  MRTNODE_BOARD_IDS,
  MRTX_BOARD_IDS,
  ADVANCED_MOTOR_LEVEL,
} from "../config";
import { createBlockIconField, motorLabel } from "../motors.helper";

function buildMrtMotorRun() {
  const block = new BlockBuilder("motor_run")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTDUINO_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrt"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Run MRT motor on MRTduino board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      const direction = b.getFieldValue("MOTOR_DIR");
      const speed =
        generator.valueToCode(b, "CONTENT", generator.ORDER_ATOMIC) || "0";
      registerInclude(generator, "SoftPWM.h", "SoftPWM library — MRTduino motor PWM.");

      switch (connector) {
        case "ML1":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(7,OUTPUT);\n" +
            `pinMode(3,OUTPUT);\ndigitalWrite(3,${direction});\n` +
            `SoftPWMSet(7,${speed});\n`
          );
        case "ML2":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(8,OUTPUT);\n" +
            `pinMode(1,OUTPUT);\ndigitalWrite(1,${direction});\n` +
            `SoftPWMSet(8,${speed});\n`
          );
        case "MR1":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(4,OUTPUT);\n" +
            `pinMode(2,OUTPUT);\ndigitalWrite(2,${direction});\n` +
            `SoftPWMSet(4,${speed});\n`
          );
        case "MR2":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(6,OUTPUT);\n" +
            `pinMode(0,OUTPUT);\ndigitalWrite(0,${direction});\n` +
            `SoftPWMSet(6,${speed});\n`
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_Connector", "motor"))
      .appendField(new Blockly.FieldDropdown(MRT_CONNECTOR_OPTIONS), "MOTOR_CON");
    this.appendDummyInput()
      .appendField(motorLabel("MOTOR_Direction", "direction"))
      .appendField(new Blockly.FieldDropdown(MRT_DIRECTION_OPTIONS), "MOTOR_DIR");
    this.appendValueInput("CONTENT")
      .setCheck("Number")
      .appendField(motorLabel("MOTOR_speed", "speed(0-255)"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Run the MRT motor on MRTduino board");
  };
  return block;
}

function buildMrtMotorStop() {
  const block = new BlockBuilder("motor_stop")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTDUINO_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrt"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Stop MRT motor on MRTduino board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      registerInclude(generator, "SoftPWM.h", "SoftPWM library — MRTduino motor PWM.");

      switch (connector) {
        case "ML1":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(7,OUTPUT);\n" +
            "pinMode(3,OUTPUT);\ndigitalWrite(3,LOW);\nSoftPWMSet(7,0);\n"
          );
        case "ML2":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(8,OUTPUT);\n" +
            "pinMode(1,OUTPUT);\ndigitalWrite(1,LOW);\nSoftPWMSet(8,0);\n"
          );
        case "MR1":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(4,OUTPUT);\n" +
            "pinMode(2,OUTPUT);\ndigitalWrite(2,LOW);\nSoftPWMSet(4,0);\n"
          );
        case "MR2":
          return (
            "SoftPWMBegin();\n" +
            "pinMode(6,OUTPUT);\n" +
            "pinMode(0,OUTPUT);\ndigitalWrite(0,LOW);\nSoftPWMSet(6,0);\n"
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_Connector", "motor"))
      .appendField(new Blockly.FieldDropdown(MRT_CONNECTOR_OPTIONS), "MOTOR_CON");
    this.appendDummyInput().appendField(motorLabel("MOTOR_Stop", "stop"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Stop the MRT motor on MRTduino board");
  };
  return block;
}

function buildMrtxMotorRun() {
  const block = new BlockBuilder("motor_MRTX_run")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Run MRT motor on MRTX-Uno board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      let direction = b.getFieldValue("MOTOR_DIR");
      const speed =
        generator.valueToCode(b, "CONTENT", generator.ORDER_ATOMIC) || "0";

      switch (connector) {
        case "ML1":
          direction = direction === "HIGH" ? "LOW" : "HIGH";
          return (
            "pinMode(6,OUTPUT);\n" +
            "pinMode(7,OUTPUT);\n" +
            `digitalWrite(7,${direction});\nanalogWrite(6,${speed});\n`
          );
        case "ML2":
          direction = direction === "HIGH" ? "LOW" : "HIGH";
          return (
            "pinMode(5,OUTPUT);\n" +
            "pinMode(12,OUTPUT);\n" +
            `digitalWrite(12,${direction});\nanalogWrite(5,${speed});\n`
          );
        case "MR1":
          return (
            "pinMode(9,OUTPUT);\n" +
            "pinMode(13,OUTPUT);\n" +
            `digitalWrite(13,${direction});\nanalogWrite(9,${speed});\n`
          );
        case "MR2":
          return (
            "pinMode(A3,OUTPUT);\n" +
            "pinMode(10,OUTPUT);\n" +
            `digitalWrite(A3,${direction});\nanalogWrite(10,${speed});\n`
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_MRTX_Connector", "MRTX-Uno Motor"))
      .appendField(new Blockly.FieldDropdown(MRT_CONNECTOR_OPTIONS), "MOTOR_CON");
    this.appendDummyInput()
      .appendField(motorLabel("MOTOR_Direction", "direction"))
      .appendField(new Blockly.FieldDropdown(MRT_DIRECTION_OPTIONS), "MOTOR_DIR");
    this.appendValueInput("CONTENT")
      .setCheck("Number")
      .appendField(motorLabel("MOTOR_speed", "speed(0-255)"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Run the MRT motor on MRTX-Uno board");
  };
  return block;
}

function buildMrtxMotorStop() {
  const block = new BlockBuilder("motor_MRTX_stop")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Stop MRT motor on MRTX-Uno board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      switch (connector) {
        case "ML1":
          return (
            "pinMode(6,OUTPUT);\n" +
            "pinMode(7,OUTPUT);\n" +
            "digitalWrite(7,LOW);\nanalogWrite(6,0);\n"
          );
        case "ML2":
          return (
            "pinMode(5,OUTPUT);\n" +
            "pinMode(12,OUTPUT);\n" +
            "digitalWrite(12,LOW);\nanalogWrite(5,0);\n"
          );
        case "MR1":
          return (
            "pinMode(9,OUTPUT);\n" +
            "pinMode(13,OUTPUT);\n" +
            "digitalWrite(13,LOW);\nanalogWrite(9,0);\n"
          );
        case "MR2":
          return (
            "pinMode(A3,OUTPUT);\n" +
            "pinMode(10,OUTPUT);\n" +
            "digitalWrite(A3,LOW);\nanalogWrite(10,0);\n"
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_MRTX_Connector", "MRTX-Uno Motor"))
      .appendField(new Blockly.FieldDropdown(MRT_CONNECTOR_OPTIONS), "MOTOR_CON");
    this.appendDummyInput().appendField(motorLabel("MOTOR_Stop", "stop"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Stop the MRT motor on MRTX-Uno board");
  };
  return block;
}

function buildMrtNodeMotorRun() {
  const block = new BlockBuilder("motor_MRT_Node_run")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTNODE_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrtnode"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Run MRT motor on MRTnode ESP32 board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      const direction = b.getFieldValue("MOTOR_DIR");
      const speed =
        generator.valueToCode(b, "CONTENT", generator.ORDER_ATOMIC) || "0";
      registerInclude(
        generator,
        "MRT_esp32_Motor.h",
        "MRT ESP32 motor driver library."
      );
      return `DcMotor_init();\nsetDcMotor(${connector},${direction},${speed});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_Connector", "motor"))
      .appendField(
        new Blockly.FieldDropdown(MRT_NODE_CONNECTOR_OPTIONS),
        "MOTOR_CON"
      );
    this.appendDummyInput()
      .appendField(motorLabel("MOTOR_Direction", "direction"))
      .appendField(
        new Blockly.FieldDropdown(MRT_NODE_DIRECTION_OPTIONS),
        "MOTOR_DIR"
      );
    this.appendValueInput("CONTENT")
      .setCheck("Number")
      .appendField(motorLabel("MOTOR_speed", "speed(0-255)"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Run the MRT motor on MRTnode ESP32 board");
  };
  return block;
}

function buildMrtNodeMotorStop() {
  const block = new BlockBuilder("motor_MRT_Node_stop")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTNODE_BOARD_IDS])
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "mrtnode"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Stop MRT motor on MRTnode ESP32 board")
    .setArduinoGenerator((b, generator) => {
      const connector = b.getFieldValue("MOTOR_CON");
      registerInclude(
        generator,
        "MRT_esp32_Motor.h",
        "MRT ESP32 motor driver library."
      );
      return `DcMotor_init();\nsetDcMotor(${connector},0,0);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("MotorMRT.png", "medium"))
      .appendField(motorLabel("MOTOR_Connector", "motor"))
      .appendField(
        new Blockly.FieldDropdown(MRT_NODE_CONNECTOR_OPTIONS),
        "MOTOR_CON"
      );
    this.appendDummyInput().appendField(motorLabel("MOTOR_Stop", "stop"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Stop the MRT motor on MRTnode ESP32 board");
  };
  return block;
}

export const MRT_MOTOR_BLOCKS = [
  buildMrtMotorRun(),
  buildMrtMotorStop(),
  buildMrtxMotorRun(),
  buildMrtxMotorStop(),
  buildMrtNodeMotorRun(),
  buildMrtNodeMotorStop(),
];
