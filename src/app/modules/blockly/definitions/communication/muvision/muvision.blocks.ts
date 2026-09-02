import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOUR,
  MUVISION_PLATFORMS,
  MUVISION_CATEGORY,
  MUVISION_LEVEL,
} from "../config";
import {
  attachSerialPortWarning,
  attachSetupOnlyWarning,
  createBlockIconField,
  createDetectColourField,
  createLedColourField,
  FUN_MU3_AT_READ8,
  FUN_MU3_AT_WRITE8,
  FUN_MU3_READ_GESTURE,
  FUN_MU_VS2_GET_COLOR_DETECT_LABEL,
  FUN_MU_VS2_GET_COLOR_RCG_LABEL,
  K_MU_NAME,
  LED_COLOR_MAP,
  MU_COLOR_MAP,
  MU_OBJ_OPTIONS,
  muLabel,
  Mu3AtPort,
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
  registerSetup,
  setMu3AtPort,
  VISION_CARD_TYPE_OPTIONS,
  VS_VISION_TYPE_OPTIONS,
} from "./muvision.helper";

function visionStatusOptions(): [string, string][] {
  return [
    [muLabel("LKL_VS2_ENABLE", "enable"), "Begin"],
    [muLabel("LKL_VS2_DISABLE", "disable"), "End"],
  ];
}

function visionLevelOptions(): [string, string][] {
  return [
    [muLabel("LKL_VS2_AUTO", "auto"), "kLevelDefault"],
    [muLabel("LKL_VS2_HIGH_SPEED", "highSpeed"), "kLevelSpeed"],
    [muLabel("LKL_VS2_NORMAL", "normal"), "kLevelBalance"],
    [muLabel("LKL_VS2_HIGH_ACCURACY", "highAccuracy"), "kLevelAccuracy"],
  ];
}

function visionZoomOptions(): [string, string][] {
  const level = muLabel("LKL_VS2_LEVEL", "level");
  return [
    [muLabel("LKL_VS2_AUTO", "auto"), "kZoomDefault"],
    [`${level}1`, "kZoom1"],
    [`${level}2`, "kZoom2"],
    [`${level}3`, "kZoom3"],
    [`${level}4`, "kZoom4"],
    [`${level}5`, "kZoom5"],
  ];
}

function cameraAwbOptions(): [string, string][] {
  return [
    [muLabel("LKL_VS2_AUTO", "auto"), "kAutoWhiteBalance"],
    [muLabel("LKL_VS2_LOCK_AWB", "LockAWB"), "kLockWhiteBalance"],
    [muLabel("LKL_VS2_WHITE_LIGHT", "WhiteLight"), "kWhiteLight"],
    [muLabel("LKL_VS2_YELLOW_LIGHT", "YellowLight"), "kYellowLight"],
  ];
}

function uartBaudOptions(): [string, string][] {
  return [
    ["9600", "kBaud9600"],
    ["19200", "kBaud19200"],
    ["38400", "kBaud38400"],
    ["57600", "kBaud57600"],
    ["115200", "kBaud115200"],
    ["230400", "kBaud230400"],
    ["460800", "kBaud460800"],
    ["921600", "kBaud921600"],
  ];
}

function serialPortOptions(): [string, string][] {
  return [["I2C", "Wire"]];
}

type Vs2GetMessageBlock = Blockly.Block & {
  vision_type_: string;
  DETECTED_MESSAGE: [string, string][];
  ColorRCGMessage: [string, string][];
  generateMessageType(): void;
};

type Vs2GetCardTypeBlock = Blockly.Block & {
  vision_type_: string;
  traffic_card_type_: [string, string][];
  number_card_type_: [string, string][];
  shape_card_type_: [string, string][];
  card_class_dic_: Record<string, [string, string][]>;
};

// --- Vs2MuInit ---
export const vs2MuInitBlock = new BlockBuilder("Vs2MuInit")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip(
    muLabel(
      "LKL_VS2_HELP_INIT",
      "initialize MU vision sensor, and choose the port."
    )
  )
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const serial = block.getFieldValue("SERIAL");
    const offset = parseInt(muObj, 10);
    const address = 0x60 + offset;
    registerInclude(
      generator,
      "MuVisionSensor.h",
      "MuVisionSensor library for MU vision sensor."
    );
    registerDefinition(
      generator,
      `var_declare_vs2_mu${muObj}`,
      `MuVisionSensor MU${muObj}(0x${address.toString(16)});`,
      `MU vision sensor instance MU${muObj}.`
    );
    if (serial === "Wire") {
      registerInclude(generator, "Wire.h", "I2C bus for MU vision sensor.");
      registerSetup(generator, "setup_i2c", "Wire.begin();\n");
    }
    return `${K_MU_NAME}${muObj}.begin(&${serial});\n`;
  })
  .build();

vs2MuInitBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(
    createBlockIconField("muvision.png", "remoteWide")
  );
  this.appendDummyInput()
    .appendField(muLabel("LKL_VS2_MU", "initialize"))
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(` ${muLabel("LKL_VS2_SERIAL", "port")}`)
    .appendField(new Blockly.FieldDropdown(serialPortOptions()), "SERIAL");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSerialPortWarning(this);
};

// --- Vs2Setup ---
export const vs2SetupBlock = new BlockBuilder("Vs2Setup")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    let branch = generator.statementToCode(block, "SETUP_BLOCK");
    branch = branch.replace(/  /g, "");
    branch = branch.replace(
      new RegExp(`${K_MU_NAME}0\\.`, "g"),
      `${K_MU_NAME}${muObj}.`
    );
    return branch;
  })
  .build();

vs2SetupBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_SetupVS", "setup")}`)
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ");
  this.appendStatementInput("SETUP_BLOCK");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Vs2Reset ---
export const vs2ResetBlock = new BlockBuilder("Vs2Reset")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator(() => {
    return `while(${K_MU_NAME}0.SensorSetDefault() != MU_OK);\n`;
  })
  .build();

vs2ResetBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(
    `📷 ${muLabel("LKL_VS2_RESET", "reset to default")}`
  );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetLEDColor ---
export const vs2SetLedColorBlock = new BlockBuilder("Vs2SetLEDColor")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const ledId = block.getFieldValue("LED_ID");
    const detectColor = LED_COLOR_MAP[block.getFieldValue("LEDColorDetect")];
    const undetectColor =
      LED_COLOR_MAP[block.getFieldValue("LEDColorUndetect")];
    const ledLevel =
      generator.valueToCode(block, "LEDLevel", generator.ORDER_NONE) || "1";
    let code =
      `while(${K_MU_NAME}0.LedSetColor(${ledId}, ${detectColor}, ${undetectColor}, ${ledLevel}) != MU_OK);\n`;
    if (detectColor === undetectColor) {
      code += `while(${K_MU_NAME}0.LedSetMode(${ledId}, 1, 1) != MU_OK);\n`;
    } else {
      code += `while(${K_MU_NAME}0.LedSetMode(${ledId}, 0, 0) != MU_OK);\n`;
    }
    return code;
  })
  .build();

vs2SetLedColorBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField("📷 ");
  this.appendDummyInput()
    .appendField("LED")
    .appendField(
      new Blockly.FieldDropdown([
        ["1", "kLed1"],
        ["2", "kLed2"],
        [muLabel("LKL_VS2_ALL", "All"), "kLedAll"],
      ]),
      "LED_ID"
    )
    .appendField(` ${muLabel("LKL_VS2_LED_DETECT_COLOR", "when detected then")}`)
    .appendField(createLedColourField("#0000ff"), "LEDColorDetect")
    .appendField(` ${muLabel("LKL_VS2_LED_UNDETECT_COLOR", "else")}`)
    .appendField(createLedColourField("#ff0000"), "LEDColorUndetect");
  this.appendValueInput("LEDLevel")
    .appendField(` ${muLabel("LKL_VS2_BRIGHTNESS", "brightness")}(0~15)`)
    .setCheck("Number");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2VisionBegin ---
export const vs2VisionBeginBlock = new BlockBuilder("Vs2VisionBegin")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const status = block.getFieldValue("VisionStatus");
    const visionType = block.getFieldValue("VisionType");
    return `while(${K_MU_NAME}0.Vision${status}(${visionType}) != MU_OK);\n`;
  })
  .build();

vs2VisionBeginBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField("📷 ");
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(visionStatusOptions()), "VisionStatus")
    .appendField(muLabel("LKL_VS2_VISION_TYPE", "algorithm"))
    .appendField(new Blockly.FieldDropdown(VS_VISION_TYPE_OPTIONS), "VisionType");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetVisionLevel ---
export const vs2SetVisionLevelBlock = new BlockBuilder("Vs2SetVisionLevel")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip(
    muLabel(
      "LKL_VS2_HELP_VISION_LEVEL",
      "Set the recognition level, the level increases, the false alarm rate decreases, and the recognition rate will decrease accordingly."
    )
  )
  .setArduinoGenerator((block) => {
    const visionType = block.getFieldValue("VisionType");
    const visionLevel = block.getFieldValue("VisionLevel");
    return `while(${K_MU_NAME}0.VisionSetLevel(${visionType}, ${visionLevel}) != MU_OK);\n`;
  })
  .build();

vs2SetVisionLevelBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_VISION_TYPE", "algorithm")}`)
    .appendField(new Blockly.FieldDropdown(VS_VISION_TYPE_OPTIONS), "VisionType")
    .appendField(` ${muLabel("LKL_VS2_SET_VISION_LEVEL", "level")}`)
    .appendField(new Blockly.FieldDropdown(visionLevelOptions()), "VisionLevel");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetVisionZoom ---
export const vs2SetVisionZoomBlock = new BlockBuilder("Vs2SetVisionZoom")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip(
    muLabel(
      "LKL_VS2_HELP_VISION_ZOOM",
      "Set the image zoom level, the level is raised, the farther the recognition distance is, the smaller the recognition angle is."
    )
  )
  .setArduinoGenerator((block) => {
    const zoom = block.getFieldValue("VisionZoom");
    return `while(${K_MU_NAME}0.CameraSetZoom(${zoom}) != MU_OK);\n`;
  })
  .build();

vs2SetVisionZoomBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_SET_VISION_ZOOM", "zoom")}`)
    .appendField(new Blockly.FieldDropdown(visionZoomOptions()), "VisionZoom");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetColorRecognitionRegion ---
export const vs2SetColorRecognitionRegionBlock = new BlockBuilder(
  "Vs2SetColorRecognitionRegion"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const width =
      generator.valueToCode(block, "Width", generator.ORDER_NONE) || "5";
    const height =
      generator.valueToCode(block, "Height", generator.ORDER_NONE) || "5";
    let code = `while(${K_MU_NAME}0.write(VISION_COLOR_RECOGNITION, kWidthValue,${width}) != MU_OK);\n`;
    code += `while(${K_MU_NAME}0.write(VISION_COLOR_RECOGNITION, kHeightValue,${height}) != MU_OK);\n`;
    return code;
  })
  .build();

vs2SetColorRecognitionRegionBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(
      `📷 ${muLabel("LKL_VS2_VISION_COLOR_RECOGNITION", "ColorRecognition")}`
    )
    .appendField(
      muLabel("LKL_VS2_SET_RECOGNITION_REGION", "set recognition region")
    );
  this.appendValueInput("Width")
    .setCheck("Number")
    .appendField(`${muLabel("LKL_VS2_STATE_VALUE_WIDTH", "Width")} =`);
  this.appendValueInput("Height")
    .setCheck("Number")
    .appendField(`${muLabel("LKL_VS2_STATE_VALUE_HEIGHT", "Height")} =`);
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetColorBlockMinBlob ---
export const vs2SetColorBlockMinBlobBlock = new BlockBuilder(
  "Vs2SetColorBlockMinBlob"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const width =
      generator.valueToCode(block, "Width", generator.ORDER_NONE) || "5";
    const height =
      generator.valueToCode(block, "Height", generator.ORDER_NONE) || "5";
    let code = `while(${K_MU_NAME}0.write(VISION_COLOR_DETECT, kWidthValue,${width}) != MU_OK);\n`;
    code += `while(${K_MU_NAME}0.write(VISION_COLOR_DETECT, kHeightValue,${height}) != MU_OK);\n`;
    return code;
  })
  .build();

vs2SetColorBlockMinBlobBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_VISION_COLOR_DETECT", "ColorBlock")}`)
    .appendField(
      muLabel("LKL_VS2_SET_MIN_RECOGNITION_SIZE", "set min recognition size")
    );
  this.appendValueInput("Width")
    .setCheck("Number")
    .appendField(`${muLabel("LKL_VS2_STATE_VALUE_WIDTH", "Width")} =`);
  this.appendValueInput("Height")
    .setCheck("Number")
    .appendField(`${muLabel("LKL_VS2_STATE_VALUE_HEIGHT", "Height")} =`);
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetUARTBaud ---
export const vs2SetUartBaudBlock = new BlockBuilder("Vs2SetUARTBaud")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const baud = block.getFieldValue("BAUD");
    return `while(${K_MU_NAME}0.UartSetBaudrate(${baud}) != MU_OK);\n`;
  })
  .build();

vs2SetUartBaudBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_SET_UART_BAUD", "UART baudrate")}`)
    .appendField(new Blockly.FieldDropdown(uartBaudOptions()), "BAUD");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetCameraRotate ---
export const vs2SetCameraRotateBlock = new BlockBuilder("Vs2SetCameraRotate")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    let rotate = block.getFieldValue("FRAME_ROTATE");
    rotate = rotate === "TRUE" ? "true" : "false";
    return `while(${K_MU_NAME}0.CameraSetRotate(${rotate}) != MU_OK);\n`;
  })
  .build();

vs2SetCameraRotateBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_SET_FRAME_ROTATE", "rotate Frame")}`)
    .appendField(new Blockly.FieldCheckbox("TRUE"), "FRAME_ROTATE");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetCameraHFR ---
export const vs2SetCameraHfrBlock = new BlockBuilder("Vs2SetCameraHFR")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    let hfr = block.getFieldValue("CameraHFR");
    hfr = hfr === "TRUE" ? "kFPSHigh" : "kFPSNormal";
    return `while(${K_MU_NAME}0.CameraSetFPS(${hfr}) != MU_OK);\n`;
  })
  .build();

vs2SetCameraHfrBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_SET_CAMERA_HFR", "high FPS mode")}`)
    .appendField(new Blockly.FieldCheckbox("TRUE"), "CameraHFR");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2SetCameraWhiteBalance ---
export const vs2SetCameraWhiteBalanceBlock = new BlockBuilder(
  "Vs2SetCameraWhiteBalance"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "setup"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const awb = block.getFieldValue("CameraAWB");
    return `while(${K_MU_NAME}0.CameraSetAwb(${awb}) != MU_OK);\n`;
  })
  .build();

vs2SetCameraWhiteBalanceBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(
      `📷 ${muLabel("LKL_VS2_SET_CAMERA_AWB", "camera white balance")}`
    )
    .appendField(new Blockly.FieldDropdown(cameraAwbOptions()), "CameraAWB");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSetupOnlyWarning(this);
};

// --- Vs2Detected ---
export const vs2DetectedBlock = new BlockBuilder("Vs2Detected")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput(["Number", "Boolean"])
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const visionType = block.getFieldValue("VISION_TYPE");
    const code = `${K_MU_NAME}${muObj}.GetValue(${visionType}, kStatus)`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2DetectedBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField("📷 ");
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_DETECTED", "detected"))
    .appendField(new Blockly.FieldDropdown(VS_VISION_TYPE_OPTIONS), "VISION_TYPE");
  this.setInputsInline(true);
  this.setOutput(true, ["Number", "Boolean"]);
};

// --- Vs2DetectedRegionColor ---
export const vs2DetectedRegionColorBlock = new BlockBuilder(
  "Vs2DetectedRegionColor"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput(["Number", "Boolean"])
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const x =
      generator.valueToCode(block, "XValue", generator.ORDER_NONE) || "50";
    const y =
      generator.valueToCode(block, "YValue", generator.ORDER_NONE) || "50";
    registerDefinition(
      generator,
      "funMuVs2GetColorRCGLabel",
      FUN_MU_VS2_GET_COLOR_RCG_LABEL,
      "Read color recognition label at x/y coordinate."
    );
    const code = `MuVs2GetColorRCGLabel(${K_MU_NAME}${muObj}, ${x}, ${y})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2DetectedRegionColorBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField("📷 ");
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_RECOGNIZED", "recognized"))
    .appendField(muLabel("LKL_VS2_COORDINATE", "coordinate"));
  this.appendValueInput("XValue").setCheck("Number").appendField("x=");
  this.appendValueInput("YValue").setCheck("Number").appendField("y=");
  this.appendDummyInput().appendField(muLabel("LKL_VS2_COLOR", "color"));
  this.setInputsInline(true);
  this.setOutput(true, ["Number", "Boolean"]);
};

// --- Vs2DetectedColorDetect ---
export const vs2DetectedColorDetectBlock = new BlockBuilder(
  "Vs2DetectedColorDetect"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput(["Number", "Boolean"])
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const color = MU_COLOR_MAP[block.getFieldValue("DetectColor")];
    registerDefinition(
      generator,
      "funMuVs2GetColorDetectLabel",
      FUN_MU_VS2_GET_COLOR_DETECT_LABEL,
      "Read color detect label for selected color block."
    );
    const code = `MuVs2GetColorDetectLabel(${K_MU_NAME}${muObj}, ${color})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2DetectedColorDetectBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField("📷 ");
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_DETECTED", "detected"))
    .appendField(createDetectColourField("#ff0000"), "DetectColor")
    .appendField(muLabel("LKL_VS2_COLOR_BLOCK", "ColorBlock"));
  this.setInputsInline(true);
  this.setOutput(true, ["Number", "Boolean"]);
};

// --- Vs2GetColorLabel ---
export const vs2GetColorLabelBlock = new BlockBuilder("Vs2GetColorLabel")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput("Boolean")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const color = MU_COLOR_MAP[block.getFieldValue("RCGColor")];
    const code = `(${K_MU_NAME}${muObj}.GetValue(VISION_COLOR_RECOGNITION, kLabel) == ${color})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2GetColorLabelBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_GET_DETECTED_MESSAGE", "get")}`)
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_VISION_TYPE", "algorithm"))
    .appendField(
      muLabel("LKL_VS2_VISION_COLOR_RECOGNITION", "ColorRecognition")
    );
  this.appendDummyInput()
    .appendField(`${muLabel("LKL_VS2_COLOR", "color")}=`)
    .appendField(createDetectColourField("#ff0000"), "RCGColor");
  this.setInputsInline(true);
  this.setOutput(true, "Boolean");
};

// --- Vs2GetMessage ---
export const vs2GetMessageBlock = new BlockBuilder("Vs2GetMessage")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput("Number")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const visionType = block.getFieldValue("VISION_TYPE");
    const message = block.getFieldValue("DETECTED_MESSAGE");
    const code = `${K_MU_NAME}${muObj}.GetValue(${visionType}, ${message})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2GetMessageBlock.init = function (this: Blockly.Block) {
  const block = this as Vs2GetMessageBlock;
  this.setColour(CATEGORY_COLOUR);
  block.DETECTED_MESSAGE = [
    [muLabel("LKL_VS2_STATE_VALUE_X", "Horizontal"), "kXValue"],
    [muLabel("LKL_VS2_STATE_VALUE_Y", "Vertical"), "kYValue"],
    [muLabel("LKL_VS2_STATE_VALUE_WIDTH", "Width"), "kWidthValue"],
    [muLabel("LKL_VS2_STATE_VALUE_HEIGHT", "Height"), "kHeightValue"],
    [muLabel("LKL_VS2_STATE_VALUE_LABEL", "Label"), "kLabel"],
  ];
  block.ColorRCGMessage = [
    [muLabel("LKL_VS2_STATE_VALUE_R_CHANNEL", "ChannelR"), "kRValue"],
    [muLabel("LKL_VS2_STATE_VALUE_G_CHANNEL", "ChannelG"), "kGValue"],
    [muLabel("LKL_VS2_STATE_VALUE_B_CHANNEL", "ChannelB"), "kBValue"],
    [muLabel("LKL_VS2_STATE_VALUE_LABEL", "Label"), "kLabel"],
  ];
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_GET_DETECTED_MESSAGE", "get")}`)
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_VISION_TYPE", "algorithm"))
    .appendField(
      new Blockly.FieldDropdown([...VS_VISION_TYPE_OPTIONS]),
      "VISION_TYPE"
    );
  block.vision_type_ = "";
  block.generateMessageType = function (this: Vs2GetMessageBlock) {
    let typeIndex = -1;
    if (this.vision_type_ !== "") {
      const lastMessageType = this.getFieldValue("DETECTED_MESSAGE");
      const colorMessage = this.ColorRCGMessage.map((item) => item[1]);
      const otherMessage = this.DETECTED_MESSAGE.map((item) => item[1]);
      if (colorMessage.indexOf(lastMessageType) !== -1) {
        typeIndex = colorMessage.indexOf(lastMessageType);
      } else if (otherMessage.indexOf(lastMessageType) !== -1) {
        typeIndex = otherMessage.indexOf(lastMessageType);
      }
    }

    this.vision_type_ = this.getFieldValue("VISION_TYPE");
    if (this.getInput("DetectedMessage")) {
      this.removeInput("DetectedMessage");
    }
    if (this.vision_type_ === "VISION_COLOR_RECOGNITION") {
      this.appendDummyInput("DetectedMessage")
        .appendField(
          new Blockly.FieldDropdown(this.ColorRCGMessage),
          "DETECTED_MESSAGE"
        )
        .appendField(muLabel("LKL_VS2_VALUE", "value"));
      if (typeIndex !== -1) {
        if (typeIndex === this.DETECTED_MESSAGE.length - 1) {
          this.setFieldValue(
            this.ColorRCGMessage[this.ColorRCGMessage.length - 1][1],
            "DETECTED_MESSAGE"
          );
        } else {
          this.setFieldValue(
            this.ColorRCGMessage[typeIndex][1],
            "DETECTED_MESSAGE"
          );
        }
      }
    } else {
      this.appendDummyInput("DetectedMessage")
        .appendField(
          new Blockly.FieldDropdown(this.DETECTED_MESSAGE),
          "DETECTED_MESSAGE"
        )
        .appendField(muLabel("LKL_VS2_VALUE", "value"));
      if (typeIndex !== -1) {
        if (typeIndex === this.ColorRCGMessage.length - 1) {
          this.setFieldValue(
            this.DETECTED_MESSAGE[this.DETECTED_MESSAGE.length - 1][1],
            "DETECTED_MESSAGE"
          );
        } else {
          this.setFieldValue(
            this.DETECTED_MESSAGE[typeIndex][1],
            "DETECTED_MESSAGE"
          );
        }
      }
    }
  };
  block.generateMessageType();
  this.setInputsInline(true);
  this.setOutput(true, "Number");
  this.setOnChange(function (this: Vs2GetMessageBlock) {
    const visionType = this.getFieldValue("VISION_TYPE");
    if (this.vision_type_ !== visionType) {
      if (
        this.vision_type_ === "VISION_COLOR_RECOGNITION" ||
        visionType === "VISION_COLOR_RECOGNITION"
      ) {
        this.generateMessageType();
      } else {
        this.vision_type_ = visionType;
      }
    }
  });
};

// --- Vs2GetCardType ---
export const vs2GetCardTypeBlock = new BlockBuilder("Vs2GetCardType")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision"])
  .setOutput("Boolean")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MuObj");
    const visionType = block.getFieldValue("VisionCardType");
    const cardType = block.getFieldValue("CardType");
    const code = `(${K_MU_NAME}${muObj}.GetValue(${visionType}, kLabel) == ${cardType})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

vs2GetCardTypeBlock.init = function (this: Blockly.Block) {
  const block = this as Vs2GetCardTypeBlock;
  this.setColour(CATEGORY_COLOUR);
  block.traffic_card_type_ = [
    ["Foward", "MU_TRAFFIC_CARD_FORWARD"],
    ["Left", "MU_TRAFFIC_CARD_LEFT"],
    ["Right", "MU_TRAFFIC_CARD_RIGHT"],
    ["Turn Around", "MU_TRAFFIC_CARD_TURN_AROUND"],
    ["Park", "MU_TRAFFIC_CARD_PARK"],
  ];
  block.number_card_type_ = [
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["0", "0"],
  ];
  block.shape_card_type_ = [
    ["Tick", "MU_SHAPE_CARD_TICK"],
    ["Cross", "MU_SHAPE_CARD_CROSS"],
    ["Circle", "MU_SHAPE_CARD_CIRCLE"],
    ["Square", "MU_SHAPE_CARD_SQUARE"],
    ["Triangle", "MU_SHAPE_CARD_TRIANGLE"],
  ];
  block.card_class_dic_ = {
    VISION_SHAPE_CARD_DETECT: block.shape_card_type_,
    VISION_TRAFFIC_CARD_DETECT: block.traffic_card_type_,
    VISION_NUM_CARD_DETECT: block.number_card_type_,
  };
  this.appendDummyInput()
    .appendField(`📷 ${muLabel("LKL_VS2_GET_DETECTED_MESSAGE", "get")}`)
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MuObj")
    .appendField(muLabel("LKL_VS2_VISION_TYPE", "algorithm"))
    .appendField(new Blockly.FieldDropdown(VISION_CARD_TYPE_OPTIONS), "VisionCardType")
    .appendField(` ${muLabel("LKL_VS2_CARD_TYPE", "type")}=`);
  block.vision_type_ = block.getFieldValue("VisionCardType");
  this.appendDummyInput("CARD_TYPE").appendField(
    new Blockly.FieldDropdown(block.card_class_dic_[block.vision_type_]),
    "CardType"
  );
  this.setInputsInline(true);
  this.setOutput(true, "Boolean");
  this.setOnChange(function (this: Vs2GetCardTypeBlock) {
    const visionType = this.getFieldValue("VisionCardType");
    if (this.vision_type_ !== visionType) {
      this.vision_type_ = visionType;
      const lastCardType = this.getFieldValue("CardType");
      const trafficCardType = this.traffic_card_type_.map((item) => item[1]);
      const numberCardType = this.number_card_type_.map((item) => item[1]);
      const shapeCardType = this.shape_card_type_.map((item) => item[1]);
      let typeIndex = -1;
      if (trafficCardType.indexOf(lastCardType) !== -1) {
        typeIndex = trafficCardType.indexOf(lastCardType);
      } else if (numberCardType.indexOf(lastCardType) !== -1) {
        typeIndex = numberCardType.indexOf(lastCardType);
      } else if (shapeCardType.indexOf(lastCardType) !== -1) {
        typeIndex = shapeCardType.indexOf(lastCardType);
      }
      if (this.getInput("CARD_TYPE")) {
        this.removeInput("CARD_TYPE");
      }
      this.appendDummyInput("CARD_TYPE").appendField(
        new Blockly.FieldDropdown(this.card_class_dic_[this.vision_type_]),
        "CardType"
      );
      this.setFieldValue(
        this.card_class_dic_[this.vision_type_][typeIndex][1],
        "CardType"
      );
    }
  });
};

// --- Mu3LsBegin ---
export const mu3LsBeginBlock = new BlockBuilder("Mu3LsBegin")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const lsType = block.getFieldValue("LS_TYPE");
    return `${K_MU_NAME}${muObj}.LsBegin(${lsType});\n`;
  })
  .build();

mu3LsBeginBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_ENABLE", "enable"))
    .appendField(
      new Blockly.FieldDropdown([
        [muLabel("LKL_VS2_PROXIMITY", "proximity detection"), "LS_PROXIMITY_ENABLE"],
        [muLabel("LKL_VS2_ALS", "ambient light detection"), "LS_AMBIENT_LIGHT_ENABLE"],
        [muLabel("LKL_VS2_GESTURE_SENSOR", "gesture detection"), "LS_GESTURE_ENABLE"],
      ]),
      "LS_TYPE"
    );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3LsSetSensitivity ---
export const mu3LsSetSensitivityBlock = new BlockBuilder("Mu3LsSetSensitivity")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const sensitivity = block.getFieldValue("SENSITIVITY");
    return `${K_MU_NAME}${muObj}.LsSetSensitivity(${sensitivity});\n`;
  })
  .build();

mu3LsSetSensitivityBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_SET", "set"))
    .appendField(muLabel("LKL_VS2_SENSITIVITY", "sensitivity"))
    .appendField(
      new Blockly.FieldDropdown([
        [muLabel("LKL_VS2_DEFAULT", "default"), "kSensitivityDefault"],
        [muLabel("LKL_VS2_LOW", "low"), "kSensitivity1"],
        [muLabel("LKL_VS2_MID", "middle"), "kSensitivity2"],
        [muLabel("LKL_VS2_HIGH", "high"), "kSensitivity3"],
      ]),
      "SENSITIVITY"
    );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3LsWhiteBalanceEnable ---
export const mu3LsWhiteBalanceEnableBlock = new BlockBuilder(
  "Mu3LsWhiteBalanceEnable"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block) => {
    const muObj = block.getFieldValue("MU_OBJ");
    return `${K_MU_NAME}${muObj}.LsWhiteBalanceEnable();\n`;
  })
  .build();

mu3LsWhiteBalanceEnableBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_WB_CORRECTION", "white balance correction"));
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3LsReadProximity ---
export const mu3LsReadProximityBlock = new BlockBuilder("Mu3LsReadProximity")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor"])
  .setOutput("Number")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    return [`${K_MU_NAME}${muObj}.LsReadProximity()`, generator.ORDER_ATOMIC];
  })
  .build();

mu3LsReadProximityBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_READ", "read"))
    .appendField(muLabel("LKL_VS2_PROXIMITY", "proximity detection"));
  this.setInputsInline(true);
  this.setOutput(true, "Number");
};

// --- Mu3LsReadAmbientLight ---
export const mu3LsReadAmbientLightBlock = new BlockBuilder(
  "Mu3LsReadAmbientLight"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor"])
  .setOutput("Number")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    return [`${K_MU_NAME}${muObj}.LsReadAmbientLight()`, generator.ORDER_ATOMIC];
  })
  .build();

mu3LsReadAmbientLightBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_READ", "read"))
    .appendField(muLabel("LKL_VS2_ALS", "ambient light detection"));
  this.setInputsInline(true);
  this.setOutput(true, "Number");
};

// --- Mu3LsDetectedGesture ---
export const mu3LsDetectedGestureBlock = new BlockBuilder("Mu3LsDetectedGesture")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor", "gesture"])
  .setOutput("Number")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    registerGlobalVariable(
      generator,
      "declare_gesture",
      "MuVsLsGesture mu3_gesture[4];",
      "Gesture state buffer for MU light sensor."
    );
    registerDefinition(
      generator,
      "funMu3ReadGesture",
      FUN_MU3_READ_GESTURE,
      "Read and cache MU light sensor gesture."
    );
    const code = `Mu3ReadGesture(${K_MU_NAME}${muObj}, ${muObj})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

mu3LsDetectedGestureBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(muLabel("LKL_VS2_DETECTED", "detected"))
    .appendField(muLabel("LKL_VS2_GESTURE", "gesture"));
  this.setInputsInline(true);
  this.setOutput(true, "Number");
};

// --- Mu3LsDetectedGestureType ---
export const mu3LsDetectedGestureTypeBlock = new BlockBuilder(
  "Mu3LsDetectedGestureType"
)
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "light-sensor", "gesture"])
  .setOutput("Boolean")
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const muObj = block.getFieldValue("MU_OBJ");
    const gesture = block.getFieldValue("GESTURE");
    const code = `(mu3_gesture[${muObj}] == ${gesture})`;
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

mu3LsDetectedGestureTypeBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput()
    .appendField(new Blockly.FieldDropdown(MU_OBJ_OPTIONS), "MU_OBJ")
    .appendField(muLabel("LKL_VS2_LIGHT_SENSOR", "light sensor"))
    .appendField(`${muLabel("LKL_VS2_GESTURE", "gesture")} =`)
    .appendField(
      new Blockly.FieldDropdown([
        [muLabel("LKL_VS2_GESTURE_UP", "upward"), "kGestureUp"],
        [muLabel("LKL_VS2_GESTURE_DOWN", "downward"), "kGestureDown"],
        [muLabel("LKL_VS2_GESTURE_LEFT", "leftward"), "kGestureLeft"],
        [muLabel("LKL_VS2_GESTURE_RIGHT", "rightward"), "kGestureRight"],
        [muLabel("LKL_VS2_GESTURE_LIFT_UP", "pull"), "kGesturePush"],
        [muLabel("LKL_VS2_GESTURE_PUSH_DOWN", "push"), "kGesturePull"],
      ]),
      "GESTURE"
    );
  this.setInputsInline(true);
  this.setOutput(true, "Boolean");
};

// --- Mu3AtWiFiInit ---
export const mu3AtWiFiInitBlock = new BlockBuilder("Mu3AtWiFiInit")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const serial = block.getFieldValue("SERIAL");
    const baud =
      generator.valueToCode(block, "BAUD", generator.ORDER_NONE) || "9600";
    setMu3AtPort(serial);
    registerInclude(
      generator,
      "MuVisionSensor3_AT.h",
      "MuVisionSensor3 AT WiFi library."
    );
    registerDefinition(
      generator,
      "funMu3AtRead8",
      FUN_MU3_AT_READ8.replace(/SERIAL_PORT/g, serial),
      "Read one byte from MU AT serial port."
    );
    registerDefinition(
      generator,
      "funMu3AtWrite8",
      FUN_MU3_AT_WRITE8.replace("SERIAL_PORT", serial),
      "Write one byte to MU AT serial port."
    );
    registerDefinition(
      generator,
      "define_mu3_at",
      "MuVisionSensor3_AT MU3_AT(Mu3AtRead8, Mu3AtWrite8);",
      "MU3 AT WiFi bridge instance."
    );
    let code = `${serial}.begin(9600);\n`;
    if (baud !== "9600") {
      code += `MU3_AT.UartBaud("${baud}");\n`;
      code += `${serial}.begin(${baud});\n`;
    }
    return code;
  })
  .build();

mu3AtWiFiInitBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_MU", "initialize"))
    .appendField(muLabel("LKL_VS2_SERIAL", "port"))
    .appendField(new Blockly.FieldDropdown(serialPortOptions()), "SERIAL");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  attachSerialPortWarning(this);
};

// --- Mu3AtWiFiSet ---
export const mu3AtWiFiSetBlock = new BlockBuilder("Mu3AtWiFiSet")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const ssid = generator.valueToCode(block, "SSID", generator.ORDER_NONE);
    const password = generator.valueToCode(block, "PASSWORD", generator.ORDER_NONE);
    const mode = block.getFieldValue("MODE");
    return `MU3_AT.WifiSet(${ssid}, ${password}, ${mode});\n`;
  })
  .build();

mu3AtWiFiSetBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_SET", "set"));
  this.appendValueInput("SSID")
    .setCheck("String")
    .appendField(muLabel("LKL_VS2_SSID", "ssid"));
  this.appendValueInput("PASSWORD")
    .setCheck("String")
    .appendField(muLabel("LKL_VS2_PASSWORD", "password"));
  this.appendDummyInput()
    .appendField(muLabel("LKL_VS2_MODE", "mode"))
    .appendField(
      new Blockly.FieldDropdown([
        [muLabel("LKL_VS2_CLIENT", "client"), '"STA"'],
        [muLabel("LKL_VS2_HOT_SPOT", "hot-spot"), '"AP"'],
      ]),
      "MODE"
    );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3AtWiFiCon ---
export const mu3AtWiFiConBlock = new BlockBuilder("Mu3AtWiFiCon")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setOutput("Boolean")
  .setInputsInline(true)
  .setArduinoGenerator((_block, generator) => {
    return ['!MU3_AT.WifiCon("1")', generator.ORDER_ATOMIC];
  })
  .build();

mu3AtWiFiConBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(`${muLabel("LKL_VS2_WAIT_CONNECT", "connection succeeded")}?`);
  this.setInputsInline(true);
  this.setOutput(true, "Boolean");
};

// --- Mu3AtWiFiDiscon ---
export const mu3AtWiFiDisconBlock = new BlockBuilder("Mu3AtWiFiDiscon")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator(() => 'MU3_AT.WifiCon("0");\n')
  .build();

mu3AtWiFiDisconBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_DISCONNECT", "disconnect"));
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3AtWiFiUDP ---
export const mu3AtWiFiUdpBlock = new BlockBuilder("Mu3AtWiFiUDP")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const ip = generator.valueToCode(block, "IP", generator.ORDER_NONE);
    const port = generator.valueToCode(block, "PORT", generator.ORDER_NONE);
    return `MU3_AT.WifiUDP(${ip}, ${port});\n`;
  })
  .build();

mu3AtWiFiUdpBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_SET", "set"));
  this.appendValueInput("IP")
    .setCheck("String")
    .appendField(muLabel("LKL_VS2_TARGET_IP", "target IP"));
  this.appendValueInput("PORT")
    .setCheck("String")
    .appendField(muLabel("LKL_VS2_SERIAL", "port"));
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

// --- Mu3AtWiFiCip ---
export const mu3AtWiFiCipBlock = new BlockBuilder("Mu3AtWiFiCip")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setOutput("String")
  .setInputsInline(true)
  .setArduinoGenerator((_block, generator) => {
    return ["MU3_AT.WifiCIP().begin()", generator.ORDER_ATOMIC];
  })
  .build();

mu3AtWiFiCipBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_READ", "read"))
    .appendField(muLabel("LKL_VS2_TARGET_IP", "target IP"));
  this.setInputsInline(true);
  this.setOutput(true, "String");
};

// --- Mu3AtWiFiSip ---
export const mu3AtWiFiSipBlock = new BlockBuilder("Mu3AtWiFiSip")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setOutput("String")
  .setInputsInline(true)
  .setArduinoGenerator((_block, generator) => {
    return ["MU3_AT.WifiSIP().begin()", generator.ORDER_ATOMIC];
  })
  .build();

mu3AtWiFiSipBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_READ", "read"))
    .appendField(muLabel("LKL_VS2_LOCAL_IP", "local IP"));
  this.setInputsInline(true);
  this.setOutput(true, "String");
};

// --- Mu3AtWiFiRead ---
export const mu3AtWiFiReadBlock = new BlockBuilder("Mu3AtWiFiRead")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setOutput("Number")
  .setInputsInline(true)
  .setArduinoGenerator((_block, generator) => {
    return [`${Mu3AtPort}.read()`, generator.ORDER_ATOMIC];
  })
  .build();

mu3AtWiFiReadBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendDummyInput()
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_READ", "read"));
  this.setInputsInline(true);
  this.setOutput(true, "Number");
};

// --- Mu3AtWiFiWrite ---
export const mu3AtWiFiWriteBlock = new BlockBuilder("Mu3AtWiFiWrite")
  .setCategory(MUVISION_CATEGORY)
  .setColor(0)
  .setPlatforms(MUVISION_PLATFORMS)
  .setLevel(MUVISION_LEVEL)
  .setTags(["communication", "muvision", "wifi"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setArduinoGenerator((block, generator) => {
    const number = generator.valueToCode(block, "NUMBER", generator.ORDER_NONE);
    return `${Mu3AtPort}.write(${number});\n`;
  })
  .build();

mu3AtWiFiWriteBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOUR);
  this.appendDummyInput().appendField(createBlockIconField("wifi.png", "wide"));
  this.appendValueInput("NUMBER")
    .setCheck("Number")
    .appendField("MU WiFi")
    .appendField(muLabel("LKL_VS2_WRITE", "write"));
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
};

export const MUVISION_BLOCKS = [
  vs2MuInitBlock,
  vs2SetupBlock,
  vs2ResetBlock,
  vs2SetLedColorBlock,
  vs2VisionBeginBlock,
  vs2SetVisionLevelBlock,
  vs2SetVisionZoomBlock,
  vs2SetColorRecognitionRegionBlock,
  vs2SetColorBlockMinBlobBlock,
  vs2SetUartBaudBlock,
  vs2SetCameraRotateBlock,
  vs2SetCameraHfrBlock,
  vs2SetCameraWhiteBalanceBlock,
  vs2DetectedBlock,
  vs2DetectedRegionColorBlock,
  vs2DetectedColorDetectBlock,
  vs2GetColorLabelBlock,
  vs2GetMessageBlock,
  vs2GetCardTypeBlock,
  mu3LsBeginBlock,
  mu3LsSetSensitivityBlock,
  mu3LsWhiteBalanceEnableBlock,
  mu3LsReadProximityBlock,
  mu3LsReadAmbientLightBlock,
  mu3LsDetectedGestureBlock,
  mu3LsDetectedGestureTypeBlock,
  mu3AtWiFiInitBlock,
  mu3AtWiFiSetBlock,
  mu3AtWiFiConBlock,
  mu3AtWiFiDisconBlock,
  mu3AtWiFiUdpBlock,
  mu3AtWiFiCipBlock,
  mu3AtWiFiSipBlock,
  mu3AtWiFiReadBlock,
  mu3AtWiFiWriteBlock,
];
