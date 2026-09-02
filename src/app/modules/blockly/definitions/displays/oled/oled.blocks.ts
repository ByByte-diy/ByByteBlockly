import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  OLED_ADDRESS_OPTIONS,
  OLED_CATEGORY,
  OLED_HEIGHT_OPTIONS,
  OLED_LEVEL,
} from "../config";
import {
  createBlockIconField,
  displayLabel,
  ensureOledSh1106Init,
  ensureOledSsd1306Init,
  oledDrawColor,
  oledRectDrawColor,
  registerProgmemIcon,
} from "../displays.helper";

const OLED_HELP_URL =
  "https://learn.adafruit.com/monochrome-oled-breakouts/arduino-library-and-examples";
const ICON_HELP_URL = "http://javl.github.io/image2cpp/";

function buildOledInit() {
  const block = new BlockBuilder("OLED_init")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      ensureOledSsd1306Init(
        generator,
        b.getFieldValue("height"),
        b.getFieldValue("address")
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("oled.png"))
      .appendField(
        displayLabel("OTTO_HOME_TEXT", "⚙️") + "OLED 0.96'' I²C"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(displayLabel("OLED_height", "height"))
      .appendField(new Blockly.FieldDropdown(OLED_HEIGHT_OPTIONS), "height")
      .appendField(
        new Blockly.FieldDropdown(OLED_ADDRESS_OPTIONS),
        "address"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledInit2() {
  const block = new BlockBuilder("OLED_init2")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      ensureOledSh1106Init(generator, b.getFieldValue("address"));
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("oled.png"))
      .appendField(
        displayLabel("OTTO_HOME_TEXT", "⚙️") + "OLED 1.3'' I²C"
      );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(
        new Blockly.FieldDropdown(OLED_ADDRESS_OPTIONS),
        "address"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledIcon() {
  const block = new BlockBuilder("oled_icon")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "icon"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(ICON_HELP_URL)
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
    this.appendDummyInput().appendField(createBlockIconField("oled.png"));
    this.appendDummyInput()
      .appendField(displayLabel("OLED_IconName", "icon design"))
      .appendField(new Blockly.FieldTextInput("IconName"), "NAME");
    this.appendDummyInput()
      .appendField(displayLabel("OLED_ValueList", "values(hex array)"))
      .appendField(
        new Blockly.FieldTextInput(
          "0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00"
        ),
        "CODES"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write icon bmp image in memory");
    this.setHelpUrl(ICON_HELP_URL);
  };
  return block;
}

function buildOledDisplay() {
  const block = new BlockBuilder("OLED_display")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator(() => "display.display();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "🖥️ " + displayLabel("LCD_SHIELD_PRINT_TEXT", "show")
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledClear() {
  const block = new BlockBuilder("OLED_clear")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator(() => "display.clearDisplay();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "🖥️ " + displayLabel("LCD_raz_tooltip", "clear screen 🧹")
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledRotate() {
  const block = new BlockBuilder("OLED_rotate")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b) => {
      const angle = b.getFieldValue("angle");
      return `display.setRotation(${angle});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("🖥️ " + displayLabel("ST7735_Rotate", "rotate"))
      .appendField(
        new Blockly.FieldDropdown([
          ["0°", "0"],
          ["90°", "1"],
          ["180°", "2"],
          ["270°", "3"],
        ]),
        "angle"
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledInvert() {
  const block = new BlockBuilder("OLED_invert")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b) => {
      const mode = b.getFieldValue("mode");
      return `display.invertDisplay(${mode});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("🖥️ invert")
      .appendField(
        new Blockly.FieldDropdown([
          [displayLabel("YES", "yes"), "true"],
          [displayLabel("NO", "no"), "false"],
        ]),
        "mode"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledScroll() {
  const block = new BlockBuilder("OLED_scroll")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b) => {
      switch (b.getFieldValue("mode")) {
        case "right":
          return "display.startscrollright(0x00, 0x07);\n";
        case "left":
          return "display.startscrollleft(0x00, 0x07);\n";
        case "stop":
          return "display.stopscroll();\n";
        default:
          return "";
      }
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("🖥️ scroll")
      .appendField(
        new Blockly.FieldDropdown([
          ["👈", "left"],
          ["👉", "right"],
          ["🛑", "stop"],
        ]),
        "mode"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
  };
  return block;
}

function buildOledBitmap2() {
  const block = new BlockBuilder("OLED_bitmap2")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "bitmap"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(ICON_HELP_URL)
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
      const draw = oledDrawColor(b);
      return `display.drawBitmap(${x0},${y0},${iconName},${width},${height},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("🖥️")
      .appendField(displayLabel("OLED_DrawiconName", "draw"));
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("IconName"), "NAME");
    this.appendValueInput("x0")
      .setCheck("Number")
      .appendField(displayLabel("OLED_X0", "X0"));
    this.appendValueInput("y0")
      .setCheck("Number")
      .appendField(displayLabel("OLED_Y0", "Y0"));
    this.appendValueInput("width")
      .setCheck("Number")
      .appendField(displayLabel("OLED_width", "width"));
    this.appendValueInput("height")
      .setCheck("Number")
      .appendField(displayLabel("OLED_height", "height"));
    this.appendDummyInput()
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Draw a bmp icon");
    this.setHelpUrl(ICON_HELP_URL);
    attachShadowBlock(this, "x0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "y0", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 128 });
    attachShadowBlock(this, "height", "math_number", { NUM: 64 });
  };
  return block;
}

function buildOledData() {
  const block = new BlockBuilder("OLED_data")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "text"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const size = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const print = generator.valueToCode(b, "print", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      return (
        `display.setTextSize(${size});\n` +
        `display.setTextColor(${draw});\n` +
        `display.setCursor(${x},${y});\n` +
        `display.println(${print});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️ data");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_height", "height"));
    this.appendValueInput("print")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(displayLabel("LCDP_Print", "print"));
    this.appendDummyInput()
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
    attachShadowBlock(this, "height", "math_number", { NUM: 1 });
    attachShadowBlock(this, "print", "text", { TEXT: "Hello Otto" });
  };
  return block;
}

function buildOledSymbol() {
  const block = new BlockBuilder("OLED_symbol")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "text"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const size = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const print = generator.valueToCode(b, "print", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      return (
        `display.setTextSize(${size});\n` +
        `display.setTextColor(${draw});\n` +
        `display.setCursor(${x},${y});\n` +
        `display.write(${print});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️ symbol");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_height", "height"));
    this.appendValueInput("print")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(displayLabel("LCDP_Print", "print"));
    this.appendDummyInput()
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
    attachShadowBlock(this, "height", "math_number", { NUM: 1 });
    attachShadowBlock(this, "print", "math_number", { NUM: 3 });
  };
  return block;
}

function buildOledPixel() {
  const block = new BlockBuilder("OLED_pixel")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      return `display.drawPixel(${x}, ${y},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️.");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendDummyInput()
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
  };
  return block;
}

function buildOledLine() {
  const block = new BlockBuilder("OLED_line")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const x2 = generator.valueToCode(b, "width", generator.ORDER_ATOMIC);
      const y2 = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      return `display.drawLine(${x}, ${y}, ${x2}, ${y2},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️_");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X1");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y1");
    this.appendValueInput("width")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X2");
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y2");
    this.appendDummyInput()
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 90 });
    attachShadowBlock(this, "height", "math_number", { NUM: 50 });
  };
  return block;
}

function buildOledRectangle() {
  const block = new BlockBuilder("OLED_rectangle")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const w = generator.valueToCode(b, "width", generator.ORDER_ATOMIC);
      const h = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const draw = oledRectDrawColor(b);
      if (b.getFieldValue("fill") === "TRUE") {
        return `display.fillRect(${x}, ${y}, ${w}, ${h},${draw});\n`;
      }
      return `display.drawRect(${x}, ${y}, ${w}, ${h},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️🔲");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendValueInput("width")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_width", "width"));
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_height", "height"));
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill")
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 70 });
    attachShadowBlock(this, "height", "math_number", { NUM: 30 });
  };
  return block;
}

function buildOledRound() {
  const block = new BlockBuilder("OLED_round")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const w = generator.valueToCode(b, "width", generator.ORDER_ATOMIC);
      const h = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const round = generator.valueToCode(b, "round", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      if (b.getFieldValue("fill") === "TRUE") {
        return `display.fillRoundRect(${x}, ${y}, ${w}, ${h}, ${round},${draw});\n`;
      }
      return `display.drawRoundRect(${x}, ${y}, ${w}, ${h}, ${round},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️🔲");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendValueInput("width")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_width", "width"));
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField(displayLabel("OLED_height", "height"));
    this.appendValueInput("round")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("round");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill")
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 0 });
    attachShadowBlock(this, "width", "math_number", { NUM: 70 });
    attachShadowBlock(this, "height", "math_number", { NUM: 30 });
    attachShadowBlock(this, "round", "math_number", { NUM: 10 });
  };
  return block;
}

function buildOledCircle() {
  const block = new BlockBuilder("OLED_circle")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const r = generator.valueToCode(b, "width", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      if (b.getFieldValue("fill") === "TRUE") {
        return `display.fillCircle(${x}, ${y}, ${r},${draw});\n`;
      }
      return `display.drawCircle(${x}, ${y}, ${r},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️⚪");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y");
    this.appendValueInput("width")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("R");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill")
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 32 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 32 });
    attachShadowBlock(this, "width", "math_number", { NUM: 30 });
  };
  return block;
}

function buildOledTriangle() {
  const block = new BlockBuilder("OLED_triangle")
    .setCategory(OLED_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(OLED_LEVEL)
    .setTags(["displays", "oled", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl(OLED_HELP_URL)
    .setArduinoGenerator((b, generator) => {
      const x = generator.valueToCode(b, "X", generator.ORDER_ATOMIC);
      const y = generator.valueToCode(b, "Y", generator.ORDER_ATOMIC);
      const x1 = generator.valueToCode(b, "width", generator.ORDER_ATOMIC);
      const y1 = generator.valueToCode(b, "height", generator.ORDER_ATOMIC);
      const x2 = generator.valueToCode(b, "round", generator.ORDER_ATOMIC);
      const y2 = generator.valueToCode(b, "angle", generator.ORDER_ATOMIC);
      const draw = oledDrawColor(b);
      if (b.getFieldValue("fill") === "TRUE") {
        return `display.fillTriangle(${x}, ${y}, ${x1}, ${y1}, ${x2},${y2},${draw});\n`;
      }
      return `display.drawTriangle(${x}, ${y}, ${x1}, ${y1}, ${x2},${y2},${draw});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("🖥️📐");
    this.appendValueInput("X")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X0");
    this.appendValueInput("Y")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y0");
    this.appendValueInput("width")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X1");
    this.appendValueInput("height")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y1");
    this.appendValueInput("round")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("X2");
    this.appendValueInput("angle")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .setCheck("Number")
      .appendField("Y2");
    this.appendDummyInput()
      .appendField(displayLabel("ST7735_Drawfill", "fill"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "fill")
      .appendField(displayLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldCheckbox("TRUE"), "draw");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(OLED_HELP_URL);
    attachShadowBlock(this, "X", "math_number", { NUM: 30 });
    attachShadowBlock(this, "Y", "math_number", { NUM: 15 });
    attachShadowBlock(this, "width", "math_number", { NUM: 0 });
    attachShadowBlock(this, "height", "math_number", { NUM: 60 });
    attachShadowBlock(this, "round", "math_number", { NUM: 60 });
    attachShadowBlock(this, "angle", "math_number", { NUM: 60 });
  };
  return block;
}

export const OLED_BLOCKS = [
  buildOledInit(),
  buildOledInit2(),
  buildOledIcon(),
  buildOledDisplay(),
  buildOledClear(),
  buildOledRotate(),
  buildOledInvert(),
  buildOledScroll(),
  buildOledBitmap2(),
  buildOledData(),
  buildOledSymbol(),
  buildOledPixel(),
  buildOledLine(),
  buildOledRectangle(),
  buildOledRound(),
  buildOledCircle(),
  buildOledTriangle(),
];
