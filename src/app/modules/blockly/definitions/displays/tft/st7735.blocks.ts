import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_ST7735_PINS,
  ST7735_COLOR_OPTIONS,
  ST7735_WRAP_OPTIONS,
  TFT_CATEGORY,
  TFT_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createBlockIconField,
  createPinDropdownField,
  displayLabel,
  ensureSt7735Init,
  registerProgmemIcon,
} from "../displays.helper";

function buildSt7735Init() {
  const block = new BlockBuilder("st7735_init")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip(
      "Init the TFT ST7735.Important note:  the Led pin must be connected to 3.3V!!"
    )
    .setArduinoGenerator((b, generator) => {
      ensureSt7735Init(
        generator,
        b.getFieldValue("PIN_CS"),
        b.getFieldValue("PIN_DC"),
        b.getFieldValue("PIN_RST"),
        b.getFieldValue("WRAP")
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("tft7735.png", "displayWide"))
      .appendField(
        displayLabel("OTTO_HOME_TEXT", "⚙️") +
          displayLabel("ST7735_init", "TFT ST7735")
      )
      .appendField(displayLabel("ST7735_init2", "SCL=SCK SDA=MOSI."));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_PIN_CS", "CS"))
      .appendField(createPinDropdownField(), "PIN_CS");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_PIN_DC", "A0/DC"))
      .appendField(createPinDropdownField(), "PIN_DC");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_PIN_RST", "RST/RES"))
      .appendField(createPinDropdownField(), "PIN_RST");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_WRAP", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_WRAP_OPTIONS), "WRAP");
    applyDefaultAllPinFields(this, DEFAULT_ST7735_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Init the TFT ST7735.Important note:  the Led pin must be connected to 3.3V!!"
    );
  };
  return block;
}

function buildSt7735Icon() {
  const block = new BlockBuilder("st7735_icon")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "icon"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Write icon bmp image in memory")
    .setArduinoGenerator((b, generator) => {
      registerProgmemIcon(
        generator,
        b.getFieldValue("NAME"),
        b.getFieldValue("CODES")
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_IconName", "icon"))
      .appendField(new Blockly.FieldTextInput("IconName"), "NAME");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_ValueList", "hex array"))
      .appendField(
        new Blockly.FieldTextInput("0x00,0xff,0xaf,0x00"),
        "CODES"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write icon bmp image in memory");
  };
  return block;
}

function buildSt7735BackgroundColor() {
  const block = new BlockBuilder("st7735_backgroundcolor")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Fill the background of the color attached.")
    .setArduinoGenerator((b) => {
      const color = b.getFieldValue("COLOR");
      return `tft1.fillScreen(${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_FILLBACKGROUND", "fill background color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Fill the background of the color attached.");
  };
  return block;
}

function buildSt7735RotateDisplay() {
  const block = new BlockBuilder("st7735_rotatedisplay")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Rotate the display")
    .setArduinoGenerator((b) => {
      const degree = b.getFieldValue("DEGREE");
      return `tft1.setRotation(${degree});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Rotate", "rotate"))
      .appendField(
        new Blockly.FieldDropdown([
          ["0º", "0"],
          ["90º", "1"],
          ["180º", "2"],
          ["270º", "3"],
        ]),
        "DEGREE"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Rotate the display");
  };
  return block;
}

function buildSt7735InvertDisplay() {
  const block = new BlockBuilder("st7735_invertdisplay")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Invert the display")
    .setArduinoGenerator((b) => {
      const invert = b.getFieldValue("INVERT_DISPLAY");
      return `tft1.invertDisplay(${invert});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Invert", "invert"))
      .appendField(
        new Blockly.FieldDropdown([
          ["OFF", "0"],
          ["ON", "1"],
        ]),
        "INVERT_DISPLAY"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Invert the display");
  };
  return block;
}

function buildSt7735SetCursor() {
  const block = new BlockBuilder("st7735_setcursor")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Set cursor in a position")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      return `tft1.setCursor(${x0},${y0});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_SetCursor", "set cursor"));
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Set cursor in a position");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
  };
  return block;
}

function buildSt7735SetTextColor() {
  const block = new BlockBuilder("st7735_settextcolor")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Fill the color of the text.")
    .setArduinoGenerator((b) => {
      const color = b.getFieldValue("COLOR");
      return `tft1.setTextColor(${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR", "set text color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Fill the color of the text.");
  };
  return block;
}

function buildSt7735SetTextSize() {
  const block = new BlockBuilder("st7735_settextsize")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Size of the letter.")
    .setArduinoGenerator((b) => {
      const size = b.getFieldValue("SIZE");
      return `tft1.setTextSize(${size});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTsize", "set text size"))
      .appendField(
        new Blockly.FieldDropdown([
          ["Little", "1"],
          ["Medium", "2"],
          ["Large", "3"],
        ]),
        "SIZE"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Size of the letter.");
  };
  return block;
}

function buildSt7735WrapText() {
  const block = new BlockBuilder("st7735_wraptext")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Wrap text")
    .setArduinoGenerator((b) => {
      const wrap = b.getFieldValue("WRAPTEXT");
      return `tft1.setTextWrap(${wrap});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTwrap", "set text wrap"))
      .appendField(
        new Blockly.FieldDropdown([
          ["OFF", "false"],
          ["ON", "true"],
        ]),
        "WRAPTEXT"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Wrap text");
  };
  return block;
}

function buildSt7735PrintTextln() {
  const block = new BlockBuilder("st7735_printTextln")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "text"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Print the text")
    .setArduinoGenerator((b, generator) => {
      const text = generator.valueToCode(
        b,
        "text_to_print",
        generator.ORDER_ATOMIC
      );
      const logic = b.getFieldValue("LOGIC");
      if (logic === "TRUE") {
        return `tft1.println(${text});\n`;
      }
      return `tft1.print(${text});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_PrintTextLN", "print the text/value"));
    this.appendValueInput("text_to_print").setCheck("String");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_PrintTextLN2", "line feed"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Print the text");
    attachShadowBlock(this, "text_to_print", "text", {
      TEXT: "I am a Robot",
    });
  };
  return block;
}

function buildSt7735DrawPixel() {
  const block = new BlockBuilder("st7735_drawpixel")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a pixel")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      return `tft1.drawPixel(${x0},${y0},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_DrawPixel", "draw pixel"));
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a pixel");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
  };
  return block;
}

function buildSt7735DrawLine() {
  const block = new BlockBuilder("st7735_drawline")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a line")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const x1 =
        generator.valueToCode(b, "x1", generator.ORDER_ATOMIC) || "0";
      const y1 =
        generator.valueToCode(b, "y1", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      return `tft1.drawLine(${x0},${y0},${x1},${y1},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_Drawlinefrom", "draw line from"));
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendDummyInput().appendField(
      displayLabel("ST7735_Drawlineto", "to")
    );
    this.appendValueInput("x1")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X1", "X1"));
    this.appendValueInput("y1")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y1", "Y1"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a line");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "x1", "math_number", { NUM: 100 });
    attachShadowBlock(this, "y1", "math_number", { NUM: 100 });
  };
  return block;
}

function buildSt7735DrawRectangle() {
  const block = new BlockBuilder("st7735_drawrectangle")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a rectangle")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const width =
        generator.valueToCode(b, "width", generator.ORDER_ATOMIC) || "0";
      const height =
        generator.valueToCode(b, "height", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      if (b.getFieldValue("LOGIC") === "TRUE") {
        return `tft1.fillRect(${x0},${y0},${width},${height},${color});\n`;
      }
      return `tft1.drawRect(${x0},${y0},${width},${height},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_Drawrectangle", "draw rectangle"));
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectanglewidth", "width"));
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectangleheight", "height"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a rectangle");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 100 });
    attachShadowBlock(this, "height", "math_number", { NUM: 100 });
  };
  return block;
}

function buildSt7735DrawRoundRectangle() {
  const block = new BlockBuilder("st7735_drawroundrectangle")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a round rectangle")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const width =
        generator.valueToCode(b, "width", generator.ORDER_ATOMIC) || "0";
      const height =
        generator.valueToCode(b, "height", generator.ORDER_ATOMIC) || "0";
      const round =
        generator.valueToCode(b, "round", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      if (b.getFieldValue("LOGIC") === "TRUE") {
        return `tft1.fillRoundRect(${x0},${y0},${width},${height},${round},${color});\n`;
      }
      return `tft1.drawRoundRect(${x0},${y0},${width},${height},${round},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(
        displayLabel("ST7735_Drawroundrectangle", "draw round rectangle")
      );
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectanglewidth", "width"));
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectangleheight", "height"));
    this.appendValueInput("round")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawroundrectangleradius", "round"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a round rectangle");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 100 });
    attachShadowBlock(this, "height", "math_number", { NUM: 100 });
    attachShadowBlock(this, "round", "math_number", { NUM: 3 });
  };
  return block;
}

function buildSt7735DrawCircle() {
  const block = new BlockBuilder("st7735_drawcircle")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a circle")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const radius =
        generator.valueToCode(b, "radius", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      if (b.getFieldValue("LOGIC") === "TRUE") {
        return `tft1.fillCircle(${x0},${y0},${radius},${color});\n`;
      }
      return `tft1.drawCircle(${x0},${y0},${radius},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_Drawcircle", "draw circle.Center in"));
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendValueInput("radius")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawcircleradius", "radius"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a circle");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "radius", "math_number", { NUM: 50 });
  };
  return block;
}

function buildSt7735DrawTriangle() {
  const block = new BlockBuilder("st7735_drawtriangle")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a line")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const x1 =
        generator.valueToCode(b, "x1", generator.ORDER_ATOMIC) || "0";
      const y1 =
        generator.valueToCode(b, "y1", generator.ORDER_ATOMIC) || "0";
      const x2 =
        generator.valueToCode(b, "x2", generator.ORDER_ATOMIC) || "0";
      const y2 =
        generator.valueToCode(b, "y2", generator.ORDER_ATOMIC) || "0";
      const color = b.getFieldValue("COLOR");
      if (b.getFieldValue("LOGIC") === "TRUE") {
        return `tft1.fillTriangle(${x0},${y0},${x1},${y1},${x2},${y2},${color});\n`;
      }
      return `tft1.drawTriangle(${x0},${y0},${x1},${y1},${x2},${y2},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(
        displayLabel("ST7735_Drawtriangle", "draw triangle.Corner points")
      );
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendValueInput("x1")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X1", "X1"));
    this.appendValueInput("y1")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y1", "Y1"));
    this.appendValueInput("x2")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X2", "X2"));
    this.appendValueInput("y2")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y2", "Y2"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a line");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "x1", "math_number", { NUM: 100 });
    attachShadowBlock(this, "y1", "math_number", { NUM: 10 });
    attachShadowBlock(this, "x2", "math_number", { NUM: 10 });
    attachShadowBlock(this, "y2", "math_number", { NUM: 100 });
  };
  return block;
}

function buildSt7735DrawIcon() {
  const block = new BlockBuilder("st7735_drawicon")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735", "icon"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("Draw a bmp icon")
    .setArduinoGenerator((b, generator) => {
      const x0 =
        generator.valueToCode(b, "x0", generator.ORDER_ATOMIC) || "0";
      const y0 =
        generator.valueToCode(b, "y0", generator.ORDER_ATOMIC) || "0";
      const width =
        generator.valueToCode(b, "width", generator.ORDER_ATOMIC) || "0";
      const height =
        generator.valueToCode(b, "height", generator.ORDER_ATOMIC) || "0";
      const iconName = b.getFieldValue("NAME");
      const color = b.getFieldValue("COLOR");
      return `tft1.drawBitmap(${x0},${y0},${iconName},${width},${height},${color});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"))
      .appendField(displayLabel("ST7735_DrawiconName", "draw Icon"));
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("IconName"), "NAME");
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Y0", "Y0"));
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectanglewidth", "width"));
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField(displayLabel("ST7735_Drawrectangleheight", "height"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_TEXTCOLOR2", "color"))
      .appendField(new Blockly.FieldDropdown(ST7735_COLOR_OPTIONS), "COLOR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a bmp icon");
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 160 });
    attachShadowBlock(this, "height", "math_number", { NUM: 128 });
  };
  return block;
}

function buildSt7735Properties() {
  const block = new BlockBuilder("st7735_properties")
    .setCategory(TFT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TFT_LEVEL)
    .setTags(["displays", "tft", "st7735"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const property = b.getFieldValue("Property");
      let code: string;
      switch (property) {
        case "1":
          code = "tft1.width()";
          break;
        case "2":
          code = "tft1.height()";
          break;
        case "3":
          code = "tft1.getCursorX()";
          break;
        case "4":
          code = "tft1.getCursorY()";
          break;
        default:
          code = "tft1.getRotation()";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📺" + displayLabel("ST7735_name", "TFT"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_properties", "return property:"))
      .appendField(
        new Blockly.FieldDropdown([
          ["Width", "1"],
          ["Height", "2"],
          ["X cursor position", "3"],
          ["Y cursor position", "4"],
          ["Rotatation value", "5"],
        ]),
        "Property"
      );
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const ST7735_BLOCKS = [
  buildSt7735Init(),
  buildSt7735Icon(),
  buildSt7735BackgroundColor(),
  buildSt7735RotateDisplay(),
  buildSt7735InvertDisplay(),
  buildSt7735SetCursor(),
  buildSt7735SetTextColor(),
  buildSt7735SetTextSize(),
  buildSt7735WrapText(),
  buildSt7735PrintTextln(),
  buildSt7735DrawPixel(),
  buildSt7735DrawLine(),
  buildSt7735DrawRectangle(),
  buildSt7735DrawRoundRectangle(),
  buildSt7735DrawCircle(),
  buildSt7735DrawTriangle(),
  buildSt7735DrawIcon(),
  buildSt7735Properties(),
];
