import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerDefinition } from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  BASIC_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  LED_NUMBER_OPTIONS,
  BASIC_LEVEL,
} from "../config";
import {
  blinkSpeedDropdownField,
  createBlockIconField,
  createPinDropdownField,
  createPwmPinDropdownField,
  getBuiltinLED,
  initBlockLabel,
  ledLabel,
  onOffDropdownField,
  registerLedOutputSetup,
} from "../led.helper";

function buildLedDigitalInit() {
  const block = new BlockBuilder("led_digital_init")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "digital", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_del_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN");
      const ledNumber = b.getFieldValue("LED_NUMBER");
      registerDefinition(
        generator,
        `ledPin${pin}`,
        `const int led${ledNumber} = ${pin};`,
        `Digital LED #${ledNumber} connected to pin ${pin}.`
      );
      registerLedOutputSetup(generator, `ledPin${pin}`, pin);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("led.png"))
      .appendField(initBlockLabel("del", "LED"))
      .appendField("#")
      .appendField(new Blockly.FieldDropdown(LED_NUMBER_OPTIONS), "LED_NUMBER")
      .appendField(ledLabel("CAT_numerique", "digital"));
    this.appendDummyInput()
      .appendField(createPinDropdownField(), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("del_tooltip", "Turn on or off the LED on the selected pin."));
  };
  return block;
}

function buildLedDigital() {
  const block = new BlockBuilder("led_digital")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "digital"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_del_tooltip}")
    .setArduinoGenerator((b, _generator) => {
      const stat = b.getFieldValue("STAT");
      const ledNumber = b.getFieldValue("LED_NUMBER");
      return `digitalWrite(led${ledNumber}, ${stat});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("led.png", "medium"))
      .appendField("#")
      .appendField(new Blockly.FieldDropdown(LED_NUMBER_OPTIONS), "LED_NUMBER")
      .appendField(ledLabel("del", "LED"))
      .appendField(ledLabel("CAT_numerique", "digital"));
    this.appendDummyInput().appendField(onOffDropdownField(), "STAT");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("del_tooltip", "Turn on or off the LED on the selected pin."));
  };
  return block;
}

function buildLedPwm() {
  const block = new BlockBuilder("led_pwm")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "pwm"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pwmPin = b.getFieldValue("PWM");
      const stat = generator.valueToCode(b, "STAT", generator.ORDER_ATOMIC);
      registerLedOutputSetup(generator, `setup_output_${pwmPin}`, pwmPin);
      return `analogWrite(${pwmPin}, ${stat});//on a scale of 0 - 255\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(`${ledLabel("del", "LED")} (PWM)`)
      .appendField(createPwmPinDropdownField(), "PWM");
    this.appendValueInput("STAT")
      .setCheck("Number")
      .appendField(ledLabel("_AT", "to"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "STAT", "math_number", { NUM: 128 });
  };
  return block;
}

function buildBuiltinLed() {
  const block = new BlockBuilder("buildin_led")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "builtin"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_ARDUINO_INOUT_BUILDIN_LED_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const stat = b.getFieldValue("STAT");
      const builtinLed = getBuiltinLED();
      registerLedOutputSetup(generator, "setup_output_13", String(builtinLed));
      return `digitalWrite(${builtinLed}, ${stat});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(ledLabel("ARDUINO_INOUT_BUILDIN_LED_INPUT", "board LED"))
      .appendField(onOffDropdownField(), "STAT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel(
        "ARDUINO_INOUT_BUILDIN_LED_TOOLTIP",
        "Turn the on-board LED on or off."
      )
    );
  };
  return block;
}

function buildBlink() {
  const block = new BlockBuilder("blink")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "blink", "builtin"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_blink_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const speed = b.getFieldValue("speed");
      const builtinLed = getBuiltinLED();
      registerLedOutputSetup(generator, "setup_output_13", String(builtinLed));
      return (
        `digitalWrite(${builtinLed}, HIGH);\n` +
        `delay(${speed});\n` +
        `digitalWrite(${builtinLed}, LOW);\n` +
        `delay(${speed});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(ledLabel("blink", "board LED blink"))
      .appendField(blinkSpeedDropdownField(), "speed");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("blink_tooltip", "Blink the on-board LED once at the selected speed.")
    );
  };
  return block;
}

function buildDigitalWrite() {
  const block = new BlockBuilder("digital_write")
    .setCategory(BASIC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(BASIC_LEVEL)
    .setTags(["led", "digital", "write"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_del_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const pin = generator.valueToCode(b, "PIN", generator.ORDER_ATOMIC);
      const stat = b.getFieldValue("STAT");
      registerLedOutputSetup(generator, `setup_output_${pin}`, pin);
      return `digitalWrite(${pin}, ${stat});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("PIN")
      .setCheck("Number")
      .appendField(ledLabel("del", "LED"));
    this.appendDummyInput()
      .appendField(" ")
      .appendField(onOffDropdownField(), "STAT");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("del_tooltip", "Turn on or off the LED on the selected pin."));
    attachShadowBlock(this, "PIN", "math_number", { NUM: 13 });
  };
  return block;
}

export const BASIC_LED_BLOCKS = [
  buildLedDigitalInit(),
  buildLedDigital(),
  buildLedPwm(),
  buildBuiltinLed(),
  buildBlink(),
  buildDigitalWrite(),
];
