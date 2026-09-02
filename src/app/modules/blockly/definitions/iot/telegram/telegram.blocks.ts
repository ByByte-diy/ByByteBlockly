import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  TELEGRAM_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  iotLabel,
  isOttoEspBoard,
  registerGlobal,
  registerSetup,
} from "../iot.helper";

function buildTelegramInit() {
  const block = new BlockBuilder("telegram_init")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const botToken = b.getFieldValue("BOT_TOKEN");
      const chatId = b.getFieldValue("CHAT_ID");
      registerInclude(
        generator,
        "WiFiClientSecure.h",
        "Secure WiFi client for Telegram HTTPS."
      );
      registerInclude(
        generator,
        "UniversalTelegramBot.h",
        "Universal Telegram Bot library."
      );
      registerGlobal(
        generator,
        "define_telegram",
        `#define BOT_TOKEN "${botToken}"\n` + `#define CHAT_ID "${chatId}"\n`
      );
      if (isOttoEspBoard()) {
        registerGlobal(
          generator,
          "define_telegram_variables",
          "X509List cert(TELEGRAM_CERTIFICATE_ROOT);\n" +
            "WiFiClientSecure secured_client;\n" +
            "UniversalTelegramBot bot(BOT_TOKEN, secured_client);\n" +
            "int numNewMessages=0;\n"
        );
        registerSetup(
          generator,
          "setup_telegram",
          "secured_client.setTrustAnchors(&cert);\n"
        );
      } else {
        registerGlobal(
          generator,
          "define_telegram_variables",
          "WiFiClientSecure secured_client;\n" +
            "UniversalTelegramBot bot(BOT_TOKEN, secured_client);\n" +
            "int numNewMessages=0;\n"
        );
        registerSetup(
          generator,
          "setup_telegram",
          "secured_client.setCACert(TELEGRAM_CERTIFICATE_ROOT);\n"
        );
      }
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(iotLabel("Telegram_name_init", "Configuration Telegram chat."))
      .appendField(iotLabel("Telegram_BotToken", "BOT token"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxx"), "BOT_TOKEN");
    this.appendDummyInput()
      .appendField(iotLabel("Telegram_ChatID", "Chat ID"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxx"), "CHAT_ID");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init telegram functions");
    this.setHelpUrl("");
  };
  return block;
}

function buildTelegramLoopMessage() {
  const block = new BlockBuilder("telegram_loop_message")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((_b, _generator) =>
      "numNewMessages = bot.getUpdates(bot.last_message_received + 1);\n" +
      "while (numNewMessages)\n" +
      "{\n" +
      "  handleNewMessages(numNewMessages);\n" +
      "  numNewMessages = bot.getUpdates(bot.last_message_received + 1);\n" +
      "}\n"
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(iotLabel("Telegram_Loop", "Telegram Loop.Update messages"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  };
  return block;
}

function buildTelegramReceptionFunction() {
  const block = new BlockBuilder("telegram_reception_function")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram"])
    .setArduinoGenerator((b, generator) => {
      const branch = generator.statementToCode(b, "DO");
      generator.codeFunctions_["telegram_reception_function"] =
        "void handleNewMessages(int numNewMessages){\n" +
        "for (int i = 0; i < numNewMessages; i++)\n" +
        "{\n" +
        "\tString text = bot.messages[i].text;\n" +
        branch +
        "}\n" +
        "}\n";
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(
        iotLabel("Telegram_receive", "Telegram.When message is recived")
      );
    this.appendStatementInput("DO").appendField(
      Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do"
    );
    this.setInputsInline(false);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setTooltip("");
  };
  return block;
}

function buildTelegramSendMessage() {
  const block = new BlockBuilder("telegram_sendmessage")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const textToSend = generator.valueToCode(
        b,
        "texttosend",
        generator.ORDER_ATOMIC
      );
      return `bot.sendMessage(CHAT_ID, ${textToSend}, "");\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(iotLabel("Telegram_name", "Telegram."));
    this.appendValueInput("texttosend")
      .setCheck(null)
      .appendField(iotLabel("TelegramSend", "Send message:"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  };
  return block;
}

function buildTelegramMessageNameReceived() {
  const block = new BlockBuilder("telegram_message_name_received")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "bot.messages[i].from_name",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(iotLabel("Telegram_name", "Telegram."))
      .appendField(
        iotLabel("Telegram_fromName", "Name of person sent the message")
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the field in long or number");
    this.setHelpUrl("");
  };
  return block;
}

function buildTelegramMessageReceived() {
  const block = new BlockBuilder("telegram_message_received")
    .setCategory(TELEGRAM_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "telegram"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => ["text", generator.ORDER_ATOMIC])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("telegram.png"))
      .appendField(iotLabel("Telegram_message", "Telegram.Received message"));
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the message");
    this.setHelpUrl("");
  };
  return block;
}

export const TELEGRAM_BLOCKS = [
  buildTelegramInit(),
  buildTelegramLoopMessage(),
  buildTelegramReceptionFunction(),
  buildTelegramSendMessage(),
  buildTelegramMessageNameReceived(),
  buildTelegramMessageReceived(),
];
