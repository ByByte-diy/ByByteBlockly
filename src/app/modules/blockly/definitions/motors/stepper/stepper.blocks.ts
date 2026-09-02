import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  STEPPER_CATEGORY,
  STEPPER_ID_OPTIONS,
  ADVANCED_MOTOR_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createPinDropdownField,
  initBlockLabel,
  motorLabel,
} from "../motors.helper";

function buildStepperConfiguration() {
  const block = new BlockBuilder("stepper_configuration")
    .setCategory(STEPPER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "stepper", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Configure a Stepper motor instance")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("STEEPER_NUMBER");
      const pin1 = b.getFieldValue("PIN_STEEPER1");
      const pin2 = b.getFieldValue("PIN_STEEPER2");
      const pin3 = b.getFieldValue("PIN_STEEPER3");
      const pin4 = b.getFieldValue("PIN_STEEPER4");
      const stepsRev =
        generator.valueToCode(b, "STEP_RPM", generator.ORDER_ATOMIC) || "2048";
      registerInclude(
        generator,
        "Stepper.h",
        "Stepper.h library — stepper motor."
      );
      registerDefinition(
        generator,
        `define_stepper_${number}`,
        `Stepper stepper_${number}(${stepsRev},${pin1},${pin2},${pin3},${pin4});`,
        `Stepper motor #${number} (Stepper library).`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorstep.png"))
      .appendField("#")
      .appendField(new Blockly.FieldDropdown(STEPPER_ID_OPTIONS), "STEEPER_NUMBER")
      .appendField(motorLabel("STEEPER_name", "Stepper"));
    this.appendValueInput("STEP_RPM")
      .setCheck("Number")
      .appendField(motorLabel("STEEPER_steprev", "steps/rev."));
    this.appendDummyInput()
      .appendField(motorLabel("STEEPER_pin1", "PIN A"))
      .appendField(createPinDropdownField(), "PIN_STEEPER1");
    this.appendDummyInput()
      .appendField(motorLabel("STEEPER_pin2", "B"))
      .appendField(createPinDropdownField(), "PIN_STEEPER2");
    this.appendDummyInput()
      .appendField(motorLabel("STEEPER_pin3", "C"))
      .appendField(createPinDropdownField(), "PIN_STEEPER3");
    this.appendDummyInput()
      .appendField(motorLabel("STEEPER_pin4", "D"))
      .appendField(createPinDropdownField(), "PIN_STEEPER4");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("A call to Stepper library with the configuration");
  };
  return block;
}

function buildStepperSpeed() {
  const block = new BlockBuilder("stepper_speed")
    .setCategory(STEPPER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "stepper"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Set stepper speed in RPM")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("STEEPER_NUMBER");
      const speed =
        generator.valueToCode(b, "STEPPER_SPEED", generator.ORDER_ATOMIC) || "60";
      return `stepper_${number}.setSpeed(${speed});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorstep.png", "medium"))
      .appendField("#")
      .appendField(new Blockly.FieldDropdown(STEPPER_ID_OPTIONS), "STEEPER_NUMBER")
      .appendField(motorLabel("STEEPER2_name", "stepper #"));
    this.appendValueInput("STEPPER_SPEED")
      .setCheck("Number")
      .appendField(motorLabel("STEEPER_speed", "speed (rpm)"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Speed configuration");
  };
  return block;
}

function buildStepperSteps() {
  const block = new BlockBuilder("stepper_steps")
    .setCategory(STEPPER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "stepper"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Move stepper by number of steps")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("STEEPER_NUMBER");
      const steps =
        generator.valueToCode(b, "STEPPER_STEP", generator.ORDER_ATOMIC) || "0";
      return `stepper_${number}.step(${steps});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorstep.png", "medium"))
      .appendField("#")
      .appendField(new Blockly.FieldDropdown(STEPPER_ID_OPTIONS), "STEEPER_NUMBER")
      .appendField(motorLabel("STEEPER2_name", "stepper #"));
    this.appendValueInput("STEPPER_STEP")
      .setCheck("Number")
      .appendField(motorLabel("STEEPER_step", "steps"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Move stepper by number of steps");
  };
  return block;
}

function buildMPap() {
  const block = new BlockBuilder("m_pap")
    .setCategory(STEPPER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "stepper", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_m_pap_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const speed =
        generator.valueToCode(b, "vit", generator.ORDER_ASSIGNMENT) || "60";
      const steps =
        generator.valueToCode(b, "pas", generator.ORDER_ASSIGNMENT) || "2048";
      const ph1 =
        generator.valueToCode(b, "ph1", generator.ORDER_ASSIGNMENT) || "8";
      const ph2 =
        generator.valueToCode(b, "ph2", generator.ORDER_ASSIGNMENT) || "10";
      const ph3 =
        generator.valueToCode(b, "ph3", generator.ORDER_ASSIGNMENT) || "9";
      const ph4 =
        generator.valueToCode(b, "ph4", generator.ORDER_ASSIGNMENT) || "11";
      registerInclude(
        generator,
        "Stepper.h",
        "Stepper.h library — stepper motor."
      );
      registerDefinition(
        generator,
        "stepper",
        `Stepper moteurPAP(${steps},${ph1},${ph2},${ph3},${ph4});`,
        "Stepper motor object moteurPAP (4 pins)."
      );
      return `moteurPAP.setSpeed(${speed});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorstep.png", "medium"))
      .appendField(initBlockLabel("m_pap", "step-by-step engine"));
    this.appendValueInput("pas")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("m_pap_step", "step"));
    this.appendValueInput("vit")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("vitesse", "speed"));
    this.appendValueInput("ph1")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("phase 1");
    this.appendValueInput("ph2")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("phase 2");
    this.appendValueInput("ph3")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("phase 3");
    this.appendValueInput("ph4")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("phase 4");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "m_pap_tooltip",
        "Initialization of a stepping motor with steps, RPM and pin numbers"
      )
    );
  };
  return block;
}

function buildMPapStep() {
  const block = new BlockBuilder("m_pap_step")
    .setCategory(STEPPER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "stepper"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_m_pap_step_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const step =
        generator.valueToCode(b, "step", generator.ORDER_ASSIGNMENT) || "0";
      return `moteurPAP.step(${step});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("step")
      .setCheck("Number")
      .appendField(motorLabel("m_pap_step1", "move forward"));
    this.appendDummyInput().appendField(motorLabel("m_pap_step", "step"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "m_pap_step_tooltip",
        "Move the stepper motor by the indicated number of steps"
      )
    );
  };
  return block;
}

export const STEPPER_BLOCKS = [
  buildStepperConfiguration(),
  buildStepperSpeed(),
  buildStepperSteps(),
  buildMPap(),
  buildMPapStep(),
];
