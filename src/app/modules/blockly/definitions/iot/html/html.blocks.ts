import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  HTML_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";
import { CATEGORY_PALETTE } from "../../../constants/category-palette.const";
import {
  appendToDefinitionBody,
  CSSEscape,
  iotLabel,
  looseEscape,
} from "../iot.helper";

const HTML_VAR_COLOR = CATEGORY_PALETTE.IOT_HTML_VAR;
const HTML_TEXT_COLOR = CATEGORY_PALETTE.IOT_HTML_TEXT;
const HTML_BLOCK_COLOR = CATEGORY_PALETTE.IOT_HTML_ELEMENT;
const HTML_TABLE_COLOR = CATEGORY_PALETTE.IOT_HTML_TABLE;
const HTML_STYLE_COLOR = CATEGORY_PALETTE.IOT_HTML_STYLE;
const HTML_FORM_COLOR = CATEGORY_PALETTE.IOT_HTML_FORM;

function buildEmptyVar() {
  const block = new BlockBuilder("emptyVar")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "variable"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const value = b.getFieldValue("VAR");
      return `)====="+${value}+R"=====(\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: Blockly.Msg["VARIABLES_DEFAULT_NAME"] || "item",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: HTML_VAR_COLOR,
    });
  };
  return block;
}

function buildEmptytext() {
  const block = new BlockBuilder("emptytext")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "text"])
    .setPreviousStatement("textcontainer")
    .setNextStatement("textcontainer")
    .setArduinoGenerator((b) => looseEscape(b.getFieldValue("content")))
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_input",
          name: "content",
          text: "inserte texto",
        },
      ],
      previousStatement: "textcontainer",
      nextStatement: "textcontainer",
      colour: HTML_TEXT_COLOR,
    });
  };
  return block;
}

function buildEspDigPin() {
  const block = new BlockBuilder("esp_dig_pin")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "measurement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const estado = generator.valueToCode(b, "estado", generator.ORDER_ATOMIC);
      return `)====="+${estado}+R"=====(\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(HTML_TEXT_COLOR);
    this.appendDummyInput().appendField("Medición: ");
    this.appendValueInput("estado");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildTextmod() {
  const block = new BlockBuilder("textmod")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "text"])
    .setPreviousStatement("textcontainer")
    .setNextStatement("textcontainer")
    .setArduinoGenerator((b, generator) => {
      const content = generator.statementToCode(b, "content");
      const type = b.getFieldValue("type");
      return `<${type}>${content}</${type}>`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "< %1 > %2 %3 </>",
      args0: [
        {
          type: "field_dropdown",
          name: "type",
          options: [
            ["gras", "strong"],
            ["italique", "em"],
          ],
        },
        { type: "input_dummy" },
        {
          type: "input_statement",
          name: "content",
        },
      ],
      previousStatement: "textcontainer",
      nextStatement: "textcontainer",
      colour: HTML_TEXT_COLOR,
    });
  };
  return block;
}

function buildParagraph() {
  const block = new BlockBuilder("paragraph")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html"])
    .setPreviousStatement("html")
    .setNextStatement("html")
    .setArduinoGenerator((b, generator) => {
      const statementsContent = generator.statementToCode(b, "content");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<p${blockModifier}>${statementsContent}</p>\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<p> %1 %2 </p>",
      args0: [
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: "textcontainer",
        },
      ],
      previousStatement: "html",
      nextStatement: "html",
      colour: HTML_BLOCK_COLOR,
    });
  };
  return block;
}

function buildHeader() {
  const block = new BlockBuilder("header")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html"])
    .setPreviousStatement("html")
    .setNextStatement("html")
    .setArduinoGenerator((b, generator) => {
      const statementsContent = generator.statementToCode(b, "content");
      const headerSize = b.getFieldValue("size");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<h${headerSize}${blockModifier}>${statementsContent}</h${headerSize}>\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<h %1 > %2 %3 </h>",
      args0: [
        {
          type: "field_dropdown",
          name: "size",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
          ],
        },
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: "textcontainer",
        },
      ],
      previousStatement: "html",
      nextStatement: "html",
      colour: HTML_BLOCK_COLOR,
    });
  };
  return block;
}

function buildLink() {
  const block = new BlockBuilder("link")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "text"])
    .setPreviousStatement("textcontainer")
    .setNextStatement("textcontainer")
    .setArduinoGenerator((b, generator) => {
      const text = generator.statementToCode(b, "content");
      const link = b.getFieldValue("target");
      return `<a href="${link}" target="_blank">${text}</a>`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<a href=%1 > %2 %3 </a>",
      args0: [
        {
          type: "field_input",
          name: "target",
          text: "http://",
        },
        { type: "input_dummy" },
        {
          type: "input_statement",
          name: "content",
          check: "textcontainer",
        },
      ],
      previousStatement: "textcontainer",
      nextStatement: "textcontainer",
      colour: HTML_TEXT_COLOR,
    });
  };
  return block;
}

function buildTable() {
  const block = new BlockBuilder("table")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "table"])
    .setPreviousStatement("html")
    .setNextStatement("html")
    .setArduinoGenerator((b, generator) => {
      const content = generator.statementToCode(b, "content");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<table${blockModifier}>${content}</table>");\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<table> %1 %2 </table>",
      args0: [
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: "table",
        },
      ],
      previousStatement: "html",
      nextStatement: "html",
      colour: HTML_TABLE_COLOR,
    });
  };
  return block;
}

function buildTablerow() {
  const block = new BlockBuilder("tablerow")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "table"])
    .setPreviousStatement("table")
    .setNextStatement("table")
    .setArduinoGenerator((b, generator) => {
      const content = generator.statementToCode(b, "content");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<tr${blockModifier}>${content}</tr>`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<tr> %1 %2 </tr>",
      args0: [
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: "tablerow",
        },
      ],
      previousStatement: "table",
      nextStatement: "table",
      colour: HTML_TABLE_COLOR,
    });
  };
  return block;
}

function buildTableheading() {
  const block = new BlockBuilder("tableheading")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "table"])
    .setPreviousStatement("tablerow")
    .setNextStatement("tablerow")
    .setArduinoGenerator((b, generator) => {
      const content = generator.statementToCode(b, "content");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<th${blockModifier}>${content}</th>`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<th> %1 %2 </th>",
      args0: [
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: ["html", "textcontainer"],
        },
      ],
      previousStatement: "tablerow",
      nextStatement: "tablerow",
      colour: HTML_TABLE_COLOR,
    });
  };
  return block;
}

function buildTabledata() {
  const block = new BlockBuilder("tabledata")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "table"])
    .setPreviousStatement("tablerow")
    .setNextStatement("tablerow")
    .setArduinoGenerator((b, generator) => {
      const content = generator.statementToCode(b, "content");
      const blockModifier = generator.statementToCode(b, "modifier");
      return `<td${blockModifier}>${content}</td>`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<td> %1 %2 </td>",
      args0: [
        {
          type: "input_value",
          name: "modifier",
          check: "attributes",
        },
        {
          type: "input_statement",
          name: "content",
          check: ["html", "textcontainer"],
        },
      ],
      previousStatement: "tablerow",
      nextStatement: "tablerow",
      colour: HTML_TABLE_COLOR,
    });
  };
  return block;
}

function buildImage() {
  const block = new BlockBuilder("image")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html"])
    .setPreviousStatement("html")
    .setNextStatement("html")
    .setArduinoGenerator((b) => {
      const source = b.getFieldValue("source");
      return `<img src="${source}">\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<img src=%1 >",
      args0: [
        {
          type: "field_input",
          name: "source",
          text: "http://lesormeaux.net/img/puzzle-piece.png",
        },
      ],
      previousStatement: "html",
      nextStatement: "html",
      colour: HTML_BLOCK_COLOR,
    });
  };
  return block;
}

function buildArgs() {
  const block = new BlockBuilder("args")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "style"])
    .setOutput("attributes")
    .setArduinoGenerator((b, generator) => {
      const code = generator.statementToCode(b, "content");
      return [`style="${code}"`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "style : %1 %2",
      args0: [
        { type: "input_dummy" },
        {
          type: "input_statement",
          name: "content",
          check: "stylecontent",
        },
      ],
      colour: HTML_STYLE_COLOR,
      output: "attributes",
    });
  };
  return block;
}

function buildColor() {
  const block = new BlockBuilder("color")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "style"])
    .setPreviousStatement("stylecontent")
    .setNextStatement("stylecontent")
    .setArduinoGenerator((b) => {
      const color = b.getFieldValue("value");
      return `color : ${color} ; `;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "color: %1 ;",
      args0: [
        {
          type: "field_colour",
          name: "value",
          colour: "#FF0000",
        },
      ],
      previousStatement: "stylecontent",
      nextStatement: "stylecontent",
      colour: HTML_STYLE_COLOR,
    });
  };
  return block;
}

function buildBgcolor() {
  const block = new BlockBuilder("bgcolor")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "style"])
    .setPreviousStatement("stylecontent")
    .setNextStatement("stylecontent")
    .setArduinoGenerator((b) => {
      const color = b.getFieldValue("value");
      return `background-color : ${color} ; `;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "background-color: %1 ;",
      args0: [
        {
          type: "field_colour",
          name: "value",
          colour: "#339999",
        },
      ],
      previousStatement: "stylecontent",
      nextStatement: "stylecontent",
      colour: HTML_STYLE_COLOR,
    });
  };
  return block;
}

function buildTextalign() {
  const block = new BlockBuilder("textalign")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "style"])
    .setPreviousStatement("stylecontent")
    .setNextStatement("stylecontent")
    .setArduinoGenerator((b) => {
      const value = b.getFieldValue("value");
      return `text-align : ${value} ; `;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "text-align: %1 ;",
      args0: [
        {
          type: "field_dropdown",
          name: "value",
          options: [
            ["center", "center"],
            ["left", "left"],
            ["right", "right"],
          ],
        },
      ],
      previousStatement: "stylecontent",
      nextStatement: "stylecontent",
      colour: HTML_STYLE_COLOR,
    });
  };
  return block;
}

function buildBorder() {
  const block = new BlockBuilder("border")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "style"])
    .setPreviousStatement("stylecontent")
    .setNextStatement("stylecontent")
    .setArduinoGenerator((b) => {
      const width = CSSEscape(String(b.getFieldValue("width")));
      const type = b.getFieldValue("type");
      const color = b.getFieldValue("color");
      return `border : ${width}px ${type} ${color} ; `;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "border: %1 px %2 %3 ;",
      args0: [
        {
          type: "field_number",
          name: "width",
          value: 2,
          min: 1,
        },
        {
          type: "field_dropdown",
          name: "type",
          options: [
            ["solid", "solid"],
            ["dotted", "dotted"],
            ["dashed", "dashed"],
            ["double", "double"],
          ],
        },
        {
          type: "field_colour",
          name: "color",
          colour: "#000000",
        },
      ],
      previousStatement: "stylecontent",
      nextStatement: "stylecontent",
      colour: HTML_STYLE_COLOR,
    });
  };
  return block;
}

function buildInput() {
  const block = new BlockBuilder("input")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "form"])
    .setPreviousStatement("form")
    .setNextStatement("form")
    .setArduinoGenerator((b) => {
      const type = b.getFieldValue("type");
      const name = looseEscape(b.getFieldValue("name"));
      const value = looseEscape(b.getFieldValue("value"));
      return `<input type="${type}" name="${name}" value="${value}" name="${value}">`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<input type=%1 name=%2 value=%3>",
      args0: [
        {
          type: "field_dropdown",
          name: "type",
          options: [
            ["checkbox", "checkbox"],
            ["radio", "radio"],
            ["submit", "submit"],
            ["text", "text"],
          ],
        },
        {
          type: "field_input",
          name: "name",
          text: "",
        },
        {
          type: "field_input",
          name: "value",
          text: "",
        },
      ],
      previousStatement: "form",
      nextStatement: "form",
      colour: HTML_FORM_COLOR,
    });
  };
  return block;
}

function buildForm() {
  const block = new BlockBuilder("form")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "form"])
    .setPreviousStatement("html")
    .setNextStatement("html")
    .setArduinoGenerator((b, generator) => {
      const action = b.getFieldValue("action");
      const method = b.getFieldValue("method");
      const content = generator.statementToCode(b, "content");
      return `<form action="${action}" method="${method}">\n${content}\n</form>\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<form action=%1 method=%2> %3 %4 </form>",
      args0: [
        {
          type: "field_input",
          name: "action",
          text: "/",
        },
        {
          type: "field_dropdown",
          name: "method",
          options: [
            ["GET", "GET"],
            ["POST", "POST"],
            ["PUT", "PUT"],
          ],
        },
        { type: "input_dummy" },
        {
          type: "input_statement",
          name: "content",
          check: "form",
        },
      ],
      previousStatement: "html",
      nextStatement: "html",
      colour: HTML_FORM_COLOR,
    });
  };
  return block;
}

function buildLabel() {
  const block = new BlockBuilder("label")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "form"])
    .setPreviousStatement("form")
    .setNextStatement("form")
    .setArduinoGenerator((b) => {
      const content = looseEscape(b.getFieldValue("value"));
      const forValue = b.getFieldValue("for");
      return `<label for=${forValue}>${content}</label>\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<label for=%1> %2 </label>",
      args0: [
        {
          type: "field_input",
          name: "for",
          text: "",
        },
        {
          type: "field_input",
          name: "value",
          text: "",
        },
      ],
      previousStatement: "form",
      nextStatement: "form",
      colour: HTML_FORM_COLOR,
    });
  };
  return block;
}

function buildBr() {
  const block = new BlockBuilder("br")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html"])
    .setPreviousStatement(null)
    .setNextStatement(null)
    .setArduinoGenerator(() => "<br>")
    .build();

  block.init = function (this: Blockly.Block) {
    this.jsonInit({
      message0: "<br>",
      previousStatement: null,
      nextStatement: null,
      colour: HTML_BLOCK_COLOR,
    });
  };
  return block;
}

function buildEsp8266Html() {
  const block = new BlockBuilder("esp8266_html")
    .setCategory(HTML_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "html", "page"])
    .setArduinoGenerator((b, generator) => {
      const htmlHead = b.getFieldValue("HEAD");
      const htmlBody = generator.statementToCode(b, "BODY");
      appendToDefinitionBody(
        generator,
        `esp8266_pag${htmlHead}`,
        `String p${htmlHead}(){\nString cadena=(String) R"=====(\n` +
          `<!DOCTYPE HTML>\n` +
          ` <html>\n<head><title>${htmlHead}</title></head>\n<body>\n` +
          htmlBody +
          `\n</body>\n</html>\n` +
          `)=====";\n return cadena;\n}\n `
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(HTML_FORM_COLOR);
    this.setHelpUrl(iotLabel("esp8266_url", ""));
    this.appendDummyInput()
      .appendField(iotLabel("esp8266_html_webpage", "Name of the HTML page:"))
      .appendField(new Blockly.FieldTextInput("Name xxxxx"), "HEAD");
    this.appendStatementInput("BODY");
    this.setTooltip(iotLabel("esp8266_html_tooltip", ""));
  };
  return block;
}

export const HTML_BLOCKS = [
  buildEmptyVar(),
  buildEmptytext(),
  buildEspDigPin(),
  buildTextmod(),
  buildParagraph(),
  buildHeader(),
  buildLink(),
  buildTable(),
  buildTablerow(),
  buildTableheading(),
  buildTabledata(),
  buildImage(),
  buildArgs(),
  buildColor(),
  buildBgcolor(),
  buildTextalign(),
  buildBorder(),
  buildInput(),
  buildForm(),
  buildLabel(),
  buildBr(),
  buildEsp8266Html(),
];
