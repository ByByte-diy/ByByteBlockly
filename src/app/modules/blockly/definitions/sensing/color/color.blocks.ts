import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
  registerUserFunction,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  COLOR_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import { createBlockIconField, sensingLabel } from "../sensing.helper";

const TCS34725_CAPTURE_FN =
  "void fnc_tcs34725_capturecolor()\n" +
  "{\n" +
  "   tcs34725.setInterrupt(false);\n" +
  "   delay(60);\n" +
  "   tcs34725.getRawData(&tcs_red, &tcs_green, &tcs_blue, &tcs34725_clear);\n" +
  "   tcs34725.setInterrupt(true);\n" +
  "   if (tcs34725_clear == 0) {\n" +
  "      tcs34725_r=tcs34725_g=tcs34725_b=0;\n" +
  "      return;\n" +
  "   }\n" +
  "   colorTemp = tcs34725.calculateColorTemperature_dn40(tcs_red, tcs_green, tcs_blue, tcs34725_clear);\n" +
  "   lux = tcs34725.calculateLux(tcs_red, tcs_green, tcs_blue);\n" +
  "   tcs34725_r = ((float)tcs_red / (float)(tcs34725_clear)) * 256.0;\n" +
  "   tcs34725_g = ((float)tcs_green / (float)(tcs34725_clear)) * 256.0;\n" +
  "   tcs34725_b = ((float)tcs_blue / (float)(tcs34725_clear)) * 256.0;\n" +
  "   ColorConverter::RgbToHsv(static_cast<uint8_t>(tcs34725_r), static_cast<uint8_t>(tcs34725_g), static_cast<uint8_t>(tcs34725_b), tcs34725_h, tcs34725_s,tcs34725_v);\n" +
  "   tcs34725_h=tcs34725_h*360;\n" +
  "   tcs34725_s=tcs34725_s*100;\n" +
  "   tcs34725_v=tcs34725_v*100;\n" +
  "}";

const TCS34725_IS_COLOR_FN =
  "bool fnc_tcs34725_iscolor(int _color)\n" +
  "{\n" +
  "   if(tcs34725_h > 330 || tcs34725_h < 20){ if(_color==2) return true; }\n" +
  "   else if(tcs34725_h < 45){ if(_color==3) return true; }\n" +
  "   else if(tcs34725_h < 90){ if(_color==4) return true; }\n" +
  "   else if(tcs34725_h < 150){ if(_color==5) return true; }\n" +
  "   else if(tcs34725_h < 210){ if(_color==6) return true; }\n" +
  "   else if(tcs34725_h < 270){ if(_color==7) return true; }\n" +
  "   else if(tcs34725_h < 330){ if(_color==8) return true; }\n" +
  "   return false;\n" +
  "}";

function tcsGainOptions(): [string, string][] {
  return [
    [sensingLabel("TCS34725_GAIN_1X", "No gain"), "TCS34725_GAIN_1X"],
    [sensingLabel("TCS34725_GAIN_4X", "4x gain"), "TCS34725_GAIN_4X"],
    [sensingLabel("TCS34725_GAIN_16X", "16x gain"), "TCS34725_GAIN_16X"],
  ];
}

function ensureTcs34725Globals(generator: any, gain: string): void {
  registerInclude(generator, "Wire.h");
  registerInclude(generator, "Adafruit_TCS34725.h");
  registerInclude(
    generator,
    "ColorConverterLib.h",
    "ColorConverterLib — RGB to HSV for TCS34725."
  );
  registerDefinition(
    generator,
    `tcs34725_obj_${gain}`,
    `Adafruit_TCS34725 tcs34725 = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, ${gain});`,
    "TCS34725 color sensor object (I2C)."
  );
  registerDefinition(
    generator,
    "tcs34725_vars",
    "double  tcs34725_r=0;\n" +
      "double  tcs34725_g=0;\n" +
      "double  tcs34725_b=0;\n" +
      "uint16_t  tcs34725_clear=0;\n" +
      "uint16_t  tcs_red, tcs_green, tcs_blue, colorTemp, lux;\n" +
      "double  tcs34725_h=0;\n" +
      "double  tcs34725_s=0;\n" +
      "double  tcs34725_v=0;",
    "TCS34725 measurement variables."
  );
  registerUserFunction(
    generator,
    "tcs34725_capture",
    TCS34725_CAPTURE_FN,
    "Capture raw color from TCS34725 and compute RGB/HSV/lux."
  );
}

function ensureApds9960ColorVars(generator: any): void {
  registerGlobalVariable(
    generator,
    "apds9960_color_vars",
    "uint16_t r_apds;\nuint16_t g_apds;\nuint16_t b_apds;\nuint16_t c_apds;",
    "APDS9960 RGBC channel values."
  );
}

function enableOptions(): [string, string][] {
  return [
    [sensingLabel("ENABLE", "Enable"), "1"],
    [sensingLabel("DISABLE", "Disable"), "0"],
  ];
}

function buildInitTcs34725() {
  const block = new BlockBuilder("init_tcs34725")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "tcs34725", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const gain = b.getFieldValue("Gain");
      ensureTcs34725Globals(generator, gain);
      return "tcs34725.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("TCS34725.png"))
      .appendField(
        initBlockLabel("TCS34725_INIT_LABEL", "TCS34725 color I²C init")
      )
      .appendField(new Blockly.FieldDropdown(tcsGainOptions), "Gain");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildReadTcs34725() {
  const block = new BlockBuilder("read_tcs34725")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "tcs34725"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) => "fnc_tcs34725_capturecolor();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("TCS34725_name", "color sense"))
      .appendField(sensingLabel("TCS34725_read", "read all values"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function tcsValueOptions(): [string, string][] {
  return [
    [sensingLabel("TCS34725_RED_RGB", "Red (RGB)"), "0"],
    [sensingLabel("TCS34725_GREEN_RGB", "Green (RGB)"), "1"],
    [sensingLabel("TCS34725_BLUE_RGB", "Blue (RGB)"), "2"],
    [sensingLabel("TCS34725_CLARITY", "Clarity"), "3"],
    [sensingLabel("TCS34725_HUE", "Hue (HSV)"), "4"],
    [sensingLabel("TCS34725_SAT", "Saturation (HSV)"), "5"],
    [sensingLabel("TCS34725_VAL", "Value (HSV)"), "6"],
    [sensingLabel("TCS34725_LUX", "Lux"), "7"],
    [sensingLabel("TCS34725_TEMP", "Temp"), "8"],
    [sensingLabel("TCS34725_RED_RAW", "Red Raw"), "10"],
    [sensingLabel("TCS34725_GREEN_RAW", "Green Raw"), "11"],
    [sensingLabel("TCS34725_BLUE_RAW", "Blue Raw"), "12"],
  ];
}

function tcsValueExpression(typeValue: string): string {
  switch (typeValue) {
    case "0":
      return "tcs34725_r";
    case "1":
      return "tcs34725_g";
    case "2":
      return "tcs34725_b";
    case "3":
      return "tcs34725_clear";
    case "4":
      return "tcs34725_h";
    case "5":
      return "tcs34725_s";
    case "6":
      return "tcs34725_v";
    case "7":
      return "lux";
    case "8":
      return "colorTemp";
    case "10":
      return "tcs_red";
    case "11":
      return "tcs_green";
    default:
      return "tcs_blue";
  }
}

function buildTcs34725Values() {
  const block = new BlockBuilder("tcs34725_values")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "tcs34725"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => [
      tcsValueExpression(b.getFieldValue("TypeValue")),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("TCS34725_name", "color sense"))
      .appendField(new Blockly.FieldDropdown(tcsValueOptions), "TypeValue")
      .appendField(sensingLabel("TCS34725_values", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function tcsColorOptions(): [string, string][] {
  return [
    [sensingLabel("TCS34725_COLOR_RED", "Red"), "0"],
    [sensingLabel("TCS34725_COLOR_ORANGE", "Orange"), "1"],
    [sensingLabel("TCS34725_COLOR_YELLOW", "Yellow"), "2"],
    [sensingLabel("TCS34725_COLOR_GREEN", "Green"), "3"],
    [sensingLabel("TCS34725_COLOR_CYAN", "Cyan"), "4"],
    [sensingLabel("TCS34725_COLOR_BLUE", "Blue"), "5"],
    [sensingLabel("TCS34725_COLOR_VIOLET", "Violet"), "6"],
  ];
}

function tcsColorCheck(typeColor: string): string {
  const map: Record<string, string> = {
    "0": "2",
    "1": "3",
    "2": "4",
    "3": "5",
    "4": "6",
    "5": "7",
    "6": "8",
  };
  return `fnc_tcs34725_iscolor(${map[typeColor] ?? "2"})`;
}

function buildTcs34725Color() {
  const block = new BlockBuilder("tcs34725_color")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "tcs34725"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      registerUserFunction(
        generator,
        "tcs34725_iscolor",
        TCS34725_IS_COLOR_FN,
        "Check if TCS34725 hue matches a named color."
      );
      return [tcsColorCheck(b.getFieldValue("TypeColor")), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("TCS34725_name", "color sense"))
      .appendField(sensingLabel("TCS34725_color", "is"))
      .appendField(new Blockly.FieldDropdown(tcsColorOptions), "TypeColor")
      .appendField(sensingLabel("TCS34725_color2", "color?"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildApds9960ColorInit() {
  const block = new BlockBuilder("APDS9960_color_init")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "apds9960"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      ensureApds9960ColorVars(generator);
      const enable = b.getFieldValue("ENABLE");
      return enable === "1"
        ? "apds.enableColor(true);\n"
        : "apds.enableColor(false);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("APDS9960_name_color", "color"))
      .appendField(sensingLabel("APDS9960_detection", "detection"))
      .appendField(new Blockly.FieldDropdown(enableOptions), "ENABLE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildApds9960ColorDetected() {
  const block = new BlockBuilder("APDS9960_color_detected")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "apds9960"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "apds.colorDataReady()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("APDS9960_name_color", "color"))
      .appendField(sensingLabel("APDS9960_gesture_detected", "detected"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildApds9960ReadColors() {
  const block = new BlockBuilder("APDS9960_read_colors")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "apds9960"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      ensureApds9960ColorVars(generator);
      return "apds.getColorData(&r_apds, &g_apds, &b_apds, &c_apds);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("APDS9960_name_color", "color"))
      .appendField(sensingLabel("APDS9960_readcolors", "read color frequencies"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function apdsColorChannelOptions(): [string, string][] {
  return [
    [sensingLabel("APDS9960_COLOR_RED", "Red"), "0"],
    [sensingLabel("APDS9960_COLOR_GREEN", "Green"), "1"],
    [sensingLabel("APDS9960_COLOR_BLUE", "Blue"), "2"],
    [sensingLabel("APDS9960_COLOR_CLEAR", "Clear"), "3"],
  ];
}

function buildApds9960Color() {
  const block = new BlockBuilder("APDS9960_color")
    .setCategory(COLOR_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "color", "apds9960"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const color = b.getFieldValue("color");
      const expr =
        color === "0"
          ? "r_apds"
          : color === "1"
            ? "g_apds"
            : color === "2"
              ? "b_apds"
              : "c_apds";
      return [expr, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("color.png", "value"))
      .appendField(sensingLabel("APDS9960_name_color", "color"))
      .appendField(new Blockly.FieldDropdown(apdsColorChannelOptions), "color")
      .appendField(sensingLabel("APDS9960_colors", "frequency"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const COLOR_BLOCKS = [
  buildInitTcs34725(),
  buildReadTcs34725(),
  buildTcs34725Values(),
  buildTcs34725Color(),
  buildApds9960ColorInit(),
  buildApds9960ColorDetected(),
  buildApds9960ReadColors(),
  buildApds9960Color(),
];
