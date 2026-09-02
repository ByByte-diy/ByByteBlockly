import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  createBlockIconField,
  ensureWifiInclude,
  iotLabel,
  registerSetup,
} from "../iot.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  WIFI_CATEGORY,
} from "../config";

function setEsp8266BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp8266"] };
}

function setEsp32BoardMetadata(block: BlockDefinition): void {
  block.metadata = { ...block.metadata, requiredBoardTypes: ["esp32"] };
}

function registerWifiCredentials(
  generator: any,
  ssid: string,
  password: string,
  ssid2?: string,
  password2?: string
): void {
  let code =
    `const char wifi_ssid[]="${ssid}";\n` +
    `const char wifi_pass[]="${password}";\n`;
  if (ssid2 !== undefined && password2 !== undefined) {
    code +=
      `const char wifi_ssid2[]="${ssid2}";\n` +
      `const char wifi_pass2[]="${password2}";\n`;
  }
  registerGlobalVariable(
    generator,
    "define_wifi_variables",
    code,
    "WiFi SSID and password constants."
  );
}

function buildWifiInitSta() {
  const block = new BlockBuilder("wifi_init_sta")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ssid = b.getFieldValue("SSID");
      const wifipassword = b.getFieldValue("PASSWORD");
      const logic = b.getFieldValue("LOGIC");

      ensureWifiInclude(generator);
      registerWifiCredentials(generator, ssid, wifipassword);

      if (logic === "TRUE") {
        registerSetup(
          generator,
          "Wifi_station_mode",
          "Serial.begin(115200);\n" +
            "	delay(2000);\n" +
            "	WiFi.begin(wifi_ssid,wifi_pass);\n" +
            '	Serial.println("Conectando");\n' +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            '	Serial.print(".");\n' +
            "	delay(500);\n" +
            "	}\n" +
            '	Serial.println("ESP MAC Address:  ");\n' +
            "	Serial.println(WiFi.macAddress());\n" +
            "   Serial.println();\n" +
            '   Serial.print("Conectado a:\t");\n' +
            "   Serial.println(WiFi.SSID()); \n" +
            '   Serial.print("IP address:\t");\n' +
            "   Serial.println(WiFi.localIP());\n"
        );
      } else {
        registerSetup(
          generator,
          "Wifi_station_mode",
          "delay(2000);\n" +
            "	WiFi.begin(wifi_ssid,wifi_pass);\n" +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            "	delay(500);\n" +
            "	}\n"
        );
      }
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "remoteWide"))
      .appendField(iotLabel("WIFI_sta_init", "WIFI.Connect as Station"))
      .appendField(iotLabel("WIFI_logs", "Enable logs"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.appendDummyInput()
      .appendField(iotLabel("WIFI_ssid", "Wifi ssid:"))
      .appendField(new Blockly.FieldTextInput("Red Wifi"), "SSID")
      .appendField(iotLabel("WIFI_password", "password:"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxxxxxxxxxxx"), "PASSWORD");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init and connect Wifi in station mode");
  };
  return block;
}

function buildWifiInitAp() {
  const block = new BlockBuilder("wifi_init_ap")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ssid = b.getFieldValue("SSID");
      const wifipassword = b.getFieldValue("PASSWORD");
      const logic = b.getFieldValue("LOGIC");

      ensureWifiInclude(generator);
      registerWifiCredentials(generator, ssid, wifipassword);

      if (logic === "TRUE") {
        registerSetup(
          generator,
          "Wifi_action_point_mode",
          "Serial.begin(115200);\n" +
            "delay(2000);\n" +
            "WiFi.mode(WIFI_AP);\n" +
            'Serial.println("Conectando como modo punto de acceso");\n' +
            "while (!WiFi.softAP(wifi_ssid,wifi_pass)){\n" +
            '	Serial.print(".");\n' +
            "	delay(500);\n" +
            "	}\n" +
            'Serial.println("ESP MAC Address:  ");\n' +
            "Serial.println(WiFi.macAddress());\n" +
            "Serial.println();\n" +
            'Serial.print("Iniciado Access point:\t");\n' +
            "Serial.println(wifi_ssid); \n" +
            'Serial.print("with this IP address:\t");\n' +
            "Serial.println(WiFi.softAPIP());\n"
        );
      } else {
        registerSetup(
          generator,
          "Wifi_action_point_mode",
          "delay(2000);\n" +
            "   WiFi.mode(WIFI_AP);\n" +
            "	while (!WiFi.softAP(wifi_ssid,wifi_pass)){\n" +
            "	delay(500);\n" +
            "	}\n"
        );
      }
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "remoteWide"))
      .appendField(iotLabel("WIFI_ap_init", "WIFI.Create an Access Point"))
      .appendField(iotLabel("WIFI_logs", "Enable logs"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.appendDummyInput()
      .appendField(iotLabel("WIFI_ssid_ap", "Wifi ssid name:"))
      .appendField(new Blockly.FieldTextInput("Otto_Wifi"), "SSID")
      .appendField(iotLabel("WIFI_password_ap", "and this password:"))
      .appendField(new Blockly.FieldTextInput("otto1234"), "PASSWORD");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init and connect Wifi in access point mode");
  };
  return block;
}

function buildWifiInitStaAp() {
  const block = new BlockBuilder("wifi_init_sta_ap")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ssid = b.getFieldValue("SSID");
      const wifipassword = b.getFieldValue("PASSWORD");
      const ssid2 = b.getFieldValue("SSID2");
      const wifipassword2 = b.getFieldValue("PASSWORD2");
      const logic = b.getFieldValue("LOGIC");

      ensureWifiInclude(generator);
      registerWifiCredentials(generator, ssid, wifipassword, ssid2, wifipassword2);

      if (logic === "TRUE") {
        registerSetup(
          generator,
          "Wifi_ap_sta_mode",
          "Serial.begin(115200);\n" +
            "	delay(2000);\n" +
            "   WiFi.mode(WIFI_AP_STA);\n" +
            "	WiFi.softAP(wifi_ssid2,wifi_pass2);\n" +
            "	WiFi.begin(wifi_ssid,wifi_pass);\n" +
            '	Serial.println("Conectando");\n' +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            '	Serial.print(".");\n' +
            "	delay(500);\n" +
            "	}\n" +
            "	WiFi.setAutoReconnect(true);\n" +
            "   Serial.println();\n" +
            '	Serial.println("ESP MAC Address:  ");\n' +
            "	Serial.println(WiFi.macAddress());\n" +
            '   Serial.print("Conectado a:\t");\n' +
            "   Serial.println(WiFi.SSID()); \n" +
            '   Serial.print("IP address:\t");\n' +
            "   Serial.println(WiFi.localIP());\n" +
            '   Serial.print("Iniciado Access point:\t");\n' +
            "   Serial.println(wifi_ssid2); \n" +
            " 	Serial.print(\"AP dirección IP: \");\n" +
            "	Serial.println(WiFi.softAPIP());\n"
        );
      } else {
        registerSetup(
          generator,
          "Wifi_ap_sta_mode",
          "delay(2000);\n" +
            "   WiFi.mode(WIFI_AP_STA);\n" +
            "	WiFi.softAP(wifi_ssid2,wifi_pass2);\n" +
            "	WiFi.begin(wifi_ssid,wifi_pass);\n" +
            "	while (WiFi.status() != WL_CONNECTED){\n" +
            "	delay(500);\n" +
            "	}\n" +
            "	WiFi.setAutoReconnect(true);\n"
        );
      }
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "remoteWide"))
      .appendField(
        iotLabel("WIFI_sta_ap_init", "WIFI. Station and create an Access Point")
      )
      .appendField(iotLabel("WIFI_logs", "Enable logs"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    this.appendDummyInput()
      .appendField(iotLabel("WIFI_ssid", "Wifi ssid:"))
      .appendField(new Blockly.FieldTextInput("Red Wifi"), "SSID")
      .appendField(iotLabel("WIFI_password", "password:"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxxxxxxxxxxx"), "PASSWORD");
    this.appendDummyInput()
      .appendField(iotLabel("WIFI_ssid_ap", "Wifi ssid name:"))
      .appendField(new Blockly.FieldTextInput("Otto_Wifi"), "SSID2")
      .appendField(iotLabel("WIFI_password_ap", "and this password:"))
      .appendField(new Blockly.FieldTextInput("otto1234"), "PASSWORD2");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init and connect Wifi in station and ap mode");
  };
  return block;
}

function buildWifiApStaticIp() {
  const block = new BlockBuilder("wifi_ap_staticip")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ipAp = b.getFieldValue("IP");
      const maskAp = b.getFieldValue("Mask");
      const gatewayAp = b.getFieldValue("Gateway");

      registerGlobalVariable(
        generator,
        "define_wifi_static_ip_ap",
        `IPAddress staticIP_ap(${ipAp});\n` +
          `IPAddress gateway_ap(${gatewayAp});\n` +
          `IPAddress subnet_ap(${maskAp});\n`,
        "Static IP configuration for WiFi access point mode."
      );
      return "WiFi.softAPConfig(staticIP_ap, gateway_ap, subnet_ap);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "medium"))
      .appendField(iotLabel("Wifi_ap_fixip", "Access point mode.Static IP"));
    this.appendDummyInput()
      .appendField(iotLabel("Wifi_ip", "IP"))
      .appendField(new Blockly.FieldTextInput("192,168,7,2"), "IP")
      .appendField(iotLabel("Wifi_Gateway", "Gateway"))
      .appendField(new Blockly.FieldTextInput("192,168,7,1"), "Gateway")
      .appendField(iotLabel("Wifi_Mask", "Mask"))
      .appendField(new Blockly.FieldTextInput("255,255,255,0"), "Mask");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("In access point fix a ip static");
  };
  return block;
}

function buildWifiStaStaticIp() {
  const block = new BlockBuilder("wifi_sta_staticip")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "wifi"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      const ipSta = b.getFieldValue("IP");
      const maskSta = b.getFieldValue("Mask");
      const gatewaySta = b.getFieldValue("Gateway");

      registerGlobalVariable(
        generator,
        "define_wifi_static_ip_sta",
        `IPAddress staticIP_sta(${ipSta});\n` +
          `IPAddress gateway_sta(${gatewaySta});\n` +
          `IPAddress subnet_sta(${maskSta});\n`,
        "Static IP configuration for WiFi station mode."
      );
      return "WiFi.config(staticIP_sta, gateway_sta, subnet_sta);\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("wifi.png", "medium"))
      .appendField(iotLabel("Wifi_sta_fixip", "Station mode.Static IP"));
    this.appendDummyInput()
      .appendField(iotLabel("Wifi_ip", "IP"))
      .appendField(new Blockly.FieldTextInput("192,168,1,150"), "IP")
      .appendField(iotLabel("Wifi_Gateway", "Gateway"))
      .appendField(new Blockly.FieldTextInput("192,168,1,1"), "Gateway")
      .appendField(iotLabel("Wifi_Mask", "Mask"))
      .appendField(new Blockly.FieldTextInput("255,255,255,0"), "Mask");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("In access point fix a ip static");
  };
  return block;
}

function buildEspYieldBlock() {
  const block = new BlockBuilder("ESP_yield_block")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "esp"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) => "yield();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ESP8266icon.png"))
      .appendField(iotLabel("ESP_yield", " Yield function"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("ESP yield");
  };
  return block;
}

function buildEspDeepSleep() {
  const block = new BlockBuilder("ESP_DeepSleep")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "esp", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const value = generator.valueToCode(b, "Value", generator.ORDER_ATOMIC);
      if (value === "0") {
        return "ESP.deepSleep(0);\n";
      }
      return `ESP.deepSleep(${value}e6);\n`;
    })
    .build();

  setEsp8266BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ESP8266icon.png"))
      .appendField(iotLabel("ESP_deepsleep", "DeepSleep "));
    this.appendValueInput("Value").setCheck("Number");
    this.appendDummyInput().appendField(iotLabel("ESP_timesleep", "Seconds"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "To sleep the ESP8266 deeply. Important: You need to connect D0(GPIO16) to Reset pin"
    );
    attachShadowBlock(this, "Value", "math_number", { NUM: 10 });
  };
  return block;
}

function buildEspRestart() {
  const block = new BlockBuilder("ESP_Restart")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "esp", "esp8266"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) => "ESP.restart();\n")
    .build();

  setEsp8266BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ESP8266icon.png"))
      .appendField(iotLabel("ESP_restart", "Restart ESP8266/ESP32"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Restart ESP8266 ");
  };
  return block;
}

function buildEsp32DeepSleep() {
  const block = new BlockBuilder("ESP32_DeepSleep")
    .setCategory(WIFI_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "esp", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const value = generator.valueToCode(b, "Value", generator.ORDER_ATOMIC);
      return `esp_sleep_enable_timer_wakeup(${value}e6);\nesp_deep_sleep_start();\n`;
    })
    .build();

  setEsp32BoardMetadata(block);

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ESP8266icon.png"))
      .appendField(iotLabel("ESP_deepsleep", "DeepSleep "));
    this.appendValueInput("Value").setCheck("Number");
    this.appendDummyInput().appendField(iotLabel("ESP_timesleep", "Seconds"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Time in second to sleep");
    attachShadowBlock(this, "Value", "math_number", { NUM: 10 });
  };
  return block;
}

export const WIFI_BLOCKS = [
  buildWifiInitSta(),
  buildWifiInitAp(),
  buildWifiInitStaAp(),
  buildWifiApStaticIp(),
  buildWifiStaStaticIp(),
  buildEspYieldBlock(),
  buildEspDeepSleep(),
  buildEspRestart(),
  buildEsp32DeepSleep(),
];
