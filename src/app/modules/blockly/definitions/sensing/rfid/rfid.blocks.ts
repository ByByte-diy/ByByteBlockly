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
  RFID_CATEGORY,
  RFID_DEFAULT_PINS,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createAllPinDropdownField,
  createBlockIconField,
  sensingLabel,
} from "../sensing.helper";

const CARD_READED_FN =
  "String cardreaded(byte *buffer,byte bufferSize)\n" +
  "{\n" +
  "  String card=\"\";\n" +
  "  for (byte i=0; i<bufferSize; i++)\n" +
  "  {\n" +
  '    card+=String(buffer[i]<0x10 ? " 0" : " ");\n' +
  "    card+=String(buffer[i],HEX);\n" +
  "  }\n" +
  "  return card;\n" +
  "}";

const NFC_CARD_READED_FN =
  "String cardreaded(uint8_t *buffer,uint8_t bufferSize)\n" +
  "{\n" +
  "  String card=\"\";\n" +
  "  for (uint8_t i=0; i<bufferSize; i++)\n" +
  "  {\n" +
  '    card+=String(buffer[i]<0x10 ? " 0" : " ");\n' +
  "    card+=String(buffer[i],HEX);\n" +
  "  }\n" +
  "  return card;\n" +
  "}";

const COMPARE_ARRAY_FN =
  "bool isEqualArray(byte arrayA[],byte arrayB[],int length)\n" +
  "{\n" +
  "  for (int index=0; index<length; index++)\n" +
  "  {\n" +
  "    if (arrayA[index]!=arrayB[index])\n" +
  "      return false;\n" +
  "  }\n" +
  "  return true;\n" +
  "}";

const COMPARE_NFC_ARRAY_FN =
  "bool isEqualArray(uint8_t arrayA[],uint8_t arrayB[],int length)\n" +
  "{\n" +
  "  for (int index=0; index<length; index++)\n" +
  "  {\n" +
  "    if (arrayA[index]!=arrayB[index])\n" +
  "      return false;\n" +
  "  }\n" +
  "  return true;\n" +
  "}";

function ensureMfrc522Instance(generator: any, pinSda: string, pinRst: string): void {
  registerInclude(generator, "SPI.h");
  registerInclude(generator, "MFRC522.h", "MFRC522 RFID reader (SPI).");
  registerGlobalVariable(
    generator,
    "mfrc522",
    `MFRC522 mfrc522(${pinSda},${pinRst});`,
    "MFRC522 reader instance."
  );
}

function buildRfidInit() {
  const block = new BlockBuilder("rfid_init")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pinSda = b.getFieldValue("PIN_SDA");
      const pinRst = b.getFieldValue("PIN_RST");
      ensureMfrc522Instance(generator, pinSda, pinRst);
      return "SPI.begin();\nmfrc522.PCD_Init();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("RFIDreader.png"))
      .appendField(initBlockLabel("RFID_INIT_LABEL", "MFRC522 RFID init"))
      .appendField(sensingLabel("RFID_init2", "SCK, MOSI & MISO"));
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_SDA", "SDA"))
      .appendField(createAllPinDropdownField(), "PIN_SDA");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_RST", "RST"))
      .appendField(createAllPinDropdownField(), "PIN_RST");
    applyDefaultAllPinFields(this, {
      PIN_SDA: RFID_DEFAULT_PINS.PIN_SDA,
      PIN_RST: RFID_DEFAULT_PINS.PIN_RST,
    });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildRfidInitCustom() {
  const block = new BlockBuilder("rfid_init_custom")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522", "init", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pinMiso = b.getFieldValue("PIN_MISO");
      const pinMosi = b.getFieldValue("PIN_MOSI");
      const pinSck = b.getFieldValue("PIN_SCK");
      const pinSda = b.getFieldValue("PIN_SDA");
      const pinRst = b.getFieldValue("PIN_RST");
      ensureMfrc522Instance(generator, pinSda, pinRst);
      return (
        `SPI.begin(${pinSck},${pinMiso},${pinMosi},${pinSda});\n` +
        "mfrc522.PCD_Init();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("RFIDreader.png"))
      .appendField(
        initBlockLabel("RFID_INIT_CUSTOM_LABEL", "MFRC522 RFID custom SPI init")
      );
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_MISO", "MISO"))
      .appendField(createAllPinDropdownField(), "PIN_MISO");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_MOSI", "MOSI"))
      .appendField(createAllPinDropdownField(), "PIN_MOSI");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_SCK", "SCK"))
      .appendField(createAllPinDropdownField(), "PIN_SCK");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_SDA", "SDA"))
      .appendField(createAllPinDropdownField(), "PIN_SDA");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_PIN_RST", "RST"))
      .appendField(createAllPinDropdownField(), "PIN_RST");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildRfidValidationCard() {
  const block = new BlockBuilder("rfid_validationcard")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const c1 = b.getFieldValue("C1");
      const c2 = b.getFieldValue("C2");
      const c3 = b.getFieldValue("C3");
      const c4 = b.getFieldValue("C4");
      const name = b.getFieldValue("NAME");
      registerDefinition(
        generator,
        `rfid_card_${name}`,
        `byte ${name}[4]= {${c1},${c2},${c3},${c4}};`,
        `RFID validation card ${name}.`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_VALID_VAR", "validation card:"))
      .appendField(new Blockly.FieldTextInput("cardx"), "NAME");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_C1", "value1"))
      .appendField(new Blockly.FieldTextInput("0x3F"), "C1");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_C2", "value2"))
      .appendField(new Blockly.FieldTextInput("0x01"), "C2");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_C3", "value3"))
      .appendField(new Blockly.FieldTextInput("0x23"), "C3");
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_C4", "value4"))
      .appendField(new Blockly.FieldTextInput("0x44"), "C4");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildRfidDetected() {
  const block = new BlockBuilder("RFID_detected")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setOutput("Boolean")
    .setArduinoGenerator((_b, generator) => [
      "mfrc522.PICC_IsNewCardPresent()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_DETECTED", "card detected?"));
    this.setOutput(true, "Boolean");
  };
  return block;
}

function buildRfidReaded() {
  const block = new BlockBuilder("RFID_readed")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setOutput("Boolean")
    .setArduinoGenerator((_b, generator) => [
      "mfrc522.PICC_ReadCardSerial()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_READED", "card read?"));
    this.setOutput(true, "Boolean");
  };
  return block;
}

function buildRfidCardReaded() {
  const block = new BlockBuilder("RFID_card_readed")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setOutput("String")
    .setArduinoGenerator((_b, generator) => {
      registerUserFunction(
        generator,
        "rfid_cardreaded",
        CARD_READED_FN,
        "Format MFRC522 UID bytes as hex string."
      );
      return [
        "cardreaded(mfrc522.uid.uidByte, mfrc522.uid.size)",
        generator.ORDER_ATOMIC,
      ];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_CARD_READED", "read value"));
    this.setOutput(true, "String");
  };
  return block;
}

function buildRfidCheckCard() {
  const block = new BlockBuilder("RFID_check_card")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setOutput("Boolean")
    .setArduinoGenerator((b, generator) => {
      const name = b.getFieldValue("NAME");
      registerUserFunction(
        generator,
        "rfid_compare_array",
        COMPARE_ARRAY_FN,
        "Compare two byte arrays (RFID UID check)."
      );
      return [`isEqualArray(mfrc522.uid.uidByte,${name},4)`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_CHECK_CARD", "is card read = validation card"))
      .appendField(new Blockly.FieldTextInput("cardx"), "NAME")
      .appendField(sensingLabel("RFID_CHECK_CARD2", "?"));
    this.setOutput(true, "Boolean");
  };
  return block;
}

function buildRfidStopRead() {
  const block = new BlockBuilder("rfid_stopread")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "mfrc522"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, _generator) => "mfrc522.PICC_HaltA();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("RFID_name", "RFID"))
      .appendField(sensingLabel("RFID_STOP", "stop reading"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function ensureNfcInstance(generator: any): void {
  registerInclude(generator, "Wire.h");
  registerInclude(generator, "PN532_I2C.h");
  registerInclude(generator, "PN532.h");
  registerInclude(generator, "NfcAdapter.h", "PN532 NFC reader (I2C).");
  registerGlobalVariable(generator, "pn532_i2c", "PN532_I2C pn532i2c(Wire);", "PN532 I2C adapter.");
  registerGlobalVariable(generator, "nfc", "PN532 nfc(pn532i2c);", "PN532 NFC instance.");
  registerGlobalVariable(
    generator,
    "nfc_uid",
    "uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };\nuint8_t uidLength;",
    "NFC card UID buffer."
  );
}

function buildNfcInit() {
  const block = new BlockBuilder("nfc_init")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532", "init", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, generator) => {
      ensureNfcInstance(generator);
      return (
        "nfc.begin();\n" +
        "nfc.setPassiveActivationRetries(0xFF);\n" +
        "nfc.SAMConfig();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("NFCreader.png"))
      .appendField(initBlockLabel("NFC_INIT_LABEL", "PN532 NFC I²C init"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildNfcValidationCard4() {
  const block = new BlockBuilder("nfc_validationcard")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const name = b.getFieldValue("NAME");
      const c1 = b.getFieldValue("C1");
      const c2 = b.getFieldValue("C2");
      const c3 = b.getFieldValue("C3");
      const c4 = b.getFieldValue("C4");
      registerDefinition(
        generator,
        `nfc_card_${name}`,
        `uint8_t ${name}[4]= {${c1},${c2},${c3},${c4}};`,
        `NFC validation card ${name} (4 bytes).`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_name", "NFC"))
      .appendField(sensingLabel("NFC_VALID_VAR", "validation card (4 bytes):"))
      .appendField(new Blockly.FieldTextInput("cardx"), "NAME");
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_C1", "value1"))
      .appendField(new Blockly.FieldTextInput("0x3F"), "C1");
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_C2", "value2"))
      .appendField(new Blockly.FieldTextInput("0x01"), "C2");
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_C3", "value3"))
      .appendField(new Blockly.FieldTextInput("0x23"), "C3");
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_C4", "value4"))
      .appendField(new Blockly.FieldTextInput("0x44"), "C4");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildNfcValidationCard7() {
  const block = new BlockBuilder("nfc_validationcard_2")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const name = b.getFieldValue("NAME");
      registerDefinition(
        generator,
        `nfc_card7_${name}`,
        `uint8_t ${name}[7]= {${b.getFieldValue("C1")},${b.getFieldValue("C2")},${b.getFieldValue("C3")},${b.getFieldValue("C4")},${b.getFieldValue("C5")},${b.getFieldValue("C6")},${b.getFieldValue("C7")}};`,
        `NFC validation card ${name} (7 bytes).`
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_name", "NFC"))
      .appendField(sensingLabel("NFC_VALID_VAR2", "validation card (7 bytes):"))
      .appendField(new Blockly.FieldTextInput("cardy"), "NAME");
    for (const [idx, key] of [
      ["1", "C1"],
      ["2", "C2"],
      ["3", "C3"],
      ["4", "C4"],
      ["5", "C5"],
      ["6", "C6"],
      ["7", "C7"],
    ] as const) {
      this.appendDummyInput()
        .appendField(sensingLabel(`NFC_C${idx}`, `value${idx}`))
        .appendField(new Blockly.FieldTextInput(`0x0${idx}`), key);
    }
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildNfcDetected() {
  const block = new BlockBuilder("nfc_detected")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532"])
    .setOutput("Boolean")
    .setArduinoGenerator((_b, generator) => [
      "nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength)",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_name", "NFC"))
      .appendField(sensingLabel("NFC_DETECTED", "card detected?"));
    this.setOutput(true, "Boolean");
  };
  return block;
}

function buildNfcCardReaded() {
  const block = new BlockBuilder("nfc_card_readed")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532"])
    .setOutput("String")
    .setArduinoGenerator((_b, generator) => {
      registerUserFunction(
        generator,
        "nfc_cardreaded",
        NFC_CARD_READED_FN,
        "Format NFC UID bytes as hex string."
      );
      return ["cardreaded(uid,uidLength)", generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_name", "NFC"))
      .appendField(sensingLabel("NFC_CARD_READED", "read value"));
    this.setOutput(true, "String");
  };
  return block;
}

function buildNfcCheckCard() {
  const block = new BlockBuilder("nfc_check_card")
    .setCategory(RFID_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "rfid", "nfc", "pn532"])
    .setOutput("Boolean")
    .setArduinoGenerator((b, generator) => {
      const name = b.getFieldValue("NAME");
      registerUserFunction(
        generator,
        "nfc_compare_array",
        COMPARE_NFC_ARRAY_FN,
        "Compare two uint8_t arrays (NFC UID check)."
      );
      return [`isEqualArray(uid,${name},uidLength)`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("NFC_name", "NFC"))
      .appendField(sensingLabel("NFC_CHECK_CARD", "is card read = validation card"))
      .appendField(new Blockly.FieldTextInput("cardx"), "NAME")
      .appendField(sensingLabel("NFC_CHECK_CARD2", "?"));
    this.setOutput(true, "Boolean");
  };
  return block;
}

export const RFID_BLOCKS = [
  buildRfidInit(),
  buildRfidValidationCard(),
  buildRfidDetected(),
  buildRfidReaded(),
  buildRfidCardReaded(),
  buildRfidCheckCard(),
  buildRfidStopRead(),
  buildRfidInitCustom(),
  buildNfcInit(),
  buildNfcValidationCard4(),
  buildNfcValidationCard7(),
  buildNfcDetected(),
  buildNfcCardReaded(),
  buildNfcCheckCard(),
];
