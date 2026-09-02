import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerInclude } from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  FIREBASE_CATEGORY,
  FIREBASE_NUM_TYPE_OPTIONS,
  TOOLBOX_LEVEL,
} from "../config";
import { createBlockIconField, iotLabel, registerGlobal } from "../iot.helper";

const FIREBASE_GET_INT_FN =
  "int Firebase_getInt_value(String param)\n" +
  "{\n" +
  "if (Firebase.ready())\n" +
  "{\n" +
  "if (Firebase.RTDB.getInt(&fbdo, param)) {\n" +
  " if (fbdo.dataType() == \"int\") {\n" +
  " return( fbdo.intData());\n" +
  "        }\n" +
  "      }\n" +
  "    }\n" +
  "return 0;\n" +
  "}\n";

const FIREBASE_GET_FLOAT_FN =
  "float Firebase_getFloat_value(String param)\n" +
  "{\n" +
  "if (Firebase.ready())\n" +
  "{\n" +
  "if (Firebase.RTDB.getFloat(&fbdo, param)) {\n" +
  " if (fbdo.dataType() == \"float\") {\n" +
  " return( fbdo.floatData());\n" +
  "        }\n" +
  "      }\n" +
  "    }\n" +
  "return 0;\n" +
  "}\n";

const FIREBASE_GET_DOUBLE_FN =
  "double Firebase_getDouble_value(String param)\n" +
  "{\n" +
  "if (Firebase.ready())\n" +
  "{\n" +
  "if (Firebase.RTDB.getDouble(&fbdo, param)) {\n" +
  " if (fbdo.dataType() == \"double\") {\n" +
  " return( fbdo.doubleData());\n" +
  "        }\n" +
  "     }\n" +
  "    }\n" +
  "return 0;\n" +
  "}\n";

const FIREBASE_GET_STRING_FN =
  "String Firebase_getString_value(String param)\n" +
  "{\n" +
  "if (Firebase.ready())\n" +
  "{\n" +
  "if (Firebase.RTDB.getString(&fbdo, param)) {\n" +
  " if (fbdo.dataType() == \"string\") {\n " +
  " return( fbdo.stringData());\n" +
  "}\n" +
  "}\n" +
  "}\n" +
  "return \"0\";\n" +
  "}\n";

function buildFirebaseInit() {
  const block = new BlockBuilder("firebase_init")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const urlPath = b.getFieldValue("URL_PATH");
      const apiReadKey = b.getFieldValue("API_READ_KEY");
      registerInclude(
        generator,
        "Firebase_ESP_Client.h",
        "Firebase ESP client library."
      );
      registerInclude(
        generator,
        "addons/TokenHelper.h",
        "Firebase token helper addon."
      );
      registerInclude(
        generator,
        "addons/RTDBHelper.h",
        "Firebase RTDB helper addon."
      );
      registerGlobal(
        generator,
        "define_firebase_defines",
        `#define API_KEY "${apiReadKey}";\n` +
          `#define DATABASE_URL "${urlPath}";\n`
      );
      registerGlobal(
        generator,
        "define_firebase_variables",
        "FirebaseData fbdo;\n" +
          "FirebaseAuth auth;\n" +
          "FirebaseConfig config;\n"
      );
      registerGlobal(
        generator,
        "function_firebase_int",
        FIREBASE_GET_INT_FN
      );
      registerGlobal(
        generator,
        "function_firebase_float",
        FIREBASE_GET_FLOAT_FN
      );
      registerGlobal(
        generator,
        "function_firebase_double",
        FIREBASE_GET_DOUBLE_FN
      );
      registerGlobal(
        generator,
        "function_firebase_string",
        FIREBASE_GET_STRING_FN
      );
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("Firebase_name_init", "Configuration Firebase."));
    this.appendDummyInput()
      .appendField(iotLabel("Firebase_url", "URL"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxx"), "URL_PATH")
      .appendField(iotLabel("Firebase_api", "Api key"))
      .appendField(new Blockly.FieldTextInput("yyyyyyyy"), "API_READ_KEY");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init firebase data connection");
    this.setHelpUrl("");
  };
  return block;
}

function buildFirebaseStart() {
  const block = new BlockBuilder("firebase_start")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, _generator) =>
      "config.api_key = API_KEY;\n" +
      "\tconfig.database_url = DATABASE_URL;\n" +
      "\tFirebase.signUp(&config, &auth, \"\", \"\");\n" +
      "\tconfig.token_status_callback = tokenStatusCallback;\n" +
      "\tFirebase.begin(&config, &auth);\n" +
      "\tFirebase.reconnectWiFi(true);\n"
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."))
      .appendField(iotLabel("Firebase_start", " Initialization in Setup"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Start firebase connection. Before you need to connect to the wifi in station mode"
    );
    this.setHelpUrl("");
  };
  return block;
}

function buildFirebaseWriteNum() {
  const block = new BlockBuilder("firebase_write_num")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const node = generator.valueToCode(b, "node", generator.ORDER_ATOMIC);
      const value = generator.valueToCode(b, "value", generator.ORDER_ATOMIC);
      const field = b.getFieldValue("FIELD_NUM");
      if (field === "1") {
        return `if (Firebase.ready()) Firebase.RTDB.setInt(&fbdo, ${node}, ${value});\n`;
      }
      if (field === "2") {
        return `if (Firebase.ready()) Firebase.RTDB.setFloat(&fbdo, ${node}, ${value});\n`;
      }
      return `if (Firebase.ready()) Firebase.RTDB.setDouble(&fbdo, ${node}, ${value});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."));
    this.appendDummyInput()
      .appendField(iotLabel("Firebase_type", " Store "))
      .appendField(new Blockly.FieldDropdown(FIREBASE_NUM_TYPE_OPTIONS), "FIELD_NUM")
      .appendField(iotLabel("Firebase_Node", "in node"));
    this.appendValueInput("node").setCheck("String");
    this.appendValueInput("value")
      .setCheck("Number")
      .appendField(iotLabel("Firebase_Value", "value"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write a numeric value in BBDD in the node");
  };
  return block;
}

function buildFirebaseWriteText() {
  const block = new BlockBuilder("firebase_write_text")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const node = generator.valueToCode(b, "node", generator.ORDER_ATOMIC);
      const value = generator.valueToCode(b, "value", generator.ORDER_ATOMIC);
      return `if (Firebase.ready()) Firebase.RTDB.setString(&fbdo, ${node}, ${value});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."))
      .appendField(iotLabel("Firebase_String_Node", "Store a text in node"));
    this.appendValueInput("node").setCheck("String");
    this.appendValueInput("value")
      .setCheck("String")
      .appendField(iotLabel("Firebase_Value", "value"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write a text value in BBDD in the node");
  };
  return block;
}

function buildFirebaseReadNum() {
  const block = new BlockBuilder("firebase_read_num")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const node = generator.valueToCode(b, "node", generator.ORDER_ATOMIC);
      const field = b.getFieldValue("FIELD_NUM");
      let code: string;
      if (field === "1") {
        code = `Firebase_getInt_value(${node})`;
      } else if (field === "2") {
        code = `Firebase_getFloat_value(${node})`;
      } else {
        code = `Firebase_getDouble_value(${node})`;
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."));
    this.appendDummyInput()
      .appendField(iotLabel("Firebase_read", " Read "))
      .appendField(new Blockly.FieldDropdown(FIREBASE_NUM_TYPE_OPTIONS), "FIELD_NUM")
      .appendField(iotLabel("Firebase_Node", "in node"));
    this.appendValueInput("node").setCheck("String");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the field in int , float or double");
    this.setHelpUrl("");
  };
  return block;
}

function buildFirebaseReadText() {
  const block = new BlockBuilder("firebase_read_text")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const node = generator.valueToCode(b, "node", generator.ORDER_ATOMIC);
      return [`Firebase_getString_value(${node})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."));
    this.appendDummyInput().appendField(
      iotLabel("Firebase_Read_String_Node", "Read the text in node")
    );
    this.appendValueInput("node").setCheck("String");
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the field in int , float or double");
    this.setHelpUrl("");
  };
  return block;
}

function buildFirebaseDeleteNode() {
  const block = new BlockBuilder("firebase_delete_node")
    .setCategory(FIREBASE_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "firebase"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const node = generator.valueToCode(b, "node", generator.ORDER_ATOMIC);
      return `if (Firebase.ready()) Firebase.RTDB.deleteNode(&fbdo, ${node});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("firebase.png"))
      .appendField(iotLabel("firebase_name", "Firebase."))
      .appendField(iotLabel("firebase_delete", "Delete node"));
    this.appendValueInput("node").setCheck("String");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Write a text value in BBDD in the node");
  };
  return block;
}

export const FIREBASE_BLOCKS = [
  buildFirebaseInit(),
  buildFirebaseStart(),
  buildFirebaseWriteNum(),
  buildFirebaseWriteText(),
  buildFirebaseReadNum(),
  buildFirebaseReadText(),
  buildFirebaseDeleteNode(),
];
