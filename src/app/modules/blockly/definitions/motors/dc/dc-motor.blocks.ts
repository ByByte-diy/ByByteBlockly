import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  ADAFRUIT_MOTOR_OPTIONS,
  ADAFRUIT_RUN_OPTIONS,
  AFMOTOR_DIRECTION_OPTIONS,
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DC_CATEGORY,
  DC_DIRECTION_OPTIONS,
  DC_MOTOR_SIDE_OPTIONS,
  L298N_DEFAULT_PINS,
  ADVANCED_MOTOR_LEVEL,
} from "../config";
import {
  applyDefaultL298nPinFields,
  createBlockIconField,
  createPinDropdownField,
  createPwmPinDropdownField,
  initBlockLabel,
  motorLabel,
} from "../motors.helper";
import {
  registerPinDefines,
  formatPinModesFromMacros,
} from "../../../lib/generators/pin-definitions.helper";
import { registerGlobalVariable, registerInclude } from "../../../lib/generators/codegen-sections.helper";
import { DRV8833_BLOCKS } from "./drv8833.blocks";

function ensureAfMotorShield(generator: any): void {
  registerInclude(
    generator,
    "AFMotor.h",
    "Adafruit Motor Shield library (L293D)."
  );
  registerGlobalVariable(
    generator,
    "AF_DCMotor_1",
    "AF_DCMotor motor_dc_1(1, MOTOR12_2KHZ);",
    "DC motor M1 on Motor Shield."
  );
  registerGlobalVariable(
    generator,
    "AF_DCMotor_2",
    "AF_DCMotor motor_dc_2(2, MOTOR12_2KHZ);",
    "DC motor M2 on Motor Shield."
  );
}

function ensureAfMotorInstance(generator: any, motor: string): void {
  registerInclude(
    generator,
    "AFMotor.h",
    "Adafruit Motor Shield library (L293D)."
  );
  registerGlobalVariable(
    generator,
    `AF_DCMotor${motor}`,
    `AF_DCMotor motor_dc_${motor}(${motor}, MOTOR12_2KHZ);`,
    `DC motor M${motor} on Motor Shield v1.`
  );
}

function buildDcMotorInit() {
  const block = new BlockBuilder("moteur_dc_init")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_moteurdagu_tooltiprs040}")
    .setArduinoGenerator((b, generator) => {
      const ENA = b.getFieldValue("ENA");
      const ENB = b.getFieldValue("ENB");
      const IN1 = b.getFieldValue("IN1");
      const IN2 = b.getFieldValue("IN2");
      const IN3 = b.getFieldValue("IN3");
      const IN4 = b.getFieldValue("IN4");
      registerPinDefines(
        generator,
        "motordc",
        {
          l298n_ena: ENA,
          l298n_enb: ENB,
          l298n_in1: IN1,
          l298n_in2: IN2,
          l298n_in3: IN3,
          l298n_in4: IN4,
        },
        "L298N driver pins (ENA, ENB — PWM; IN1–IN4 — direction)."
      );
      return formatPinModesFromMacros(
        [
          "l298n_ena",
          "l298n_enb",
          "l298n_in1",
          "l298n_in2",
          "l298n_in3",
          "l298n_in4",
        ],
        "OUTPUT"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorDC.png"))
      .appendField(initBlockLabel("MOTOR_L298N_INIT", "L298N"));
    this.appendDummyInput()
      .appendField("ENA")
      .appendField(createPwmPinDropdownField(), "ENA");
    this.appendDummyInput()
      .appendField("ENB")
      .appendField(createPwmPinDropdownField(), "ENB");
    this.appendDummyInput()
      .appendField("IN1")
      .appendField(createPinDropdownField(), "IN1");
    this.appendDummyInput()
      .appendField("IN2")
      .appendField(createPinDropdownField(), "IN2");
    this.appendDummyInput()
      .appendField("IN3")
      .appendField(createPinDropdownField(), "IN3");
    this.appendDummyInput()
      .appendField("IN4")
      .appendField(createPinDropdownField(), "IN4");
    applyDefaultL298nPinFields(this, L298N_DEFAULT_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "moteurdagu_tooltiprs040",
        "Configure L298N DC motor driver pins"
      )
    );
  };
  return block;
}

function buildDcMotor() {
  const block = new BlockBuilder("moteur_dc")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_moteurdagu_tooltiprs040}")
    .setArduinoGenerator((b, generator) => {
      const motor = b.getFieldValue("MOTEUR");
      const direction = b.getFieldValue("ETAT");
      const speed =
        generator.valueToCode(b, "speed", generator.ORDER_ATOMIC) || "0";
      let code = "";
      if (motor === "11") {
        if (direction === "1") {
          code =
            `digitalWrite(l298n_in1,LOW);\ndigitalWrite(l298n_in2,HIGH);\n` +
            `analogWrite(l298n_ena,(${speed}));\n` +
            `digitalWrite(l298n_in3,LOW);\ndigitalWrite(l298n_in4,HIGH);\n` +
            `analogWrite(l298n_enb,(${speed}));\n`;
        } else {
          code =
            `digitalWrite(l298n_in1,HIGH);\ndigitalWrite(l298n_in2,LOW);\n` +
            `analogWrite(l298n_ena,(${speed}));\n` +
            `digitalWrite(l298n_in3,HIGH);\ndigitalWrite(l298n_in4,LOW);\n` +
            `analogWrite(l298n_enb,(${speed}));\n`;
        }
      } else if (motor === "6") {
        if (direction === "1") {
          code =
            `digitalWrite(l298n_in1,LOW);\ndigitalWrite(l298n_in2,HIGH);\n` +
            `analogWrite(l298n_ena,(${speed}));\n`;
        } else {
          code =
            `digitalWrite(l298n_in1,HIGH);\ndigitalWrite(l298n_in2,LOW);\n` +
            `analogWrite(l298n_ena,(${speed}));\n`;
        }
      } else if (motor === "5") {
        if (direction === "1") {
          code =
            `digitalWrite(l298n_in3,LOW);\ndigitalWrite(l298n_in4,HIGH);\n` +
            `analogWrite(l298n_enb,(${speed}));\n`;
        } else {
          code =
            `digitalWrite(l298n_in3,HIGH);\ndigitalWrite(l298n_in4,LOW);\n` +
            `analogWrite(l298n_enb,(${speed}));\n`;
        }
      }
      return code;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorDC.png", "medium"))
      .appendField(motorLabel("moteur", "spin motor DC"));
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(
        new Blockly.FieldDropdown(
          DC_MOTOR_SIDE_OPTIONS.map(([label, value]) => [
            motorLabel(
              label === "right"
                ? "right"
                : label === "left"
                  ? "left"
                  : "LetR",
              label
            ),
            value,
          ])
        ),
        "MOTEUR"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("direction", "direction"))
      .appendField(new Blockly.FieldDropdown(DC_DIRECTION_OPTIONS), "ETAT");
    this.appendValueInput("speed")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("vitesse", "speed"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "moteurdagu_tooltiprs040",
        "Drive L298N DC motor at the given speed"
      )
    );
  };
  return block;
}

function buildDcMotorStop() {
  const block = new BlockBuilder("moteur_dc_stop")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_moteurdagu_tooltiprs040stop}")
    .setArduinoGenerator((b) => {
      const motor = b.getFieldValue("MOTEUR");
      if (motor === "11") {
        return (
          "digitalWrite(l298n_in1,LOW);\ndigitalWrite(l298n_in2,LOW);\n" +
          "digitalWrite(l298n_in3,LOW);\ndigitalWrite(l298n_in4,LOW);\n"
        );
      }
      if (motor === "6") {
        return "digitalWrite(l298n_in1,LOW);\ndigitalWrite(l298n_in2,LOW);\n";
      }
      if (motor === "5") {
        return "digitalWrite(l298n_in3,LOW);\ndigitalWrite(l298n_in4,LOW);\n";
      }
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("motorDC.png", "medium"))
      .appendField(motorLabel("moteurstop", "stop"))
      .appendField(
        new Blockly.FieldDropdown(
          DC_MOTOR_SIDE_OPTIONS.map(([label, value]) => [
            motorLabel(
              label === "right"
                ? "right"
                : label === "left"
                  ? "left"
                  : "LetR",
              label
            ),
            value,
          ])
        ),
        "MOTEUR"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel("moteurdagu_tooltiprs040stop", "Stop L298N DC motor")
    );
  };
  return block;
}

function buildMotorAction() {
  const block = new BlockBuilder("moteur_action")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "afmotor"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_mot_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const menu = b.getFieldValue("menu");
      const speed =
        generator.valueToCode(b, "speed", generator.ORDER_ATOMIC) || "0";
      ensureAfMotorShield(generator);
      switch (menu) {
        case "a":
          return (
            `motor_dc_1.setSpeed(2*${speed});\nmotor_dc_1.run(FORWARD);\n` +
            `motor_dc_2.setSpeed(2*${speed});\nmotor_dc_2.run(FORWARD);\n`
          );
        case "d":
          return (
            `motor_dc_1.setSpeed(2*${speed});\nmotor_dc_1.run(FORWARD);\n` +
            `motor_dc_2.setSpeed(2*${speed});\nmotor_dc_2.run(BACKWARD);\n`
          );
        case "g":
          return (
            `motor_dc_1.setSpeed(2*${speed});\nmotor_dc_1.run(BACKWARD);\n` +
            `motor_dc_2.setSpeed(2*${speed});\nmotor_dc_2.run(FORWARD);\n`
          );
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("L293D.png", "medium"))
      .appendField(new Blockly.FieldDropdown(AFMOTOR_DIRECTION_OPTIONS), "menu")
      .appendField(motorLabel("vitesse", "speed"));
    this.appendValueInput("speed").setCheck("Number");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "mot_tooltip",
        "L293D motor shield: drive both motors forward or turn"
      )
    );
  };
  return block;
}

function buildMotorStop() {
  const block = new BlockBuilder("moteur_stop")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "afmotor"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_mot_stop_tooltip}")
    .setArduinoGenerator((_b, generator) => {
      ensureAfMotorShield(generator);
      return "motor_dc_1.run(RELEASE);\nmotor_dc_2.run(RELEASE);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("L293D.png", "medium"))
      .appendField(motorLabel("moteurstop", "stop"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel("mot_stop_tooltip", "Stop both motors on L293D shield")
    );
  };
  return block;
}

function buildDcMotorV1() {
  const block = new BlockBuilder("dcmotor_v1")
    .setCategory(DC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(ADVANCED_MOTOR_LEVEL)
    .setTags(["motors", "dc", "afmotor"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("Adafruit Motor Shield v1")
    .setArduinoGenerator((b, generator) => {
      const motor = b.getFieldValue("MOTEUR");
      const state = b.getFieldValue("ETAT");
      const speed =
        generator.valueToCode(b, "Vitesse", generator.ORDER_ATOMIC) || "0";
      ensureAfMotorInstance(generator, motor);
      return (
        `motor_dc_${motor}.setSpeed(${speed});\n` +
        `motor_dc_${motor}.run(${state});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("ADAFRUIT_MOTORSHIELD_MOTOR1", "v1 - DC Motor"))
      .appendField(new Blockly.FieldDropdown(ADAFRUIT_MOTOR_OPTIONS), "MOTEUR");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("ADAFRUIT_MOTORSHIELD_MOTOR_DIRECTION", "direction"))
      .appendField(new Blockly.FieldDropdown(ADAFRUIT_RUN_OPTIONS), "ETAT");
    this.appendValueInput("Vitesse")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("vitesse", "speed"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("https://www.adafruit.com/products/81");
  };
  return block;
}

export const DC_MOTOR_BLOCKS = [
  ...DRV8833_BLOCKS,
  buildDcMotorInit(),
  buildDcMotor(),
  buildDcMotorStop(),
  buildMotorAction(),
  buildMotorStop(),
  buildDcMotorV1(),
];
