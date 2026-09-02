import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  appendToDefinitionBody,
  createBlockIconField,
  ensureWifiInclude,
  iotLabel,
  registerSetup,
} from "../iot.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  MQTT_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";

function ensureMqttIncludes(generator: any): void {
  ensureWifiInclude(generator);
  registerInclude(generator, "PubSubClient.h", "MQTT PubSubClient library.");
}

function buildMqttInit() {
  const block = new BlockBuilder("mqtt_init")
    .setCategory(MQTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "mqtt", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ssid = b.getFieldValue("SSID");
      const wifipassword = b.getFieldValue("PASSWORD");
      const server = b.getFieldValue("SERVER");
      const port = b.getFieldValue("PORT");
      const usermqtt = b.getFieldValue("USER");
      const apiKey = b.getFieldValue("APIKEY");
      const idClient = b.getFieldValue("IDCLIENT");
      const logic = b.getFieldValue("LOGIC");

      ensureMqttIncludes(generator);

      registerGlobalVariable(
        generator,
        "define_mqtt_variables",
        `const char mqtt_wifi_ssid[]="${ssid}";\n` +
          `const char mqtt_wifi_pass[]="${wifipassword}";\n` +
          `const char mqtt_broker[]="${server}";\n` +
          `const int mqtt_port=${port};\n` +
          `const char mqtt_user[]="${usermqtt}";\n` +
          `const char mqtt_pass[]="${apiKey}";\n` +
          `const char mqtt_clientid[]="${idClient}";\n` +
          "\n" +
          "WiFiClient mqtt_wifiClient;\n" +
          "PubSubClient mqtt_client(mqtt_wifiClient);\n" +
          "\n" +
          "char mqtt_payload[64];\n",
        "MQTT WiFi and broker configuration."
      );

      registerDefinition(
        generator,
        "define_mqtt_loop",
        "void mqtt_loop(){\n" +
          "	if (!mqtt_client.connected()) {\n" +
          "		mqtt_client.connect(mqtt_clientid,mqtt_user,mqtt_pass);\n" +
          "		mqtt_subscribe();\n" +
          "	}\n" +
          "	if (mqtt_client.connected()) {\n" +
          " 	mqtt_client.loop();\n" +
          "	}\n" +
          "}\n",
        "MQTT loop helper."
      );

      registerDefinition(
        generator,
        "define_mqtt_subscribe",
        "void mqtt_subscribe(){\n" +
          "}\n",
        "MQTT topic subscription helper."
      );

      registerDefinition(
        generator,
        "define_mqtt_otherfunctions",
        "double mqtt_payload2double(unsigned char *_payload, int _length)\n" +
          "{\n" +
          "  int i;\n" +
          "  for (i = 0; i<_length && i<64; i++){\n" +
          "    mqtt_payload[i] = _payload[i];\n" +
          "  }\n" +
          "  mqtt_payload[i] = 0;\n" +
          "  return atof(mqtt_payload);\n" +
          "}\n" +
          "\n" +
          "String mqtt_payload2string(unsigned char *_payload, int _length)\n" +
          "{\n" +
          "  int i;\n" +
          "  for (i = 0; i<_length && i<64; i++){\n" +
          "    mqtt_payload[i] = _payload[i];\n" +
          "  }\n" +
          "  mqtt_payload[i] = 0;\n" +
          "  return String(mqtt_payload);\n" +
          "}\n",
        "MQTT payload conversion helpers."
      );

      registerDefinition(
        generator,
        "define_mqtt_callback",
        "void mqtt_callback(char* _topic, unsigned char* _payload, unsigned int _payloadlength){\n" +
          "	double varNum=mqtt_payload2double(_payload,_payloadlength);\n" +
          "	String varText=mqtt_payload2string(_payload,_payloadlength);\n" +
          "}\n",
        "MQTT message callback."
      );

      if (logic === "TRUE") {
        registerSetup(
          generator,
          "setup_mqtt_setup",
          "Serial.begin(115200);\n" +
            "	delay(2000);\n" +
            "	WiFi.begin(mqtt_wifi_ssid,mqtt_wifi_pass);\n" +
            '	Serial.println("Conectando");\n' +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            '	Serial.print(".");\n' +
            "	delay(500);\n" +
            "	}\n" +
            "   Serial.println();\n" +
            '   Serial.print("Conectado a:\t");\n' +
            "   Serial.println(WiFi.SSID()); \n" +
            '   Serial.print("IP address:\t");\n' +
            "   Serial.println(WiFi.localIP());\n" +
            "	randomSeed(micros());\n" +
            "	mqtt_client.setServer(mqtt_broker, mqtt_port);\n" +
            "	mqtt_client.setCallback(mqtt_callback);\n" +
            "	mqtt_subscribe();\n"
        );
      } else {
        registerSetup(
          generator,
          "setup_mqtt_setup",
          "	delay(2000);\n" +
            "	WiFi.begin(mqtt_wifi_ssid,mqtt_wifi_pass);\n" +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            "	delay(500);\n" +
            "	}\n" +
            "	randomSeed(micros());\n" +
            "	mqtt_client.setServer(mqtt_broker, mqtt_port);\n" +
            "	mqtt_client.setCallback(mqtt_callback);\n" +
            "	mqtt_subscribe();\n"
        );
      }

      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("mqtt_image.png", "remoteWide"))
      .appendField(
        iotLabel("MQTT_name_init", "Configuration MQTT protocol")
      )
      .appendField(iotLabel("MQTT_logs", "Enable logs"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.appendDummyInput()
      .appendField(iotLabel("MQTT_ssid", "Wifi ssid:"))
      .appendField(new Blockly.FieldTextInput("Red Wifi"), "SSID")
      .appendField(iotLabel("MQTT_password", "password:"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxxxxxxxxxxx"), "PASSWORD");
    this.appendDummyInput()
      .appendField(iotLabel("MQTT_server", "Server (broker):"))
      .appendField(new Blockly.FieldTextInput("io.adafruit.com"), "SERVER")
      .appendField(iotLabel("MQTT_port", "port:"))
      .appendField(new Blockly.FieldTextInput("1883"), "PORT");
    this.appendDummyInput()
      .appendField(iotLabel("MQTT_user", "User:"))
      .appendField(new Blockly.FieldTextInput(" "), "USER")
      .appendField(iotLabel("MQTT_APIkey", "API Key:"))
      .appendField(new Blockly.FieldTextInput(" "), "APIKEY")
      .appendField(iotLabel("MQTT_client", "ID client:"))
      .appendField(new Blockly.FieldTextInput("LX5_"), "IDCLIENT");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init mqtt functions");
  };
  return block;
}

function buildMqttLoop() {
  const block = new BlockBuilder("mqtt_loop")
    .setCategory(MQTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "mqtt"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) => "mqtt_loop();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("mqtt_image.png", "remoteWide"))
      .appendField(iotLabel("MQTT_name", "MQTT"))
      .appendField(iotLabel("MQTT_topicattend", "Loop MQTT"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Topic attend in the loop");
  };
  return block;
}

function buildMqttSubscribeNum() {
  const block = new BlockBuilder("mqtt_subscribe_num")
    .setCategory(MQTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "mqtt", "subscribe"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const topic = b.getFieldValue("TOPIC");
      const varName = generator.valueToCode(b, "variable", generator.ORDER_ATOMIC);

      appendToDefinitionBody(
        generator,
        "define_mqtt_subscribe",
        ` mqtt_client.subscribe(String(String("${topic}")).c_str());\n`,
        `void mqtt_subscribe(){\n mqtt_client.subscribe(String(String("${topic}")).c_str());\n}\n`,
        "MQTT topic subscription helper."
      );

      appendToDefinitionBody(
        generator,
        "define_mqtt_callback",
        `   if(String(_topic)==String(String("${topic}")))${varName}=varNum;\n`,
        "void mqtt_callback(char* _topic, unsigned char* _payload, unsigned int _payloadlength){\n" +
          "	double varNum=mqtt_payload2double(_payload,_payloadlength);\n" +
          "	String varText=mqtt_payload2string(_payload,_payloadlength);\n" +
          `   if(String(_topic)==String(String("${topic}")))${varName}=varNum;\n` +
          "}\n",
        "MQTT message callback."
      );

      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("mqtt_image.png", "remoteWide"))
      .appendField(iotLabel("MQTT_name", "MQTT"))
      .appendField(iotLabel("MQTT_topicsubscribe", "Subscribe to the topic"))
      .appendField(new Blockly.FieldTextInput("Topic path"), "TOPIC")
      .appendField(
        iotLabel("MQTT_topicsubscribe2", "and save num value in the variable")
      );
    this.appendValueInput("variable");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Topic subscription");
  };
  return block;
}

function buildMqttSubscribeText() {
  const block = new BlockBuilder("mqtt_subscribe_text")
    .setCategory(MQTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "mqtt", "subscribe"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const topic = b.getFieldValue("TOPIC");
      const varName = generator.valueToCode(b, "variable", generator.ORDER_ATOMIC);

      appendToDefinitionBody(
        generator,
        "define_mqtt_subscribe",
        `\n mqtt_client.subscribe(String(String("${topic}")).c_str());\n`,
        `void mqtt_subscribe(){\n mqtt_client.subscribe(String(String("${topic}")).c_str());\n}\n`,
        "MQTT topic subscription helper."
      );

      appendToDefinitionBody(
        generator,
        "define_mqtt_callback",
        `   if(String(_topic)==String(String("${topic}")))${varName}=varText;\n`,
        "void mqtt_callback(char* _topic, unsigned char* _payload, unsigned int _payloadlength){\n" +
          "	double varNum=mqtt_payload2double(_payload,_payloadlength);\n" +
          "	String varText=mqtt_payload2string(_payload,_payloadlength);\n" +
          `   if(String(_topic)==String(String("${topic}")))${varName}=varText;\n` +
          "}\n",
        "MQTT message callback."
      );

      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("mqtt_image.png", "remoteWide"))
      .appendField(iotLabel("MQTT_name", "MQTT"))
      .appendField(iotLabel("MQTT_topicsubscribe", "Subscribe to the topic"))
      .appendField(new Blockly.FieldTextInput("Topic path"), "TOPIC")
      .appendField(
        iotLabel("MQTT_topicsubscribe3", "and save text value in the variable")
      );
    this.appendValueInput("variable");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Topic subscription");
  };
  return block;
}

function buildMqttPublish() {
  const block = new BlockBuilder("mqtt_publish")
    .setCategory(MQTT_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "mqtt", "publish"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const topic = b.getFieldValue("TOPIC");
      const variable = generator.valueToCode(b, "variable", generator.ORDER_ATOMIC);
      return `mqtt_client.publish(String(String("${topic}")).c_str(),String(String(${variable})).c_str());\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("mqtt_image.png", "remoteWide"))
      .appendField(iotLabel("MQTT_name", "MQTT"))
      .appendField(iotLabel("MQTT_topicpublish", "Publish in the topic"))
      .appendField(new Blockly.FieldTextInput("Topic path"), "TOPIC")
      .appendField(iotLabel("MQTT_topicvalue", "Value"));
    this.appendValueInput("variable");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Topic subscription");
  };
  return block;
}

export const MQTT_BLOCKS = [
  buildMqttInit(),
  buildMqttLoop(),
  buildMqttSubscribeNum(),
  buildMqttSubscribeText(),
  buildMqttPublish(),
];
