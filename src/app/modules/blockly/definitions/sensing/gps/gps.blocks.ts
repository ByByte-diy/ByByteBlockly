import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { initBlockLabel } from "../../../lib/helpers/block-label.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  GPS_CATEGORY,
  GPS_DEFAULT_PINS,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createAllPinDropdownField,
  createBlockIconField,
  sensingLabel,
} from "../sensing.helper";

const GPS_GLOBALS =
  "float flat,flon,falt,fc,fk,fmph,fmps,fkmph;\n" +
  "int year;\n" +
  "byte month, day, hour, minutes, second, hundredths,nsat;\n" +
  "unsigned long fix_age; \n";

function ensureGpsGlobals(generator: any): void {
  registerInclude(
    generator,
    "TinyGPSPlus.h",
    "TinyGPSPlus — parse NMEA from GPS modules."
  );
  registerGlobalVariable(generator, "gps", "TinyGPSPlus gps;", "GPS parser instance.");
  registerDefinition(generator, "gps_variables", GPS_GLOBALS, "Cached GPS readings.");
}

function buildGpsInitSoftwareSerial() {
  const block = new BlockBuilder("GPS_init_ss")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps", "init", "softwareserial"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pinRx = b.getFieldValue("PIN_RX");
      const pinTx = b.getFieldValue("PIN_TX");
      registerInclude(generator, "SoftwareSerial.h");
      ensureGpsGlobals(generator);
      registerDefinition(
        generator,
        "softwareserial_gps",
        `SoftwareSerial mySoftwareSerialgps(${pinTx},${pinRx});`,
        "GPS SoftwareSerial port."
      );
      return `mySoftwareSerialgps.begin(9600);\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("GPS.png"))
      .appendField(initBlockLabel("GPS_init", "GPS"));
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_TX", "TX"))
      .appendField(createAllPinDropdownField(), "PIN_TX");
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_RX", "RX"))
      .appendField(createAllPinDropdownField(), "PIN_RX");
    applyDefaultAllPinFields(this, GPS_DEFAULT_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "GPS_INIT_TOOLTIP",
        "Initialize NEO-6M GPS via SoftwareSerial (9600 baud)."
      )
    );
  };
  return block;
}

function buildGpsInitEsp32() {
  const block = new BlockBuilder("GPS_init_esp32")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(["esp32"])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps", "init", "esp32", "serial2"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_INIT_ESP32_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pinRx = b.getFieldValue("PIN_RX");
      const pinTx = b.getFieldValue("PIN_TX");
      ensureGpsGlobals(generator);
      registerDefinition(
        generator,
        "GPS_serial2",
        "HardwareSerial &mySoftwareSerialgps=Serial2;",
        "ESP32 GPS on Serial2."
      );
      return `mySoftwareSerialgps.begin(9600, SERIAL_8N1, ${pinTx}, ${pinRx});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("GPS.png"))
      .appendField(initBlockLabel("GPS_init", "GPS"))
      .appendField("ESP32");
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_TX", "TX"))
      .appendField(createAllPinDropdownField(), "PIN_TX");
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_RX", "RX"))
      .appendField(createAllPinDropdownField(), "PIN_RX");
    applyDefaultAllPinFields(this, GPS_DEFAULT_PINS);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "GPS_INIT_ESP32_TOOLTIP",
        "Initialize GPS on ESP32 Serial2 (9600 baud)."
      )
    );
  };
  return block;
}

function buildGpsReadValues() {
  const block = new BlockBuilder("GPS_read_save_values")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_READ_TOOLTIP}")
    .setArduinoGenerator((_b, _generator) => {
      return (
        "while (mySoftwareSerialgps.available()>0)\n" +
        " {\n" +
        "  if (gps.encode(mySoftwareSerialgps.read())) \n" +
        "   {\n" +
        "    if (gps.location.isValid()) \n" +
        "    { flat= gps.location.lat();\n flon =gps.location.lng(); }\n" +
        "    if (gps.altitude.isValid()) \n" +
        "    { falt= gps.altitude.meters(); }\n" +
        "    if (gps.course.isValid()) \n" +
        "    { fc= gps.course.deg(); }\n" +
        "    if (gps.satellites.isValid()) \n" +
        "    { nsat=gps.satellites.value(); }\n" +
        "    if (gps.speed.isValid()) \n" +
        "    { fk=gps.speed.knots();\n fmph=gps.speed.mph();\n fmps= gps.speed.mps();\n fkmph =gps.speed.kmph(); }\n" +
        "    if (gps.date.isValid()) \n" +
        "    { year=gps.date.year();\n month=gps.date.month();\n day=gps.date.day(); }\n" +
        "    if (gps.time.isValid()) \n" +
        "    { hour=gps.time.hour();\n minutes=gps.time.minute();\n second=gps.time.second(); }\n" +
        "   }\n" +
        "  }\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_name", "GPS NEO-6"))
      .appendField(sensingLabel("GPS_readvalues", "read and save values"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      sensingLabel(
        "GPS_READ_TOOLTIP",
        "Parse incoming NMEA and update cached GPS variables."
      )
    );
  };
  return block;
}

function gpsLocationOptions(): [string, string][] {
  return [
    ["Latitude", "0"],
    ["Longitude", "1"],
    ["Altitude in meters", "2"],
    ["Course in degrees", "3"],
    ["Number of satellites", "4"],
  ];
}

function buildGpsLocation() {
  const block = new BlockBuilder("GPS_location")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_LOCATION_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const parameter = b.getFieldValue("PARAMETERS1");
      let code = "flat";
      if (parameter === "1") {
        code = "flon";
      } else if (parameter === "2") {
        code = "falt";
      } else if (parameter === "3") {
        code = "fc";
      } else if (parameter === "4") {
        code = "nsat";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_name", "GPS NEO-6"))
      .appendField(sensingLabel("GPS_paramter", "location parameters:"))
      .appendField(new Blockly.FieldDropdown(gpsLocationOptions), "PARAMETERS1");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("GPS_LOCATION_TOOLTIP", "Returns cached location parameter.")
    );
  };
  return block;
}

function gpsSpeedOptions(): [string, string][] {
  return [
    ["Speed in knots", "0"],
    ["Speed in miles/h", "1"],
    ["Speed in m/sec", "2"],
    ["Speed in km/h", "3"],
  ];
}

function buildGpsSpeed() {
  const block = new BlockBuilder("GPS_speed")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_SPEED_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const parameter = b.getFieldValue("PARAMETERS2");
      let code = "fk";
      if (parameter === "1") {
        code = "fmph";
      } else if (parameter === "2") {
        code = "fmps";
      } else if (parameter === "3") {
        code = "fkmph";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_name", "GPS NEO-6"))
      .appendField(new Blockly.FieldDropdown(gpsSpeedOptions), "PARAMETERS2");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("GPS_SPEED_TOOLTIP", "Returns cached speed value.")
    );
  };
  return block;
}

function gpsDateTimeOptions(): [string, string][] {
  return [
    ["Year", "0"],
    ["Month", "1"],
    ["Day", "2"],
    ["Hours", "3"],
    ["Minutes", "4"],
    ["Seconds", "5"],
  ];
}

function buildGpsDateTime() {
  const block = new BlockBuilder("GPS_datetime")
    .setCategory(GPS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "gps"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_GPS_DATETIME_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const parameter = b.getFieldValue("PARAMETERS3");
      let code = "year";
      if (parameter === "1") {
        code = "month";
      } else if (parameter === "2") {
        code = "day";
      } else if (parameter === "3") {
        code = "hour";
      } else if (parameter === "4") {
        code = "minutes";
      } else if (parameter === "5") {
        code = "second";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(sensingLabel("GPS_name", "GPS NEO-6"))
      .appendField(sensingLabel("GPS_paramter3", "date time:"))
      .appendField(new Blockly.FieldDropdown(gpsDateTimeOptions), "PARAMETERS3");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("GPS_DATETIME_TOOLTIP", "Returns cached date/time field.")
    );
  };
  return block;
}

export const GPS_BLOCKS = [
  buildGpsInitSoftwareSerial(),
  buildGpsInitEsp32(),
  buildGpsReadValues(),
  buildGpsLocation(),
  buildGpsSpeed(),
  buildGpsDateTime(),
];
