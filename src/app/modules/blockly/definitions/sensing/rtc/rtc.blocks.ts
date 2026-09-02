import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  RTC_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, sensingLabel } from "../sensing.helper";

const DS3231_GLOBALS =
  "RTC_DS3231 rtc;\n" +
  "DateTime t;\n" +
  'String daysOfTheWeek[7]={"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};\n' +
  'String monthsNames[12]={"January","February","March","April","May","June","July","August","September","October","November","December"};';

function ds3231ValueOptions(): [string, string][] {
  return [
    [sensingLabel("RTCDS3231_YEAR", "year"), "0"],
    [sensingLabel("RTCDS3231_MONTH", "month"), "1"],
    [sensingLabel("RTCDS3231_DAY", "day"), "2"],
    [sensingLabel("RTCDS3231_HOUR", "hour"), "3"],
    [sensingLabel("RTCDS3231_MINUTE", "minute"), "4"],
    [sensingLabel("RTCDS3231_SECOND", "second"), "5"],
    [sensingLabel("RTCDS3231_DOFWEEK", "day of week"), "6"],
  ];
}

function internalRtcValueOptions(): [string, string][] {
  return [
    [sensingLabel("INTERNALRTC_YEAR", "Year"), "0"],
    [sensingLabel("INTERNALRTC_MONTH", "Month"), "1"],
    [sensingLabel("INTERNALRTC_DAY", "Day"), "2"],
    [sensingLabel("INTERNALRTC_HOUR", "Hour"), "3"],
    [sensingLabel("INTERNALRTC_MINUTE", "Minute"), "4"],
    [sensingLabel("INTERNALRTC_SECOND", "Second"), "5"],
    [sensingLabel("INTERNALRTC_DOFWEEK", "Day of week"), "6"],
  ];
}

function buildDs3231Init() {
  const block = new BlockBuilder("Init_RTC_ds3231")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "ds3231", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      registerInclude(generator, "RTClib.h", "RTClib — DS3231 real-time clock (I2C).");
      registerDefinition(
        generator,
        "rtc_ds3231",
        DS3231_GLOBALS,
        "DS3231 RTC instance and date/time helpers."
      );
      return "rtc.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("rtcds3231.png"))
      .appendField(
        initBlockLabel("RTCDS3231_INIT_LABEL", "DS3231 RTC I²C init")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildDs3231SetDateTime() {
  const block = new BlockBuilder("DateTime_RTC_ds3231")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "ds3231"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const day =
        generator.valueToCode(b, "DS3231_DAY", generator.ORDER_ATOMIC) || "1";
      const month =
        generator.valueToCode(b, "DS3231_MONTH", generator.ORDER_ATOMIC) || "1";
      const year =
        generator.valueToCode(b, "DS3231_YEAR", generator.ORDER_ATOMIC) || "2024";
      const hour =
        generator.valueToCode(b, "DS3231_HOUR", generator.ORDER_ATOMIC) || "0";
      const minute =
        generator.valueToCode(b, "DS3231_MINUTE", generator.ORDER_ATOMIC) || "0";
      const second =
        generator.valueToCode(b, "DS3231_SECOND", generator.ORDER_ATOMIC) || "0";
      return `rtc.adjust(DateTime(${year},${month},${day},${hour},${minute},${second}));\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      sensingLabel("RTCDS3231_RTC", "set date & time")
    );
    this.appendValueInput("DS3231_DAY")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_DAY", "day"));
    this.appendValueInput("DS3231_MONTH")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_MONTH", "month"));
    this.appendValueInput("DS3231_YEAR")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_YEAR", "year"));
    this.appendValueInput("DS3231_HOUR")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_HOUR", "hour"));
    this.appendValueInput("DS3231_MINUTE")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_MINUTE", "minute"));
    this.appendValueInput("DS3231_SECOND")
      .setCheck("Number")
      .appendField(sensingLabel("RTCDS3231_SECOND", "second"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "DS3231_DAY", "math_number", { NUM: 1 });
    attachShadowBlock(this, "DS3231_MONTH", "math_number", { NUM: 1 });
    attachShadowBlock(this, "DS3231_YEAR", "math_number", { NUM: 2024 });
    attachShadowBlock(this, "DS3231_HOUR", "math_number", { NUM: 0 });
    attachShadowBlock(this, "DS3231_MINUTE", "math_number", { NUM: 0 });
    attachShadowBlock(this, "DS3231_SECOND", "math_number", { NUM: 0 });
  };
  return block;
}

function buildDs3231Read() {
  const block = new BlockBuilder("order_read_rtc_ds3231")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "ds3231"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, _generator) => "t=rtc.now();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      sensingLabel("RTCDS3231_READ_RTC", "RTC read date & time")
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function ds3231ValueExpression(outputValue: string): string {
  switch (outputValue) {
    case "5":
      return "t.second()";
    case "4":
      return "t.minute()";
    case "3":
      return "t.hour()";
    case "2":
      return "t.day()";
    case "1":
      return "t.month()";
    case "0":
      return "t.year()";
    default:
      return "t.dayOfTheWeek()";
  }
}

function buildDs3231Values() {
  const block = new BlockBuilder("values_ds3231")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "ds3231"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => [
      ds3231ValueExpression(b.getFieldValue("OUTPUT_VALUE")),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RTCDS3231_Name2", "RTC"))
      .appendField(new Blockly.FieldDropdown(ds3231ValueOptions), "OUTPUT_VALUE")
      .appendField(sensingLabel("RTCDS3231_VALUES", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildDs3231TextValues() {
  const block = new BlockBuilder("values_text_ds3231")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "ds3231"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const outputValue = b.getFieldValue("OUTPUT_VALUE");
      const code =
        outputValue === "1"
          ? "monthsNames[t.month()-1]"
          : "daysOfTheWeek[t.dayOfTheWeek()]";
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RTCDS3231_Name2", "RTC"))
      .appendField(
        new Blockly.FieldDropdown([
          [sensingLabel("RTCDS3231_TEXT_DOFWEEK", "Day of week"), "0"],
          [sensingLabel("RTCDS3231_TEXT_MONTH", "Month"), "1"],
        ]),
        "OUTPUT_VALUE"
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
  };
  return block;
}

function buildInternalRtcInit() {
  const block = new BlockBuilder("Init_RTC_internal")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(["esp32"])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "esp32", "internal"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      registerInclude(generator, "ESP32Time.h", "ESP32 internal RTC library.");
      registerGlobalVariable(
        generator,
        "internal_rtc",
        "ESP32Time rtc;",
        "ESP32 internal RTC instance."
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("rtcds3231.png"))
      .appendField(
        initBlockLabel("INTERNALRTC_INIT_LABEL", "ESP32 internal RTC init")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildInternalRtcSetDateTime() {
  const block = new BlockBuilder("DateTime_RTC_internal")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(["esp32"])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "esp32", "internal"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const day =
        generator.valueToCode(b, "INTERNAL_DAY", generator.ORDER_ATOMIC) || "1";
      const month =
        generator.valueToCode(b, "INTERNAL_MONTH", generator.ORDER_ATOMIC) || "1";
      const year =
        generator.valueToCode(b, "INTERNAL_YEAR", generator.ORDER_ATOMIC) || "2024";
      const hour =
        generator.valueToCode(b, "INTERNAL_HOUR", generator.ORDER_ATOMIC) || "0";
      const minute =
        generator.valueToCode(b, "INTERNAL_MINUTE", generator.ORDER_ATOMIC) || "0";
      const second =
        generator.valueToCode(b, "INTERNAL_SECOND", generator.ORDER_ATOMIC) || "0";
      return `rtc.setTime(${second},${minute},${hour},${day},${month},${year});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      sensingLabel("INTERNALRTC_RTC", "Set Date & Time")
    );
    this.appendValueInput("INTERNAL_DAY")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_DAY", "Day"));
    this.appendValueInput("INTERNAL_MONTH")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_MONTH", "Month"));
    this.appendValueInput("INTERNAL_YEAR")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_YEAR", "Year"));
    this.appendValueInput("INTERNAL_HOUR")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_HOUR", "Hour"));
    this.appendValueInput("INTERNAL_MINUTE")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_MINUTE", "Minute"));
    this.appendValueInput("INTERNAL_SECOND")
      .setCheck("Number")
      .appendField(sensingLabel("INTERNALRTC_SECOND", "Second"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "INTERNAL_DAY", "math_number", { NUM: 1 });
    attachShadowBlock(this, "INTERNAL_MONTH", "math_number", { NUM: 1 });
    attachShadowBlock(this, "INTERNAL_YEAR", "math_number", { NUM: 2024 });
    attachShadowBlock(this, "INTERNAL_HOUR", "math_number", { NUM: 0 });
    attachShadowBlock(this, "INTERNAL_MINUTE", "math_number", { NUM: 0 });
    attachShadowBlock(this, "INTERNAL_SECOND", "math_number", { NUM: 0 });
  };
  return block;
}

function internalRtcValueExpression(outputValue: string): string {
  switch (outputValue) {
    case "5":
      return "rtc.getSecond()";
    case "4":
      return "rtc.getMinute()";
    case "3":
      return "rtc.getHour()";
    case "2":
      return "rtc.getDay()";
    case "1":
      return "rtc.getMonth()";
    case "0":
      return "rtc.getYear()";
    default:
      return "rtc.getDayofWeek()";
  }
}

function buildInternalRtcValues() {
  const block = new BlockBuilder("values_internal_RTC")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(["esp32"])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "esp32", "internal"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => [
      internalRtcValueExpression(b.getFieldValue("OUTPUT_VALUE")),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("INTERNALRTC_NAME", "Internal RTC"))
      .appendField(
        new Blockly.FieldDropdown(internalRtcValueOptions),
        "OUTPUT_VALUE"
      )
      .appendField(sensingLabel("INTERNALRTC_VALUES", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildInternalRtcTextValues() {
  const block = new BlockBuilder("values_text_internal_RTC")
    .setCategory(RTC_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(["esp32"])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rtc", "esp32", "internal"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const code =
        b.getFieldValue("OUTPUT_VALUE") === "1"
          ? "rtc.getTime()"
          : "rtc.getDate()";
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("INTERNALRTC_NAME", "Internal RTC"))
      .appendField(
        new Blockly.FieldDropdown([
          [sensingLabel("INTERNALRTC_GETDATE", "Get Date"), "0"],
          [sensingLabel("INTERNALRTC_GETTIME", "Get Time"), "1"],
        ]),
        "OUTPUT_VALUE"
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
  };
  return block;
}

export const RTC_BLOCKS = [
  buildDs3231Init(),
  buildDs3231SetDateTime(),
  buildDs3231Read(),
  buildDs3231Values(),
  buildDs3231TextValues(),
  buildInternalRtcInit(),
  buildInternalRtcSetDateTime(),
  buildInternalRtcValues(),
  buildInternalRtcTextValues(),
];
