import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_TM1637_PINS,
  LCD_CATEGORY,
  TM1637_NUMBER_OPTIONS,
  LCD_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createBlockIconField,
  createPinDropdownField,
  displayLabel,
  ensureTm1637Init,
} from "../displays.helper";

function buildDisplayTm1637Init() {
  const block = new BlockBuilder("DisplayTM1637_init")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      ensureTm1637Init(
        generator,
        b.getFieldValue("TM1637_NUMBER"),
        b.getFieldValue("PIN_CLK"),
        b.getFieldValue("PIN_DIO")
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_init", "TM1637 display 7 segment"))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      );
    this.appendDummyInput()
      .appendField(displayLabel("TM1637_PinCLK", "CLK"))
      .appendField(createPinDropdownField(), "PIN_CLK");
    this.appendDummyInput()
      .appendField(displayLabel("TM1637_PinDIO", "DIO"))
      .appendField(createPinDropdownField(), "PIN_DIO");
    applyDefaultAllPinFields(this, DEFAULT_TM1637_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildDisplayTm1637SetBrightness() {
  const block = new BlockBuilder("DisplayTM1637_setBrightness")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("TM1637_NUMBER");
      const power = b.getFieldValue("TM1637_POWER");
      const brightness = generator.valueToCode(
        b,
        "Brightness",
        generator.ORDER_ATOMIC
      );
      return `tm1637_${number}.setBrightness(${brightness},${power});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_name", "TM1637 display 7 segment."))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      );
    this.appendValueInput("Brightness")
      .setCheck("Number")
      .appendField(displayLabel("M1637_Brightness", "set brightness(0-7)"));
    this.appendDummyInput()
      .appendField(displayLabel("M1637_turnOFF_ON", "turn"))
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "true"],
          ["OFF", "false"],
        ]),
        "TM1637_POWER"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Brightness", "math_number", { NUM: 7 });
  };
  return block;
}

function buildDisplayTm1637Clear() {
  const block = new BlockBuilder("DisplayTM1637_clear")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b) => {
      const number = b.getFieldValue("TM1637_NUMBER");
      return `tm1637_${number}.clear();\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_name", "TM1637 display 7 segment."))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      );
    this.appendDummyInput().appendField(
      displayLabel("M1637_Clear", "clear")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildDisplayTm1637SetNumberAll() {
  const block = new BlockBuilder("DisplayTM1637_set_numberall")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("TM1637_NUMBER");
      const value = generator.valueToCode(
        b,
        "valuenumber",
        generator.ORDER_ATOMIC
      );
      const pos = generator.valueToCode(b, "Digit", generator.ORDER_ATOMIC);
      const length = generator.valueToCode(
        b,
        "Length",
        generator.ORDER_ATOMIC
      );
      const leading = b.getFieldValue("TM1637_LEADING");
      const points = b.getFieldValue("TM1637_DOTS");
      if (points === "true") {
        return `tm1637_${number}.showNumberDecEx(${value},64,${leading},${length},${pos});\n`;
      }
      return `tm1637_${number}.showNumberDec(${value},${leading},${length},${pos});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_name", "TM1637 display 7 segment."))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      );
    this.appendValueInput("valuenumber")
      .setCheck("Number")
      .appendField(displayLabel("M1637_number", "set number"));
    this.appendValueInput("Digit")
      .setCheck("Number")
      .appendField(displayLabel("M1637_Digit", "position(0-3)"));
    this.appendValueInput("Length")
      .setCheck("Number")
      .appendField(displayLabel("M1637_Length", "number of digits"));
    this.appendDummyInput()
      .appendField(displayLabel("M1637_fill", "leading zeros"))
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "true"],
          ["OFF", "false"],
        ]),
        "TM1637_LEADING"
      );
    this.appendDummyInput()
      .appendField(displayLabel("M1637_points", "Points"))
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "true"],
          ["OFF", "false"],
        ]),
        "TM1637_DOTS"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "valuenumber", "math_number", { NUM: 1234 });
    attachShadowBlock(this, "Digit", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Length", "math_number", { NUM: 4 });
  };
  return block;
}

function buildDisplayTm1637SetSegment() {
  const block = new BlockBuilder("DisplayTM1637_setsegment")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("TM1637_NUMBER");
      const digit = generator.valueToCode(
        b,
        "SegmentDigit",
        generator.ORDER_ATOMIC
      );
      const value = generator.valueToCode(
        b,
        "SegmentValue",
        generator.ORDER_ATOMIC
      );
      return `segmentTM1637_${number}[${digit}]=${value};\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_name", "TM1637 display 7 segment."))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      );
    this.appendValueInput("SegmentDigit")
      .setCheck("Number")
      .appendField(
        displayLabel("M1637_digitsegment", "set segment array digit(0-3)")
      );
    this.appendValueInput("SegmentValue")
      .setCheck("Number")
      .appendField(displayLabel("M1637_value", "value"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "SegmentDigit", "math_number", { NUM: 0 });
    attachShadowBlock(this, "SegmentValue", "math_number", { NUM: 0 });
  };
  return block;
}

function buildDisplayTm1637Segments() {
  const block = new BlockBuilder("DisplayTM1637_segments")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "tm1637"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const number = b.getFieldValue("TM1637_NUMBER");
      const pos = generator.valueToCode(b, "Digit", generator.ORDER_ATOMIC);
      const length = generator.valueToCode(
        b,
        "Length",
        generator.ORDER_ATOMIC
      );
      return `tm1637_${number}.setSegments(segmentTM1637_${number},${length},${pos});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TM1637.png", "tm1637"))
      .appendField(displayLabel("TM1637_name", "TM1637 display 7 segment."))
      .appendField(
        new Blockly.FieldDropdown(TM1637_NUMBER_OPTIONS),
        "TM1637_NUMBER"
      )
      .appendField(
        displayLabel("M1637_arraysegment", "display segment array.")
      );
    this.appendValueInput("Digit")
      .setCheck("Number")
      .appendField(displayLabel("M1637_Digit", "position(0-3)"));
    this.appendValueInput("Length")
      .setCheck("Number")
      .appendField(displayLabel("M1637_Length", "number of digits"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Digit", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Length", "math_number", { NUM: 4 });
  };
  return block;
}

export const TM1637_BLOCKS = [
  buildDisplayTm1637Init(),
  buildDisplayTm1637SetBrightness(),
  buildDisplayTm1637Clear(),
  buildDisplayTm1637SetNumberAll(),
  buildDisplayTm1637SetSegment(),
  buildDisplayTm1637Segments(),
];
