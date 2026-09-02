import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  ESPNOW_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";
import {
  appendToDefinitionBody,
  createBlockIconField,
  iotLabel,
  isOttoEspBoard,
  registerGlobal,
  registerSetup,
} from "../iot.helper";

const ESPNOW_ICON = "EspNow.png";

function setEsp8266BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp8266"] };
}

function setEsp32BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp32"] };
}

const ESPNOW_ESP32_VARIABLES =
  "uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};\n" +
  "unsigned int IncomingIdNode;\n" +
  "unsigned int IncomingParamInt;\n" +
  "float IncomingParamFloat;\n" +
  "char IncomingParamText[24];\n" +
  "\n" +
  "//Structure\n" +
  "typedef struct struct_message {\n" +
  "  unsigned int node;\n" +
  "  unsigned int ParamInt;\n" +
  "  float ParamFloat;\n" +
  " char ParamText[24];\n" +
  "} struct_message;\n" +
  "\n" +
  "// Create a struct_message to send\n" +
  "struct_message OutputStruct;\n" +
  "\n" +
  "// Create a struct_message to hold incoming readings\n" +
  "struct_message incomingReadings;\n" +
  "\n" +
  "//Varaibles for manage espnow\n" +
  "String success;\n" +
  "\n" +
  "esp_now_peer_info_t peerInfo;\n";

const ESPNOW_ESP8266_VARIABLES =
  "uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};\n" +
  "unsigned int IncomingIdNode;\n" +
  "unsigned int IncomingParamInt;\n" +
  "float IncomingParamFloat;\n" +
  "char IncomingParamText[24];\n" +
  "\n" +
  "//Structure\n" +
  "typedef struct struct_message {\n" +
  "  unsigned int node;\n" +
  "  unsigned int ParamInt;\n" +
  "  float ParamFloat;\n" +
  " char ParamText[24];\n" +
  "} struct_message;\n" +
  "\n" +
  "// Create a struct_message to send\n" +
  "struct_message OutputStruct;\n" +
  "\n" +
  "// Create a struct_message to hold incoming readings\n" +
  "struct_message incomingReadings;\n" +
  "\n" +
  "//Varaibles for manage espnow\n" +
  "String success;\n";

function buildEspnowInitEsp32() {
  const block = new BlockBuilder("espnow_init_esp32")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "init", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const idNode =
        generator.valueToCode(b, "id_node", generator.ORDER_ATOMIC) || "1";
      registerInclude(generator, "esp_now.h", "ESP-NOW protocol for ESP32.");
      registerInclude(generator, "WiFi.h", "WiFi library for ESP32.");
      registerGlobal(
        generator,
        "define_espnow_variables",
        ESPNOW_ESP32_VARIABLES
      );
      appendToDefinitionBody(
        generator,
        "define_espnow_OnDataSent",
        'void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {\n' +
          ' Serial.print("Last Packet Send Status: ");\n' +
          ' Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");\n' +
          " if (status ==0){\n" +
          '   success = "Delivery Success :)";\n' +
          "  }\n" +
          " else{\n" +
          '    success = "Delivery Fail :(";\n' +
          "  }\n" +
          "}\n"
      );
      appendToDefinitionBody(
        generator,
        "define_espnow_esp32_AddPeer",
        "void Add_peer(uint8_t broadcastAddress[]) {\n" +
          "  peerInfo.channel = 0;  \n" +
          "  peerInfo.encrypt = false;\n" +
          "  memcpy(peerInfo.peer_addr, broadcastAddress, 6);\n" +
          "  // Add peer  \n" +
          "  if (esp_now_add_peer(&peerInfo) != ESP_OK){\n" +
          '   Serial.println("Failed to add peer1");\n' +
          "   return;\n" +
          " } \n" +
          "}\n"
      );
      registerSetup(
        generator,
        "setup_espnow",
        "Serial.begin(115200);\n" +
          "// Set device as a Wi-Fi Station\n" +
          "WiFi.mode(WIFI_STA);\n" +
          "\n" +
          "// Init ESP-NOW\n" +
          "if (esp_now_init() != ESP_OK) {\n" +
          '  Serial.println("Error initializing ESP-NOW");\n' +
          "  return;\n" +
          "}\n" +
          "\n" +
          "// Internal node.To avoid use MAC address we have created the node id into the structure.The rest param of the structure are filled with a default values\n" +
          `OutputStruct.node=${idNode};\n` +
          "OutputStruct.ParamInt=0;\n" +
          "OutputStruct.ParamFloat=0.0;\n" +
          `strcpy(OutputStruct.ParamText, "Hello from node: ${idNode}");\n` +
          "\n" +
          " // Once ESPNow is successfully Init, we will register for Send CB to get the status of Trasnmitted packet\n" +
          "esp_now_register_send_cb(OnDataSent);\n"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_init", "Init the protocol. Node"));
    this.appendValueInput("id_node").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the espnow protocol for esp32 board");
    attachShadowBlock(this, "id_node", "math_number", { NUM: 1 });
  };
  setEsp32BoardMetadata(block);
  return block;
}

function buildEspnowInitEsp8266() {
  const block = new BlockBuilder("espnow_init_esp8266")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "init", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const idNode =
        generator.valueToCode(b, "id_node", generator.ORDER_ATOMIC) || "1";
      registerInclude(generator, "espnow.h", "ESP-NOW protocol for ESP8266.");
      registerInclude(
        generator,
        "ESP8266WiFi.h",
        "WiFi library for ESP8266."
      );
      registerGlobal(
        generator,
        "define_espnow_esp8266_variables",
        ESPNOW_ESP8266_VARIABLES
      );
      appendToDefinitionBody(
        generator,
        "define_espnow_esp8266_OnDataSent",
        "void OnDataSent(uint8_t *mac_addr, uint8_t sendStatus) {\n" +
          ' Serial.print("Last Packet Send Status: ");\n' +
          " if (sendStatus == 0){\n" +
          '   Serial.println("Delivery success");\n' +
          "  }\n" +
          "  else{\n" +
          '   Serial.println("Delivery fail");\n' +
          " }\n" +
          "}\n"
      );
      registerSetup(
        generator,
        "setup_espnow",
        "Serial.begin(115200);\n" +
          "// Set device as a Wi-Fi Station\n" +
          "WiFi.mode(WIFI_STA);\n" +
          "\n" +
          "// Init ESP-NOW\n" +
          "if (esp_now_init() != 0) {\n" +
          '  Serial.println("Error initializing ESP-NOW");\n' +
          "  return;\n" +
          "}\n" +
          "// Set ESP-NOW Role\n" +
          "esp_now_set_self_role(ESP_NOW_ROLE_COMBO);\n" +
          "\n" +
          "// Internal node.To avoid use MAC address we have created the node id into the structure.The rest param of the structure are filled with a default values\n" +
          `OutputStruct.node=${idNode};\n` +
          "OutputStruct.ParamInt=0;\n" +
          "OutputStruct.ParamFloat=0.0;\n" +
          `strcpy(OutputStruct.ParamText, "Hello from node: ${idNode}");\n` +
          "\n" +
          " // Once ESPNow is successfully Init, we will register for Send CB to get the status of Trasnmitted packet\n" +
          "esp_now_register_send_cb(OnDataSent);\n"
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_init", "Init the protocol. Node"));
    this.appendValueInput("id_node").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the espnow protocol for esp8266 boards");
    attachShadowBlock(this, "id_node", "math_number", { NUM: 1 });
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEspnowReceptionFunction() {
  const block = new BlockBuilder("espnow_reception_function")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "callback", "esp32"])
    .setArduinoGenerator((b, generator) => {
      const branch = generator.statementToCode(b, "DO");
      registerSetup(
        generator,
        "setup_espnow_esp32_recepcion_callback",
        "// Register for a callback function that will be called when data is received\n" +
          "esp_now_register_recv_cb(OnDataRecv);\n"
      );
      generator.codeFunctions_["esp_reception_function"] =
        'void OnDataRecv(const uint8_t * mac_addr, const uint8_t *incomingData, int len) {\n' +
        "char macStr[18];\n" +
        'Serial.print("Packet from: ");\n' +
        "// Copies the sender mac address to a string\n" +
        'snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",\n' +
        "          mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);\n" +
        "Serial.print(macStr);\n" +
        "memcpy(&incomingReadings, incomingData, sizeof(incomingReadings));\n" +
        'Serial.print("Bytes received: ");\n' +
        "Serial.println(len);\n" +
        "IncomingIdNode = incomingReadings.node;\n" +
        "IncomingParamInt = incomingReadings.ParamInt;\n" +
        "IncomingParamFloat = incomingReadings.ParamFloat;\n" +
        "strcpy(IncomingParamText,incomingReadings.ParamText);\n" +
        "\n" +
        branch +
        "}\n";
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(
        iotLabel("ESPNOW_msg_received", "When a message is received")
      );
    this.appendStatementInput("DO").appendField(
      Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do"
    );
    this.setInputsInline(false);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setHelpUrl(Blockly.Msg["HELPURL"] || "");
  };
  setEsp32BoardMetadata(block);
  return block;
}

function buildEspnowEsp8266ReceptionFunction() {
  const block = new BlockBuilder("espnow_esp8266_reception_function")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "callback", "esp8266"])
    .setArduinoGenerator((b, generator) => {
      const branch = generator.statementToCode(b, "DO");
      registerSetup(
        generator,
        "setup_espnow_esp32_recepcion_callback",
        "// Register for a callback function that will be called when data is received\n" +
          "esp_now_register_recv_cb(OnDataRecv);\n"
      );
      generator.codeFunctions_["esp_reception_function"] =
        "void OnDataRecv(uint8_t * mac_addr, uint8_t *incomingData, uint8_t len) {\n" +
        "char macStr[18];\n" +
        'Serial.print("Packet from: ");\n' +
        "// Copies the sender mac address to a string\n" +
        'snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",\n' +
        "          mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);\n" +
        "Serial.print(macStr);\n" +
        "memcpy(&incomingReadings, incomingData, sizeof(incomingReadings));\n" +
        'Serial.print("Bytes received: ");\n' +
        "Serial.println(len);\n" +
        "IncomingIdNode = incomingReadings.node;\n" +
        "IncomingParamInt = incomingReadings.ParamInt;\n" +
        "IncomingParamFloat = incomingReadings.ParamFloat;\n" +
        "strcpy(IncomingParamText,incomingReadings.ParamText);\n" +
        "\n" +
        branch +
        "}\n";
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(
        iotLabel("ESPNOW_msg_received", "When a message is received")
      );
    this.appendStatementInput("DO").appendField(
      Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do"
    );
    this.setInputsInline(false);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setHelpUrl(Blockly.Msg["HELPURL"] || "");
  };
  setEsp8266BoardMetadata(block);
  return block;
}

function buildEspnowSendmessageAll() {
  const block = new BlockBuilder("espnow_sendmessage_all")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "send"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => {
      if (isOttoEspBoard()) {
        registerSetup(
          generator,
          "setup_espnow_add_peer",
          "//Register peer to all nodes \n" +
            "broadcastAddress[0]=0xFF; broadcastAddress[1]=0xFF; broadcastAddress[2]=0xFF; broadcastAddress[3]=0xFF; broadcastAddress[4]=0xFF; broadcastAddress[5]=0xFF;\n" +
            "esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0);\n"
        );
      } else {
        registerSetup(
          generator,
          "setup_espnow_add_peer",
          "//Register peer to all nodes \n" +
            "broadcastAddress[0]=0xFF; broadcastAddress[1]=0xFF; broadcastAddress[2]=0xFF; broadcastAddress[3]=0xFF; broadcastAddress[4]=0xFF; broadcastAddress[5]=0xFF;\n" +
            "Add_peer(broadcastAddress);\n"
        );
      }
      return (
        "// Send message via ESP-NOW\n" +
        "broadcastAddress[0]=0xFF; broadcastAddress[1]=0xFF; broadcastAddress[2]=0xFF; broadcastAddress[3]=0xFF; broadcastAddress[4]=0xFF; broadcastAddress[5]=0xFF;\n" +
        "esp_now_send(broadcastAddress, (uint8_t *) &OutputStruct, sizeof(OutputStruct));\n" +
        "delay(500);\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_send_all", "Send the message to all nodes."));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Send message to all nodes");
  };
  return block;
}

function buildEspnowSendmessageMac() {
  const block = new BlockBuilder("espnow_sendmessage_mac")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "send"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const mac1 = b.getFieldValue("mac1");
      const mac2 = b.getFieldValue("mac2");
      const mac3 = b.getFieldValue("mac3");
      const mac4 = b.getFieldValue("mac4");
      const mac5 = b.getFieldValue("mac5");
      const mac6 = b.getFieldValue("mac6");
      const peerSetup =
        `broadcastAddress[0]=${mac1}; broadcastAddress[1]=${mac2}; broadcastAddress[2]=${mac3}; broadcastAddress[3]=${mac4}; broadcastAddress[4]=${mac5}; broadcastAddress[5]=${mac6};\n`;
      if (isOttoEspBoard()) {
        registerSetup(
          generator,
          `setup_espnow_add_peer${mac1}${mac2}`,
          "//Register peer to all nodes \n" +
            peerSetup +
            "esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0);\n"
        );
      } else {
        registerSetup(
          generator,
          `setup_espnow_add_peer${mac1}${mac2}`,
          "//Register peer to all nodes \n" +
            peerSetup +
            "Add_peer(broadcastAddress);\n"
        );
      }
      return (
        "// Send message via ESP-NOW\n" +
        peerSetup +
        "esp_now_send(broadcastAddress, (uint8_t *) &OutputStruct, sizeof(OutputStruct));\n" +
        "delay(500);\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_send_mac", "Send the message to the mac: "));
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac1")
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac2")
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac3")
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac4")
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac5")
      .appendField(new Blockly.FieldTextInput("0xFF"), "mac6");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Send message to the node with this MAC");
  };
  return block;
}

function buildEspnowParamTextRefund() {
  const block = new BlockBuilder("espnow_paramText_refund")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "read"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "IncomingParamText",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_read_param_text", "Param Text received"));
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the param text of the structure");
  };
  return block;
}

function buildEspnowParamNodeRefund() {
  const block = new BlockBuilder("espnow_paramNode_refund")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "read"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "IncomingIdNode",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_read_node", "Id node received"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the node ID of the structure");
  };
  return block;
}

function buildEspnowParamIntRefund() {
  const block = new BlockBuilder("espnow_paramInt_refund")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "read"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "IncomingParamInt",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_read_param_int", "Param Int received"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the integer param of the structure");
  };
  return block;
}

function buildEspnowParamFloatRefund() {
  const block = new BlockBuilder("espnow_paramFloat_refund")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "read"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "IncomingParamFloat",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(iotLabel("ESPNOW_read_param_float", "Param Float received"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the float param of the structure");
  };
  return block;
}

function buildEspnowParamIntFill() {
  const block = new BlockBuilder("espnow_paramInt_fill")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "write"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const paramInt =
        generator.valueToCode(b, "ParamInt", generator.ORDER_ATOMIC) || "0";
      return `OutputStruct.ParamInt=${paramInt};\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(
        iotLabel("ESPNOW_fill_int", "Fill the Int param of the struct to:")
      );
    this.appendValueInput("ParamInt").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Fill the Node param of the structure");
    attachShadowBlock(this, "ParamInt", "math_number", { NUM: 0 });
  };
  return block;
}

function buildEspnowParamFloatFill() {
  const block = new BlockBuilder("espnow_paramFloat_fill")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "write"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const paramFloat =
        generator.valueToCode(b, "ParamFloat", generator.ORDER_ATOMIC) || "0";
      return `OutputStruct.ParamFloat=${paramFloat};\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(
        iotLabel("ESPNOW_fill_float", "Fill the Float param of the struct to:")
      );
    this.appendValueInput("ParamFloat").setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Fill the Node param of the structure");
    attachShadowBlock(this, "ParamFloat", "math_number", { NUM: 0 });
  };
  return block;
}

function buildEspnowParamTextFill() {
  const block = new BlockBuilder("espnow_paramText_fill")
    .setCategory(ESPNOW_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "espnow", "write"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const paramText =
        generator.valueToCode(b, "ParamText", generator.ORDER_ATOMIC) || '""';
      return `strcpy(OutputStruct.ParamText,${paramText});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(ESPNOW_ICON, "wide"))
      .appendField(
        iotLabel("ESPNOW_fill_text", "Fill the Text param of the struct to:")
      );
    this.appendValueInput("ParamText").setCheck("String");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Fill the Node param of the structure");
    attachShadowBlock(this, "ParamText", "text", { TEXT: "" });
  };
  return block;
}

export const ESPNOW_BLOCKS = [
  buildEspnowInitEsp32(),
  buildEspnowInitEsp8266(),
  buildEspnowReceptionFunction(),
  buildEspnowEsp8266ReceptionFunction(),
  buildEspnowSendmessageAll(),
  buildEspnowSendmessageMac(),
  buildEspnowParamTextRefund(),
  buildEspnowParamNodeRefund(),
  buildEspnowParamIntRefund(),
  buildEspnowParamFloatRefund(),
  buildEspnowParamIntFill(),
  buildEspnowParamFloatFill(),
  buildEspnowParamTextFill(),
];
