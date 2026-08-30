/**
 * English translations for Blockly blocks and categories
 * These are loaded into Blockly.Msg
 */

import * as Blockly from 'blockly';

// Export translations object
export const translations = {
  // Categories
  CAT_GENERIC: "General",
  CAT_BYBYTE: "ByByte",
  CAT_TIME: "Time",
  CAT_PORTS: "Input/Output",
  CAT_LOGIC: "Logic",
  CAT_MATH: "Math",
  CAT_TEXT: "Text",
  CAT_FUNCTIONS: "Functions",
  CAT_VARIABLES: "Variables",
  CAT_ARRAYS: "Arrays",

  CAT_SENSING: "Sensing",
  //Subcategories for Sensing
  CAT_SENSING_DISTANCE: "Distance",
  CAT_SENSING_SOUND: "Noise",
  CAT_SENSING_TEMPERATURE: "Temperature",
  CAT_SENSING_LIGHT: "Light",
  CAT_SENSING_GESTURE: "Gesture",
  CAT_SENSING_COLOR: "Color",
  CAT_SENSING_MAGNET: "Magnetic",
  CAT_SENSING_VIBRATION: "Vibration",
  CAT_SENSING_HUMIDITY: "Humidity",
  CAT_SENSING_CO2: "CO₂",
  CAT_SENSING_GAS: "Gas",
  CAT_SENSING_PRESSURE: "Pressure",
  CAT_SENSING_REALTIMECLOCK: "Real Time Clock",
  CAT_SENSING_RFID: "RFID",
  CAT_SENSING_COMPASS: "Compass",
  CAT_SENSING_GYRO: "Gyroscope",
  CAT_SENSING_GPS: "GPS",

  CAT_MOTORS: "Motor",
  //Subcategories for Motors
  CAT_MOTORS_SERVO: "Servo Motor",
  CAT_MOTORS_STEPPER: "Stepper Motor",

  CAT_LED: "LEDs",
  //Subcategories for LEDs
  CAT_LED_RGB: "LED RGB",
  CAT_LED_NEOPIXEL: "NeoPixel",
  CAT_LED_NEOMATRIX: "NeoMatrix",
  CAT_LED_BARS: "LED Bars",
  CAT_LED_MATRIX: "LED Matrix",

  CAT_DISPLAYS: "Displays",
  //Subcategories for Displays
  CAT_DISPLAYS_OLED: "OLED",
  CAT_DISPLAYS_TFT: "TFT",
  CAT_DISPLAYS_LCD: "LCD",

  CAT_AUDIO: "Audio",
  //Subcategories for Audio
  CAT_AUDIO_BUZZER: "Buzzer",
  CAT_AUDIO_DFPLAYER: "MP3 DFMini",
  CAT_AUDIO_OPENSMART: "MP3 OpenSmart",
  CAT_AUDIO_RADIO: "Radio",

  CAT_COMMUNICATION: "Communication",
  //Subcategories for Communication
  CAT_COMMUNICATION_SERIAL: "USB Serial",
  CAT_COMMUNICATION_SOFTSERIAL: "Soft Serial",
  CAT_COMMUNICATION_BLUETOOTH: "Bluetooth",
  CAT_COMMUNICATION_REMOTE: "Remote Control",

  CAT_IOT: "IoT",
  //Subcategories for IoT
  CAT_IOT_WIFI: "WiFi",
  CAT_IOT_WIFISERVER: "WiFi server",
  CAT_IOT_MQTT: "MQTT",
  CAT_IOT_IFTTT: "IFTTT",
  CAT_IOT_NTP: "NTP",
  CAT_IOT_OPENWEATHER: "OpenWeather",
  CAT_IOT_THINGSPEAK: "Thingspeak",
  CAT_IOT_TELEGRAM: "Telegram",
  CAT_IOT_HTML: "HTML",

  CAT_STORAGE: "Storage",

  // Generic blocks
  GENERIC_SETUP: "⚙️ Setup",
  GENERIC_LOOP: "🔄 Loop",
  GENERIC_SETUP_LOOP_TOOLTIP:
    "The initialization function: \nIt is used to initialize the variables, the direction of the pins ... \nIt is executed only once \nThe loop function: \nThis is the main part of the program, all the blocks placed here will run in loop and indefinitely (several thousand times per second)",
  GENERIC_SETUP_TOOLTIP: "Setup section - runs once at startup",
  GENERIC_LOOP_TOOLTIP: "Loop section - runs continuously",
  GENERIC_CODE_TOOLTIP: "Enter custom Arduino code",
  GENERIC_CODE_DEFAULT_VALUE: "// Your code here",
  GENERIC_DEFINE_TOOLTIP: "Define preprocessor constant or macro",
  GENERIC_DEFINE_DEFAULT_VALUE: "#define LED_PIN 13",

  // Logic blocks - IF
  CONTROLS_IF_MSG_IF: "if",
  CONTROLS_IF_MSG_THEN: "do",
  CONTROLS_IF_MSG_ELSEIF: "else if",
  CONTROLS_IF_MSG_ELSE: "else",
  CONTROLS_IF_TOOLTIP: "If a value is true, then execute some statements",
  CONTROLS_IF_IF_TITLE_IF: "if",
  CONTROLS_IF_IF_TOOLTIP:
    "Add, remove, or reorder sections to reconfigure this if block",
  CONTROLS_IF_ELSEIF_TITLE_ELSEIF: "else if",
  CONTROLS_IF_ELSEIF_TOOLTIP: "Add a condition to the if block",
  CONTROLS_IF_ELSE_TITLE_ELSE: "else",
  CONTROLS_IF_ELSE_TOOLTIP: "Add a final, catch-all condition to the if block",

  // Logic blocks - SWITCH
  CONTROLS_SWITCH_MSG_SWITCH: "switch",
  CONTROLS_SWITCH_MSG_CASE: "case",
  CONTROLS_SWITCH_MSG_DO: "do",
  CONTROLS_SWITCH_MSG_DEFAULT: "default",
  CONTROLS_SWITCH_TOOLTIP:
    "Switch statement - execute different code based on value",
  CONTROLS_SWITCH_VAR_TOOLTIP: "Container for switch cases",
  CONTROLS_SWITCH_CASE_TITLE: "case",
  CONTROLS_SWITCH_CASE_TOOLTIP: "Add case to switch",
  CONTROLS_SWITCH_DEFAULT_TITLE: "default",
  CONTROLS_SWITCH_DEFAULT_TOOLTIP: "Add default case to the switch",

  // Logic blocks - FOR
  CONTROLS_FOR_MSG_FOR: "for",
  CONTROLS_FOR_MSG_FROM: "from",
  CONTROLS_FOR_MSG_TO: "to",
  CONTROLS_FOR_MSG_BY: "by",
  CONTROLS_FOR_TOOLTIP:
    "Count from a start number to an end number by the specified step",

  // Logic blocks - REPEAT
  CONTROLS_REPEAT_MSG_REPEAT: "🔁 repeat",
  CONTROLS_REPEAT_MSG_TIMES: "times",
  CONTROLS_REPEAT_TOOLTIP:
    "Repeat the enclosed statements a specified number of times",

  // Logic blocks - FLOW STATEMENTS
  CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK: "break out of loop",
  CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE: "continue with next iteration",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK: "Break out of the containing loop",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE:
    "Skip the rest of this loop, and continue with the next iteration",
  CONTROLS_FLOW_STATEMENTS_WARNING:
    "Warning: This block may only be used within a loop.",

  // Logic blocks - OPERATION
  LOGIC_OPERATION_AND: "and",
  LOGIC_OPERATION_OR: "or",
  LOGIC_OPERATION_XOR: "xor",
  LOGIC_OPERATION_SHIFTL: "<<",
  LOGIC_OPERATION_SHIFTR: ">>",
  LOGIC_OPERATION_TOOLTIP_AND: "Returns true if both inputs are true",
  LOGIC_OPERATION_TOOLTIP_OR: "Returns true if at least one input is true",
  LOGIC_OPERATION_TOOLTIP_XOR: "Returns true if exactly one input is true",
  LOGIC_OPERATION_TOOLTIP_SHIFTL: "Shifts bits left",
  LOGIC_OPERATION_TOOLTIP_SHIFTR: "Shifts bits right",

  // Logic blocks - COMPARE
  LOGIC_COMPARE_TOOLTIP_EQ: "Return true if both inputs equal each other",
  LOGIC_COMPARE_TOOLTIP_NEQ: "Return true if both inputs are not equal to each other",
  LOGIC_COMPARE_TOOLTIP_LT: "Return true if the first input is smaller than the second input",
  LOGIC_COMPARE_TOOLTIP_LTE: "Return true if the first input is smaller than or equal to the second input",
  LOGIC_COMPARE_TOOLTIP_GT: "Return true if the first input is greater than the second input",
  LOGIC_COMPARE_TOOLTIP_GTE: "Return true if the first input is greater than or equal to the second input",

  // Math blocks - ANGLE
  MATH_ANGLE_TOOLTIP: "Angle value (0-360 degrees)",

  // Math blocks - ANALOG INPUT
  MATH_ANALOG_INPUT_TOOLTIP: "Analog pin selection",

  // Math blocks - ARITHMETIC
  MATH_ARITHMETIC_TOOLTIP_ADD: "Return the sum of the two numbers",
  MATH_ARITHMETIC_TOOLTIP_MINUS: "Return the difference of the two numbers",
  MATH_ARITHMETIC_TOOLTIP_MULTIPLY: "Return the product of the two numbers",
  MATH_ARITHMETIC_TOOLTIP_DIVIDE: "Return the quotient of the two numbers",
  MATH_ARITHMETIC_TOOLTIP_POWER:
    "Return the first number raised to the power of the second",

  // Math blocks - RANGE COMPARE
  MATH_RANGE_COMPARE_TOOLTIP:
    "Check if a value is within a range (e.g., 5 < x < 10)",
  
  // Math blocks - MAP
  MATH_MAP_MSG_MAP: "map",
  MATH_MAP_MSG_FROM: "from",
  MATH_MAP_MSG_TO: "to",
  MATH_MAP_TOOLTIP: "Map a value from one range to another",

  // Math blocks - CONSTRAIN
  MATH_CONSTRAIN_MSG_CONSTRAIN: "constrain",
  MATH_CONSTRAIN_MSG_LOW: "between",
  MATH_CONSTRAIN_MSG_HIGH: "and",
  MATH_CONSTRAIN_TOOLTIP: "Constrain a value between a minimum and maximum",

  // Math blocks - RANDOM INT
  MATH_RANDOM_INT_MSG_RANDOM_INT: "random",
  MATH_RANDOM_INT_TOOLTIP: "Generate a random integer between a minimum and maximum",

  // Math blocks - ROUND
  MATH_ROUND_MSG_ROUND: "round",
  MATH_ROUND_MSG_ROUNDUP: "round up",
  MATH_ROUND_MSG_ROUNDDOWN: "round down",
  MATH_ROUND_TOOLTIP: "Round to the nearest integer",
  MATH_ROUND_TOOLTIP_ROUNDUP: "Round up to the nearest integer",
  MATH_ROUND_TOOLTIP_ROUNDDOWN: "Round down to the nearest integer",

  // Math blocks - CAST BYTE
  MATH_CAST_BYTE_MSG_CAST_BYTE: "cast to byte",
  MATH_CAST_BYTE_TOOLTIP: "Cast a value to a byte (0-255)",

  // Math blocks - CAST UINT
  MATH_CAST_UINT_MSG_CAST_UINT: "cast to unsigned int",
  MATH_CAST_UINT_TOOLTIP: "Cast a value to an unsigned int (0-65535)",

  // Math blocks - CAST INT
  MATH_CAST_INT_MSG_CAST_INT: "cast to int",
  MATH_CAST_INT_TOOLTIP: "Cast a value to an int (-32768 - 32767)",

  // Math blocks - CAST FLOAT
  MATH_CAST_FLOAT_MSG_CAST_FLOAT: "cast to float",
  MATH_CAST_FLOAT_TOOLTIP: "Cast a value to a float (-3.4028234663852886e+38 to 3.4028234663852886e+38)",

  // Math blocks - SINGLE
  MATH_SINGLE_OP_ROOT: "√",
  MATH_SINGLE_OP_ABSOLUTE: "abs",
  MATH_SINGLE_TOOLTIP_ROOT: "Return the square root of a number",
  MATH_SINGLE_TOOLTIP_ABS: "Return the absolute value of a number",
  MATH_SINGLE_TOOLTIP_NEG: "Return the negation of a number",

  // Math blocks - CONSTANT
  MATH_CONSTANT_TOOLTIP: "Return one of the common constants: π (3.141…), e (2.718…), φ (1.618…), √2 (1.414…), √½ (0.707…), or ∞ (infinity)",

  // Math blocks - TRIG
  MATH_TRIG_SIN: "sin",
  MATH_TRIG_COS: "cos",
  MATH_TRIG_TAN: "tan",
  MATH_TRIG_TOOLTIP_SIN: "Return the sine of a number (in radians)",
  MATH_TRIG_TOOLTIP_COS: "Return the cosine of a number (in radians)",
  MATH_TRIG_TOOLTIP_TAN: "Return the tangent of a number (in radians)",

  // Variables blocks - GET
  VARIABLES_GET_NAME: "get",
  VARIABLES_GET_TOOLTIP: "Returns the value of this variable.",

  // Variables blocks - SET
  VARIABLES_SET_NAME: "set",
  VARIABLES_SET_TO: "value",
  VARIABLES_SET_TOOLTIP: "Sets this variable to be equal to the input.",

  // Variables blocks - CHANGE
  MATH_CHANGE_NAME: "add to",
  MATH_CHANGE_TO: "value",
  MATH_CHANGE_TOOLTIP: "Add a number to the variable",

  // Variables blocks - SET INIT
  VARIABLES_SET_INIT_NAME: "declare",
  VARIABLES_TYPE: "type",
  VARIABLES_SET_INIT_TOOLTIP: "Declare and initialize a variable with a type and value.",


  // Other Blockly messages
  COM1: "⚠️ select USB",
  COM2: "⚠️ select USB port please",
  CHECK: "checking...",
  UPLOAD: "uploading...",
  ERROR: "🛑 ERROR blocks NOT connected",
  VERIF: "⛔ check code first",
  YES: "yes",
  NO: "no",
  UPTODATE: "✅ your version is up to date!",
  DOWNLOAD: "download completed, the application will install and restart ...",
  HIGH: "HIGH",
  LOW: "LOW",
};

// Apply to Blockly.Msg
Object.assign(Blockly.Msg, translations);

export default translations;


