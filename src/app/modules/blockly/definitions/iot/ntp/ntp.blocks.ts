import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  createBlockIconField,
  iotLabel,
  registerSetup,
} from "../iot.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  GMT_OPTIONS,
  NTP_CATEGORY,
  NTP_TEXT_VALUE_OPTION_KEYS,
  NTP_VALUE_FALLBACKS,
  NTP_VALUE_OPTION_KEYS,
  TOOLBOX_LEVEL,
} from "../config";

function ntpDropdownOptions(
  keys: [string, string][]
): [string, string][] {
  return keys.map(([msgKey, value]) => [
    iotLabel(msgKey, NTP_VALUE_FALLBACKS[msgKey] ?? msgKey),
    value,
  ]);
}

function buildInitNtp() {
  const block = new BlockBuilder("Init_NTP")
    .setCategory(NTP_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ntp", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const gmtLocal = b.getFieldValue("GMT");

      registerInclude(generator, "NTPClient.h", "NTP client library.");
      registerInclude(generator, "WiFiUdp.h", "UDP for NTP client.");

      registerDefinition(
        generator,
        "definition_NTPClient",
        "WiFiUDP ntpUDP;\n" +
          `NTPClient timeClient(ntpUDP, "pool.ntp.org",(int)(${gmtLocal}*3600), 60000);\n` +
          "unsigned long epochTime;\n" +
          "struct tm *ptm;\n" +
          'String weekDays[7]={"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};\n' +
          'String months[12]={"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};\n',
        "NTP client instance and date/time helpers."
      );

      registerSetup(generator, "setup_NTPClient", "timeClient.begin();\n");
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ntp_icon.png", "medium"))
      .appendField(iotLabel("NTP_NAME", "Init NTP Server."));
    this.appendDummyInput()
      .appendField(iotLabel("NTP_GMT", "GMT"))
      .appendField(new Blockly.FieldDropdown(GMT_OPTIONS), "GMT");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init IFTTT configuration");
  };
  return block;
}

function buildOrderReadNtpServer() {
  const block = new BlockBuilder("order_read_NTP_server")
    .setCategory(NTP_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ntp"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) =>
      "timeClient.update();\n" +
      "epochTime = timeClient.getEpochTime();\n" +
      "ptm = gmtime ((time_t *)&(epochTime));\n"
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ntp_icon.png", "medium"))
      .appendField(iotLabel("NTP_READ_RTC", "NTP Server.Read the date and time"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Order to read of NTP server");
  };
  return block;
}

function buildValuesNtpServer() {
  const block = new BlockBuilder("values_NTP_server")
    .setCategory(NTP_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ntp"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const outputValue = b.getFieldValue("OUTPUT_VALUE");
      let code: string;

      if (outputValue === "6") {
        code = "timeClient.getSeconds()";
      } else if (outputValue === "5") {
        code = "timeClient.getMinutes()";
      } else if (outputValue === "4") {
        code = "timeClient.getHours()";
      } else if (outputValue === "3") {
        code = "ptm->tm_mday";
      } else if (outputValue === "2") {
        code = "ptm->tm_mon+1";
      } else if (outputValue === "1") {
        code = "ptm->tm_year+1900";
      } else {
        code = "timeClient.getEpochTime()";
      }

      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ntp_icon.png", "medium"))
      .appendField(iotLabel("NTP_NAME2", "NTP Server."))
      .appendField(
        new Blockly.FieldDropdown(ntpDropdownOptions(NTP_VALUE_OPTION_KEYS)),
        "OUTPUT_VALUE"
      )
      .appendField(iotLabel("NTP_VALUES", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the date or time parameter");
  };
  return block;
}

function buildValuesTextNtpServer() {
  const block = new BlockBuilder("values_text_NTP_server")
    .setCategory(NTP_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "ntp"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const outputValue = b.getFieldValue("OUTPUT_VALUE");
      let code: string;

      if (outputValue === "1") {
        code = "months[ptm->tm_mon]";
      } else if (outputValue === "0") {
        code = "weekDays[timeClient.getDay()]";
      } else {
        code = "timeClient.getFormattedTime()";
      }

      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("ntp_icon.png", "medium"))
      .appendField(iotLabel("NTP_NAME2", "NTP Server."))
      .appendField(
        new Blockly.FieldDropdown(
          ntpDropdownOptions(NTP_TEXT_VALUE_OPTION_KEYS)
        ),
        "OUTPUT_VALUE"
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the text of day of week or month");
  };
  return block;
}

export const NTP_BLOCKS = [
  buildInitNtp(),
  buildOrderReadNtpServer(),
  buildValuesNtpServer(),
  buildValuesTextNtpServer(),
];
