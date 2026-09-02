import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  WIFI_SERVER_ASYNC_COLOR,
  WIFISERVER_CATEGORY,
} from "../config";
import {
  appendToDefinitionBody,
  createBlockIconField,
  iotLabel,
  isOttoEspBoard,
  registerGlobal,
  registerSetup,
} from "../iot.helper";

const WIFI_ICON = "wifi.png";

function setEsp8266BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp8266"] };
}

function buildWifiserverPort() {
  const block = new BlockBuilder("wifiserver_port")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const serverPort =
        generator.valueToCode(b, "server_port", generator.ORDER_ATOMIC) || "80";
      registerGlobal(
        generator,
        "define_wifiserver_port",
        `WiFiServer server(${serverPort});\n`
      );
      return "server.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(iotLabel("WifiServer_port", "Wifi server begin in port"));
    this.appendValueInput("server_port").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Init the internal web server in the defined port number in the block"
    );
    attachShadowBlock(this, "server_port", "math_number", { NUM: 80 });
  };
  return block;
}

function buildWifiserverWaitconnection() {
  const block = new BlockBuilder("wifiserver_waitconnection")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator(() =>
      [
        "WiFiClient client = server.available();\n",
        "if (!client) { return; }\n",
        "while(!client.available()){  delay(1); }\n",
      ].join("")
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(iotLabel("WifiServer_wait", "Wait connections of clients"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Wait connection into the internal server");
  };
  return block;
}

function buildWifiserverAnswer() {
  const block = new BlockBuilder("wifiserver_answer")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const serverAnswer =
        generator.valueToCode(b, "server_answer", generator.ORDER_ATOMIC) ||
        '""';
      return (
        'client.println("HTTP/1.1 200 OK");\n' +
        'client.println("Content-Type: text/html");\n' +
        'client.println("");\n' +
        'client.println("<!DOCTYPE HTML>");\n' +
        'client.println("<html>");\n' +
        `client.println(${serverAnswer});\n` +
        'client.println("</html>");\n' +
        "delay(1);\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(iotLabel("WifiServer_answer", "Wifi server answer:"));
    this.appendValueInput("server_answer").setCheck("String");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Answer text. Our server respond to any customer this text"
    );
    attachShadowBlock(this, "server_answer", "text", { TEXT: "" });
  };
  return block;
}

function buildWifiserverStop() {
  const block = new BlockBuilder("wifiserver_stop")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator(() => "client.stop();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_stop",
          "Stop the connected client to the our server"
        )
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Stop connected client");
  };
  return block;
}

function buildWifiserverFlush() {
  const block = new BlockBuilder("wifiserver_flush")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator(() => "client.flush();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_flush",
          "Flush the connected client to the our server"
        )
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("flush connected client");
  };
  return block;
}

function buildWifiserverIp() {
  const block = new BlockBuilder("wifiserver_ip")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "client.remoteIP()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(iotLabel("WifiServer_ip", "IP of the connected customer"));
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the ip of the connected customer");
  };
  return block;
}

function buildWifiserverRequest() {
  const block = new BlockBuilder("wifiserver_request")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "client.readStringUntil('\\r')",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel("WifiServer_request", "Request of the connected customer")
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the request of the connected customer");
  };
  return block;
}

function buildWifiserverPortLibrary() {
  const block = new BlockBuilder("wifiserver_port_library")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const serverPort =
        generator.valueToCode(b, "server_port", generator.ORDER_ATOMIC) || "80";
      registerInclude(
        generator,
        "ESP8266WebServer.h",
        "ESP8266 synchronous web server."
      );
      registerGlobal(
        generator,
        "define_wifiserver_port",
        `ESP8266WebServer server(${serverPort});\n`
      );
      return "server.begin();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_port",
          "Wifi AsynWebServer begin in port"
        )
      );
    this.appendValueInput("server_port").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Init the internal web server in the defined port number in the block using the library ESP8266 WebServer"
    );
    attachShadowBlock(this, "server_port", "math_number", { NUM: 80 });
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEsp8266GetArg() {
  const block = new BlockBuilder("esp8266_getArg")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const arg = b.getFieldValue("arg");
      return `String ${arg}=server.arg("${arg}");\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_parameter",
          "AsynWebServer Read the parameter: "
        )
      )
      .appendField(new Blockly.FieldTextInput("xxxxx"), "arg");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(iotLabel("esp8266_html_tooltip", ""));
    this.setHelpUrl(iotLabel("esp8266_url", ""));
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEsp8266UseArg() {
  const block = new BlockBuilder("esp8266_useArg")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "esp8266"])
    .setOutput(null)
    .setArduinoGenerator((b, generator) => [
      b.getFieldValue("arg"),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_parameter2",
          "AsynWebServer Parameter: "
        )
      )
      .appendField(new Blockly.FieldTextInput("xxxxx"), "arg");
    this.setOutput(true, null);
    this.setTooltip(iotLabel("esp8266_html_tooltip", ""));
    this.setHelpUrl(iotLabel("esp8266_url", ""));
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEsp8266Send() {
  const block = new BlockBuilder("esp8266_send")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "esp8266", "html"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pagina = b.getFieldValue("text");
      const direccion = b.getFieldValue("address");
      const ordenes = generator.statementToCode(b, "ORDERS");
      appendToDefinitionBody(
        generator,
        `esp8266_server${pagina}`,
        `void serve${pagina}() {\nserver.send(200,"text/html",p${pagina}());\n${ordenes}\n}\n`
      );
      registerSetup(
        generator,
        `esp8266_query${pagina}`,
        `server.on("/${direccion}",serve${pagina});`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_esp8266_send_html_URL",
          "When a client with this URL (empty for root):"
        )
      )
      .appendField(new Blockly.FieldTextInput(""), "address");
    this.appendDummyInput()
      .appendField(
        iotLabel(
          "WifiServer_esp8266_send_html_HTML_page",
          "is connected then show this HTML page: "
        )
      )
      .appendField(
        new Blockly.FieldTextInput(
          iotLabel("esp8266_send_html_title", "page")
        ),
        "text"
      );
    this.appendDummyInput().appendField(
      iotLabel("WifiServer_esp8266_send_html_execute", "(optional) and do: ")
    );
    this.appendStatementInput("ORDERS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(iotLabel("esp8266_url", ""));
    this.setTooltip(iotLabel("esp8266_send_html_tooltip", ""));
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEsp8266HandleRequest() {
  const block = new BlockBuilder("esp8266_handle_request")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator(() => "server.handleClient();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel("WifiServer_esp8266_manage_requets", "Manage client request")
      );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Handle requests of clients");
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildWifiserverPortAsynLibrary() {
  const block = new BlockBuilder("wifiserver_port_asyn_library")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "async"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const serverPort =
        generator.valueToCode(b, "server_port", generator.ORDER_ATOMIC) || "80";
      if (isOttoEspBoard()) {
        registerInclude(generator, "ESPAsyncTCP.h", "Async TCP for ESP8266.");
      } else {
        registerInclude(generator, "AsyncTCP.h", "Async TCP for ESP32.");
      }
      registerInclude(
        generator,
        "ESPAsyncWebServer.h",
        "Async web server library."
      );
      registerInclude(generator, "AsyncElegantOTA.h", "OTA updates over WiFi.");
      registerGlobal(
        generator,
        "define_wifiserver_port",
        `AsyncWebServer server(${serverPort});\n`
      );
      return (
        "AsyncElegantOTA.begin(&server); //Start ElegantOTA \n" +
        "server.begin();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_port",
          "Wifi AsynWebServer begin in port"
        )
      );
    this.appendValueInput("server_port").setCheck("Number");
    this.appendDummyInput().appendField(
      iotLabel("WifiServer_ESP8266webserver_OTA", "OTA is enabled")
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Init the internal asyn web server in the defined port number in the block using the library ESPAsyncWebServer. You can not use these block if you are using other web server library"
    );
    attachShadowBlock(this, "server_port", "math_number", { NUM: 80 });
  };
  return block;
}

function buildEsp8266AsyngetArg() {
  const block = new BlockBuilder("esp8266_asyngetArg")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "async"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const arg = b.getFieldValue("arg");
      return `String ${arg}=request->arg("${arg}");\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_parameter",
          "AsynWebServer Read the parameter: "
        )
      )
      .appendField(new Blockly.FieldTextInput("xxxxx"), "arg");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(iotLabel("esp8266_html_tooltip", ""));
    this.setHelpUrl(iotLabel("esp8266_url", ""));
  };
  return block;
}

function buildEsp8266AsynuseArg() {
  const block = new BlockBuilder("esp8266_asynuseArg")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "async"])
    .setOutput(null)
    .setArduinoGenerator((b, generator) => [
      b.getFieldValue("arg"),
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_ESP8266webserver_parameter2",
          "AsynWebServer Parameter: "
        )
      )
      .appendField(new Blockly.FieldTextInput("xxxxx"), "arg");
    this.setOutput(true, null);
    this.setTooltip(iotLabel("esp8266_html_tooltip", ""));
    this.setHelpUrl(iotLabel("esp8266_url", ""));
  };
  return block;
}

function buildEsp8266Asynsend() {
  const block = new BlockBuilder("esp8266_asynsend")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "async", "html"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pagina = b.getFieldValue("text");
      const direccion = b.getFieldValue("address");
      const ordenes = generator.statementToCode(b, "ORDERS");
      appendToDefinitionBody(
        generator,
        `esp8266_asynserver${pagina}`,
        `void serve${pagina}(AsyncWebServerRequest *request) {\nrequest->send(200,"text/html",p${pagina}());\n${ordenes}\n}\n`
      );
      registerSetup(
        generator,
        `esp8266_asynquery${pagina}`,
        `server.on("/${direccion}",HTTP_GET,serve${pagina});`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_esp8266_send_html_URL",
          "When a client with this URL (empty for root):"
        )
      )
      .appendField(new Blockly.FieldTextInput(""), "address");
    this.appendDummyInput()
      .appendField(
        iotLabel(
          "WifiServer_esp8266_send_html_HTML_page",
          "is connected then show this HTML page: "
        )
      )
      .appendField(
        new Blockly.FieldTextInput(
          iotLabel("esp8266_send_html_title", "page")
        ),
        "text"
      );
    this.appendDummyInput().appendField(
      iotLabel("WifiServer_esp8266_send_html_execute", "(optional) and do: ")
    );
    this.appendStatementInput("ORDERS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(iotLabel("esp8266_url", ""));
    this.setTooltip(iotLabel("esp8266_send_html_tooltip", ""));
  };
  return block;
}

function buildEsp8266AsynsendText() {
  const block = new BlockBuilder("esp8266_asynsend_text")
    .setCategory(WIFISERVER_CATEGORY)
    .setColor(WIFI_SERVER_ASYNC_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "server", "async"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const direccion = b.getFieldValue("address");
      const answerText =
        generator.valueToCode(b, "server_answer", generator.ORDER_ATOMIC) ||
        '""';
      registerSetup(
        generator,
        `esp8266_asynquery${direccion}`,
        `server.on("/${direccion}",HTTP_GET,[](AsyncWebServerRequest *request) {request->send(200, "text/plain",${answerText} );});`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(WIFI_SERVER_ASYNC_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(WIFI_ICON))
      .appendField(
        iotLabel(
          "WifiServer_esp8266_send_html_URL",
          "When a client with this URL (empty for root):"
        )
      )
      .appendField(new Blockly.FieldTextInput(""), "address");
    this.appendDummyInput().appendField(
      iotLabel("WifiServer_esp8266_send_text", "is connected then show this text: ")
    );
    this.appendValueInput("server_answer").setCheck("String");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl(iotLabel("esp8266_url", ""));
    this.setTooltip(iotLabel("esp8266_send_html_tooltip", ""));
    attachShadowBlock(this, "server_answer", "text", { TEXT: "" });
  };
  return block;
}

export const WIFISERVER_BLOCKS = [
  buildWifiserverPort(),
  buildWifiserverWaitconnection(),
  buildWifiserverAnswer(),
  buildWifiserverStop(),
  buildWifiserverFlush(),
  buildWifiserverIp(),
  buildWifiserverRequest(),
  buildWifiserverPortLibrary(),
  buildEsp8266GetArg(),
  buildEsp8266UseArg(),
  buildEsp8266Send(),
  buildEsp8266HandleRequest(),
  buildWifiserverPortAsynLibrary(),
  buildEsp8266AsyngetArg(),
  buildEsp8266AsynuseArg(),
  buildEsp8266Asynsend(),
  buildEsp8266AsynsendText(),
];
