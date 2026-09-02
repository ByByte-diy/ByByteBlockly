import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
  registerUserFunction,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  PCA9685_CHANNEL_OPTIONS,
  SERVO_CATEGORY,
  SERVO_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createPinDropdownField,
  ensureServoInstance,
  motorLabel,
} from "../motors.helper";

function buildServoMove() {
  const block = new BlockBuilder("servo_move")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      const degree =
        generator.valueToCode(b, "DEGREE", generator.ORDER_ATOMIC) || "0";
      const delay =
        generator.valueToCode(b, "DELAY", generator.ORDER_ATOMIC) || "0";
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin});`
      );
      return setup + `servo_${pin}.write(${degree}); delay(${delay});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_INPUT1", "rotate"));
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.appendValueInput("DEGREE")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_DEGREE", "angle [0°-180°]"));
    this.appendValueInput("DELAY")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("⏲");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoMove2() {
  const block = new BlockBuilder("servo_move2")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin =
        generator.valueToCode(b, "PIN", generator.ORDER_ATOMIC) || "0";
      const degree =
        generator.valueToCode(b, "DEGREE", generator.ORDER_ATOMIC) || "0";
      const delay =
        generator.valueToCode(b, "DELAY", generator.ORDER_ATOMIC) || "0";
      const min =
        generator.valueToCode(b, "Min", generator.ORDER_ATOMIC) || "544";
      const max =
        generator.valueToCode(b, "Max", generator.ORDER_ATOMIC) || "2400";
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin},${min},${max});`
      );
      return setup + `servo_${pin}.write(${degree}); delay(${delay});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png"))
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_INPUT1", "rotate"));
    this.appendValueInput("PIN")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("pin", "PIN"));
    this.appendValueInput("DEGREE")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_DEGREE", "angle [0°-180°]"));
    this.appendValueInput("DELAY")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("⏲");
    this.appendValueInput("Min")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("Min");
    this.appendValueInput("Max")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("Max");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoMoveMicros() {
  const block = new BlockBuilder("servo_movemicros")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      const degree =
        generator.valueToCode(b, "DEGREE", generator.ORDER_ATOMIC) || "0";
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin});`
      );
      return setup + `servo_${pin}.writeMicroseconds(${degree});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_INPUT1", "rotate"));
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.appendValueInput("DEGREE")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("microseconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoAttach() {
  const block = new BlockBuilder("servo_attach")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      ensureServoInstance(generator, pin);
      return `servo_${pin}.attach(${pin});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField("attach servo");
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoDetach() {
  const block = new BlockBuilder("servo_detach")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin});`
      );
      return setup + `servo_${pin}.detach();\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField("detach servo");
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoReadDegrees() {
  const block = new BlockBuilder("servo_read_degrees")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      ensureServoInstance(generator, pin);
      return [`servo_${pin}.read()`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_DEGREE", "angle [0°-180°]"));
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoAttached() {
  const block = new BlockBuilder("servo_attached")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_MOVE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      ensureServoInstance(generator, pin);
      return [`servo_${pin}.attached()`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("servo.png", "medium"))
      .appendField("attached?");
    this.appendDummyInput()
      .appendField(motorLabel("pin", "PIN"))
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_MOVE_TOOLTIP",
        "possible rotation between 0 and 180 degrees"
      )
    );
  };
  return block;
}

function buildServoRotContinue() {
  const block = new BlockBuilder("servo_rot_continue_param")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo", "continuous"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin =
        generator.valueToCode(b, "PIN", generator.ORDER_ATOMIC) || "0";
      const speed =
        generator.valueToCode(b, "SPEED", generator.ORDER_ATOMIC) || "0";
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin});`
      );
      return setup + `servo_${pin}.write(${speed});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      `💿 ${motorLabel("ARDUINO_SERVO_ROT_CONTINUE_TEXT", "spin")}`
    );
    this.appendValueInput("PIN")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("pin", "PIN"));
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("vitesse", "speed"))
      .appendField(motorLabel("values", "↺0-90 | ↻90-180"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP",
        "Spin the servo wheel at the indicated speed [0-90]"
      )
    );
  };
  return block;
}

function buildServoRotStop() {
  const block = new BlockBuilder("servo_rot_stop")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo", "continuous"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin =
        generator.valueToCode(b, "PIN", generator.ORDER_ATOMIC) || "0";
      const setup = ensureServoInstance(
        generator,
        pin,
        `servo_${pin}.attach(${pin});`
      );
      return setup + `servo_${pin}.write(90);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      `💿 ${motorLabel("MOTOR_Stop", "stop")}`
    );
    this.appendValueInput("PIN")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("pin", "PIN"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      motorLabel(
        "ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP",
        "Spin the servo wheel at the indicated speed [0-90]"
      )
    );
  };
  return block;
}

function buildServoPwm() {
  const block = new BlockBuilder("servo_PWM")
    .setCategory(SERVO_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SERVO_LEVEL)
    .setTags(["motors", "servo", "pca9685"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("PCA9685 16-channel PWM servo driver")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      const degree =
        generator.valueToCode(b, "DEGREE", generator.ORDER_ATOMIC) || "0";
      registerInclude(generator, "Wire.h");
      registerInclude(
        generator,
        "Adafruit_PWMServoDriver.h",
        "PCA9685 driver — 16 PWM channels for servos (I2C)."
      );
      registerGlobalVariable(
        generator,
        "servo_PMW_driver",
        "Adafruit_PWMServoDriver servos = Adafruit_PWMServoDriver(0x40);",
        "PCA9685 I2C PWM driver instance (address 0x40)."
      );
      registerDefinition(
        generator,
        "servo_PWM",
        "unsigned int pos0=172;\nunsigned int pos180=565;",
        "PWM calibration for 0° and 180° angles (PCA9685)."
      );
      registerUserFunction(
        generator,
        "servo_PWM",
        "void setServo(uint8_t n_servo, int angulo) {int duty; duty=map(angulo,0,180,pos0, pos180); servos.setPWM(n_servo, 0, duty); }",
        "Function setServo(): set servo angle on PCA9685 channel."
      );
      return (
        "servos.begin();\n" +
        "servos.setPWMFreq(60);\n" +
        `setServo(${pin},${degree});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("pc9685.png", "medium"))
      .appendField(createBlockIconField("servo.png"))
      .appendField(`PCA9685 ${motorLabel("pin", "PIN")}`)
      .appendField(new Blockly.FieldDropdown(PCA9685_CHANNEL_OPTIONS), "PIN");
    this.appendValueInput("DEGREE")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(motorLabel("ARDUINO_SERVO_MOVE_DEGREE", "angle [0°-180°]"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("https://learn.adafruit.com/16-channel-pwm-servo-driver");
  };
  return block;
}

export const SERVO_BLOCKS = [
  buildServoMove(),
  buildServoMove2(),
  buildServoMoveMicros(),
  buildServoAttach(),
  buildServoDetach(),
  buildServoReadDegrees(),
  buildServoAttached(),
  buildServoRotContinue(),
  buildServoRotStop(),
  buildServoPwm(),
];
