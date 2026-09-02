import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_POTENTIOMETER_PIN,
  DEFAULT_ROTARY_ENCODER_BUTTON_PIN,
  DEFAULT_ROTARY_ENCODER_PINS,
  KNOB_CATEGORY,
  SENSOR_INSTANCE_OPTIONS,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadExpression,
  applyDefaultAllPinFields,
  applyDefaultAnalogPinFields,
  applyDefaultInterruptPinFields,
  createAllPinDropdownField,
  createAnalogPinDropdownField,
  createBlockIconField,
  createInterruptPinDropdownField,
  ensureMrtnodeAnalogResolution,
  registerPullupInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

function buildPotentiometer() {
  const block = new BlockBuilder("potentiometer_ranger_sensor2")
    .setCategory(KNOB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "knob", "potentiometer", "analog"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_POTENTIOMETER_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_POTENTIOMETER");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("potentiometer.png"))
      .appendField(sensingLabel("POTE_NAME", "potentiometer"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_POTENTIOMETER");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, {
      PIN_POTENTIOMETER: DEFAULT_POTENTIOMETER_PIN,
    });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("POTENTIOMETER_TOOLTIP", "Analog potentiometer value.")
    );
  };
  return block;
}

function buildRotaryEncoderInit() {
  const block = new BlockBuilder("Init_RotaryEncoderInterrupt")
    .setCategory(KNOB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "knob", "rotary", "encoder", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ROTARY_ENCODER_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("RE_NUMBER");
      const pinDt = b.getFieldValue("PINDT");
      const pinClk = b.getFieldValue("PINCLK");
      registerInclude(generator, "Encoder.h", "Paul Stoffregen Encoder library.");
      registerDefinition(
        generator,
        `rotaryencoder_${number}`,
        `Encoder encoder_${number}(${pinDt},${pinClk});`,
        `Rotary encoder instance #${number}.`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("potentiometer.png"))
      .appendField(initBlockLabel("RotaryEncoderInit", "rotary encoder"))
      .appendField("#")
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "RE_NUMBER"
      );
    this.appendDummyInput()
      .appendField(sensingLabel("RE_PINDT", "DT"))
      .appendField(createInterruptPinDropdownField(), "PINDT");
    this.appendDummyInput()
      .appendField(sensingLabel("RE_PINCLK", "CLK"))
      .appendField(createInterruptPinDropdownField(), "PINCLK");
    applyDefaultInterruptPinFields(this, DEFAULT_ROTARY_ENCODER_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "ROTARY_ENCODER_INIT_TOOLTIP",
        "Create Encoder instance on interrupt-capable CLK/DT pins."
      )
    );
  };
  return block;
}

function buildRotaryEncoderWrite() {
  const block = new BlockBuilder("RotaryEncoder_Write")
    .setCategory(KNOB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "knob", "rotary", "encoder"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_ROTARY_ENCODER_WRITE_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("RE_NUMBER");
      const value =
        generator.valueToCode(b, "Writecounter", generator.ORDER_ATOMIC) || "0";
      return `encoder_${number}.write(${value}*4);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("potentiometer.png"))
      .appendField(sensingLabel("RotaryEncoderNumber", "encoder"))
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "RE_NUMBER"
      )
      .appendField(sensingLabel("RE_WRITE", "write value"));
    this.appendValueInput("Writecounter").setCheck("Number");
    attachShadowBlock(this, "Writecounter", "math_number", { NUM: 0 });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "ROTARY_ENCODER_WRITE_TOOLTIP",
        "Set rotary encoder counter (×4 steps)."
      )
    );
  };
  return block;
}

function buildRotaryEncoderRead() {
  const block = new BlockBuilder("RotaryEncoder_Read")
    .setCategory(KNOB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "knob", "rotary", "encoder"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_ROTARY_ENCODER_READ_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("RE_NUMBER");
      return [`(encoder_${number}.read()/4)`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("potentiometer.png"))
      .appendField(sensingLabel("RotaryEncoderNumber", "encoder"))
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "RE_NUMBER"
      )
      .appendField(sensingLabel("RE_READ", "read value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("ROTARY_ENCODER_READ_TOOLTIP", "Read rotary encoder position.")
    );
  };
  return block;
}

function buildRotaryEncoderButton() {
  const block = new BlockBuilder("rotaryencoder_button_sensor")
    .setCategory(KNOB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "knob", "rotary", "encoder", "button"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_ROTARY_ENCODER_BUTTON_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("RE_NUMBER");
      const pin = b.getFieldValue("PIN_RE_BUTTON");
      registerPullupInputSetup(generator, `setup_re_${number}`, pin);
      return [`!digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("potentiometer.png"))
      .appendField(sensingLabel("RotaryEncoderNumber", "encoder"))
      .appendField(
        new Blockly.FieldDropdown(SENSOR_INSTANCE_OPTIONS),
        "RE_NUMBER"
      )
      .appendField(sensingLabel("RE_Button", "button"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_RE_BUTTON")
      .appendField(sensingLabel("RE_Pressed", "pressed?"));
    applyDefaultAllPinFields(this, {
      PIN_RE_BUTTON: DEFAULT_ROTARY_ENCODER_BUTTON_PIN,
    });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel(
        "ROTARY_ENCODER_BUTTON_TOOLTIP",
        "Rotary encoder push button (active low with pull-up)."
      )
    );
  };
  return block;
}

export const KNOB_BLOCKS = [
  buildPotentiometer(),
  buildRotaryEncoderInit(),
  buildRotaryEncoderWrite(),
  buildRotaryEncoderRead(),
  buildRotaryEncoderButton(),
];
