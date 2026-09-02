/**
 * English translations for Blockly blocks and categories
 * These are loaded into Blockly.Msg
 */

import * as Blockly from 'blockly';

// Export translations object
export const translations = {
  // Toolbox level switcher
  LEVEL_LABEL: "Level:",
  LEVEL_BEGINNER: "Beginner",
  LEVEL_MIDDLE: "Middle",
  LEVEL_PRO: "Pro",

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
  CAT_SENSING_BUTTONS: "Buttons",
  CAT_SENSING_KNOB: "Knob",
  CAT_SENSING_JOYSTICK: "Joystick",

  CAT_MOTORS: "Motor",
  //Subcategories for Motors
  CAT_MOTORS_SERVO: "Servo Motor",
  CAT_MOTORS_STEPPER: "Stepper Motor",
  CAT_MOTORS_DC: "DC Motor",

  CAT_LED: "LEDs",
  //Subcategories for LEDs
  CAT_LED_BASIC: "Digital LED",
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
  CAT_COMMUNICATION_KEYBOARD: "Devices",
  CAT_COMMUNICATION_MUVISION: "AI Camera",

  KeyboardFunction: "keyboard",
  KeyPressed: "key",
  WriteText: "write text",
  LineFeed: "line feed",
  MouseFunction: "mouse",
  MouseMoveX: "X position",
  MouseMoveY: "Y position",
  MouseMoveW: "wheel",

  LKL_VS2_HELP_INIT: "initialize MU vision sensor, and choose the port.",
  LKL_VS2_HELP_VISION_LEVEL:
    "Set the recognition level; higher level reduces false alarms but may lower recognition rate.",
  LKL_VS2_HELP_VISION_ZOOM:
    "Set image zoom level; higher level increases distance but reduces angle.",
  LKL_VS2_WARNING_SETUP_ONLY: "This block can only be placed in the setup block!",
  LKL_VS2_WARNING_MU_INIT:
    "Please DON'T forget initialize the uart1, Serial1. Configure the bauds too",
  LKL_VS2_ALL: "All",
  LKL_VS2_AUTO: "auto",
  LKL_VS2_VISION_ZOOM: "Zoom",
  LKL_VS2_LEVEL: "level",
  LKL_VS2_HIGH_SPEED: "highSpeed",
  LKL_VS2_NORMAL: "normal",
  LKL_VS2_HIGH_ACCURACY: "highAccuracy",
  LKL_VS2_COLOR_BLOCK: "ColorBlock",
  LKL_VS2_VISION_COLOR_DETECT: "ColorBlock",
  LKL_VS2_VISION_COLOR_RECOGNITION: "ColorRecognition",
  LKL_VS2_STATE_VALUE_X: "Horizontal",
  LKL_VS2_STATE_VALUE_Y: "Vertical",
  LKL_VS2_STATE_VALUE_WIDTH: "Width",
  LKL_VS2_STATE_VALUE_HEIGHT: "Height",
  LKL_VS2_STATE_VALUE_R_CHANNEL: "ChannelR",
  LKL_VS2_STATE_VALUE_G_CHANNEL: "ChannelG",
  LKL_VS2_STATE_VALUE_B_CHANNEL: "ChannelB",
  LKL_VS2_STATE_VALUE_LABEL: "Label",
  LKL_VS2_ENABLE: "enable",
  LKL_VS2_DISABLE: "disable",
  LKL_VS2_LOCK_AWB: "LockAWB",
  LKL_VS2_WHITE_LIGHT: "WhiteLight",
  LKL_VS2_YELLOW_LIGHT: "YellowLight",
  LKL_VS2_COLOR: "color",
  LKL_VS2_DEFAULT: "default",
  LKL_VS2_LOW: "low",
  LKL_VS2_MID: "middle",
  LKL_VS2_HIGH: "high",
  LKL_VS2_MU: "initialize",
  LKL_VS2_MODE: "mode",
  LKL_VS2_SetupVS: "setup",
  LKL_VS2_SET_RECOGNITION_REGION: "set recognition region",
  LKL_VS2_SET_MIN_RECOGNITION_SIZE: "set min recognition size",
  LKL_VS2_SERIAL: "port",
  LKL_VS2_RESET: "reset to default",
  LKL_VS2_LED_DETECT_COLOR: "when detected then",
  LKL_VS2_LED_UNDETECT_COLOR: "else",
  LKL_VS2_BRIGHTNESS: "brightness",
  LKL_VS2_VISION_TYPE: "algorithm",
  LKL_VS2_SET_VISION_LEVEL: "level",
  LKL_VS2_SET_FRAME_ROTATE: "rotate Frame",
  LKL_VS2_SET_CAMERA_HFR: "high FPS mode",
  LKL_VS2_SET_CAMERA_AWB: "camera white balance",
  LKL_VS2_SET_VISION_ZOOM: "zoom",
  LKL_VS2_SET_UART_BAUD: "UART baudrate",
  LKL_VS2_DETECTED: "detected",
  LKL_VS2_RECOGNIZED: "recognized",
  LKL_VS2_GET_DETECTED_MESSAGE: "get",
  LKL_VS2_VALUE: "value",
  LKL_VS2_CARD_TYPE: "type",
  LKL_VS2_COORDINATE: "coordinate",
  LKL_VS2_LIGHT_SENSOR: "light sensor",
  LKL_VS2_SET: "set",
  LKL_VS2_SENSITIVITY: "sensitivity",
  LKL_VS2_WB_CORRECTION: "white balance correction",
  LKL_VS2_READ: "read",
  LKL_VS2_PROXIMITY: "proximity detection",
  LKL_VS2_ALS: "ambient light detection",
  LKL_VS2_GESTURE_SENSOR: "gesture detection",
  LKL_VS2_GESTURE: "gesture",
  LKL_VS2_GESTURE_UP: "upward",
  LKL_VS2_GESTURE_DOWN: "downward",
  LKL_VS2_GESTURE_LEFT: "leftward",
  LKL_VS2_GESTURE_RIGHT: "rightward",
  LKL_VS2_GESTURE_LIFT_UP: "pull",
  LKL_VS2_GESTURE_PUSH_DOWN: "push",
  LKL_VS2_SSID: "ssid",
  LKL_VS2_PASSWORD: "password",
  LKL_VS2_WAIT_CONNECT: "connection succeeded",
  LKL_VS2_DISCONNECT: "disconnect",
  LKL_VS2_CLIENT: "client",
  LKL_VS2_HOT_SPOT: "hot-spot",
  LKL_VS2_TARGET_IP: "target IP",
  LKL_VS2_LOCAL_IP: "local IP",
  LKL_VS2_WRITE: "write",

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
  CAT_IOT_FIREBASE: "Firebase",
  CAT_IOT_ESPNOW: "ESP-NOW",
  CAT_IOT_ALEXA: "Alexa",

  CAT_ROBOT: "Robot",
  CAT_ROBOT_OTTO_BIPED: "Biped",
  CAT_ROBOT_OTTO_ARMS: "Arms",
  CAT_ROBOT_OTTO_QUAD: "Quad",
  CAT_ROBOT_OTTO_NINJA: "Ninja",
  CAT_ROBOT_OTTO_WHEELS: "Wheels",
  CAT_ROBOT_ESCORNABOT: "Escornabot",

  AV: "forward",
  AR: "backward",

  OTTO9_HOME_TEXT: "home",
  OTTO9_HOME_TOOLTIP: "Otto goes to home position straight",
  OTTO9_CALIBRATION: "calibrate ",
  OTTO9_CALIBRATION_LEG: "leg ",
  OTTO9_CALIBRATION_FOOT: "foot ",
  OTTO9_CALIBRATION_TOOLTIP:
    "Use small positive and negative values iteratively, change gradually until is completely straight (90º)",
  OTTO9_EEPROM_TEXT: "save trims on EEPROM",
  OTTO9_EEPROM_TOOLTIP:
    "Use only after completely straight (90º) one time, delete this BLOCK after for further programming",
  OTTO9_MOVE_TEXT: "move",
  OTTO9_MOVE_TOOLTIP: "Otto basic movements",
  OTTO9_DANCE_TEXT: "dance",
  OTTO9_DANCE_TOOLTIP: "Otto dance!",
  OTTO9_DANCE_SIZE_TEXT: "size",
  OTTO9_DO_TEXT: "do",
  OTTO9_DO_TOOLTIP: "Otto complex movements",
  OTTO9_GESTURE_TEXT: "gesture",
  OTTO9_GESTURE_TOOLTIP: "Emotional sounds combined with movements",
  OTTO9_SOUND_TEXT: "sound",
  OTTO9_SOUND_TOOLTIP: "Emotional sounds",
  OTTO9_GETNOISE_TEXT: "noise measured",
  OTTO9_GETNOISE_TOOLTIP:
    "Pin A6, 100 is quiet, 500 noise and more than 1000 is loud, also adjust the sensor trimpot sensibility",
  OTTO9_ARMS_TEXT: "arms ",
  OTTO9_ARMS_TOOLTIP: "Move the arms!",
  OTTO_WHEELS_TEXT: "wheels",
  OTTO_NINJA_TEXT: "ninja",
  OTTO_BIPED_TEXT: "biped",
  OTTO_HEAD_TEXT: "head ",
  OTTO_FRONT_TEXT: "front ",
  OTTO_BACK_TEXT: "back ",
  OTTO_HIP_TEXT: "hip ",
  OTTO_HELLO_TEXT: "hello",
  OTTO_JUMP_TEXT: "jump",
  OTTO_SCARED_TEXT: "scared",
  OTTO_WALK_TEXT: "walk",
  OTTO_ROLL_TEXT: "roll",
  OTTO_MODE_TEXT: " mode",

  ESCORNABOT_MODE_TEXT: "Escornabot",
  ESCORNABOT_INIT_TOOLTIP:
    "Mode choice: 1-> weaker but less electrical consumption, 2->Stronger, but needs more supply, 3->Intermediate mode",
  ESCORNABOT_URL: "https://escornabot.com/es/index",
  ESCORNABOT_SPIN: "Spin: ",
  ESCORNABOT_SPIN_NUMBER: "Nº: ",
  ESCORNABOT_SPIN_TOOLTIP:
    "Indicate spin number (admits negative value if reverse is wanted) and velocity",
  ESCORNABOT_SPIN_VELOCITY_TEXT: "Velocity: ",
  ESCORNABOT_DISTANCE: "Run distance: ",
  ESCORNABOT_DISTANCE_TEXT: "cm: ",
  ESCORNABOT_DISTANCE_TOOLTIP:
    "Indicate distance in cm (negative values will imply reverse mode) and velocity",
  ESCORNABOT_TURNSPIN_TEXT: "Turn by X spins: ",
  ESCORNABOT_TURNSPIN_TOOLTIP:
    "Turn clockwise/anticlockwise (depending on whether you introduce positive or negative values of spin number you desire)",
  ESCORNABOT_TURNANGLE_TEXT: "Angle spin: ",
  ESCORNABOT_ANGLE_NUMBER: "Angle: ",
  ESCORNABOT_TURNANGLE_TOOLTIP:
    "Spin by angle (sign value means clockwise/anticlockwise)",
  ESCORNABOT_STOP_TEXT: "Stop",
  ESCORNABOT_STOP_TOOLTIP: "What did you think?",
  ESCORNABOT_BEEP_TEXT: "Beep",
  ESCORNABOT_TIME_TEXT: "ms",
  ESCORNABOT_BEEP_TOOLTIP: "Beeps as long as the time you specify",
  ESCORNABOT_LEDON_TEXT: "LED ON: ",
  ESCORNABOT_LEDOFF_TEXT: "LED OFF: ",
  ESCORNABOT_LEDON_TOOLTIP: "Lights on the selected LED diode",
  ESCORNABOT_LEDOFF_TOOLTIP: "Lights off the selected LED diode",
  ESCORNABOT_GETBUTTON_TEXT: "Button pushed: ",
  ESCORNABOT_GETBUTTON_TOOLTIP: "Check if the selected button is being pushed.",
  ESCORNABOT_APP_TOOLTIP: "Autonomous working",
  ESCORNABOT_APP_URL: "https://escornabot.com/es/descargas",
  ESCORNABOT_USINIT_TEXT: "Ultrasonic",
  ESCORNABOT_TRIGGER_TEXT: "Trigger",
  ESCORNABOT_ECHO_TEXT: "Echo",
  ESCORNABOT_GETUS_TEXT: "Distance",
  ESCORNABOT_GETUS_TOOLTIP: "Distance",
  ESCORNABOT_IRINIT_TEXT: "Inits ir",
  ESCORNABOT_IR_TOOLTIP: "Initialize infrared sensors",
  ESCORNABOT_GETBLACKLEFT_TEXT: "Black left detected",
  ESCORNABOT_GETBLACKLEFT_TOOLTIP: "TRUE if black detected at left side",
  ESCORNABOT_GETBLACKRIGHT_TEXT: "Black right detected",
  ESCORNABOT_GETBLACKRIGHT_TOOLTIP: "TRUE if black detected at right side",
  ESCORNABOT_GETWHITELEFT_TEXT: "White left detected",
  ESCORNABOT_GETWHITELEFT_TOOLTIP: "TRUE if white detected at left side",
  ESCORNABOT_GETWHITERIGHT_TEXT: "White right detected",
  ESCORNABOT_GETWHITERIGHT_TOOLTIP: "TRUE if white detected at right side",
  ESCORNABOT_IRLEFT_TEXT: "left",
  ESCORNABOT_IRRIGHT_TEXT: "right",

  CAT_STORAGE: "Storage",

  // Motors — Servo
  pin: "PIN",
  vitesse: "speed",
  direction: "direction",
  values: "↺0-90 | ↻90-180",
  right: "right",
  left: "left",
  LetR: "right & left",
  motor: "motor DC",
  ARDUINO_SERVO_MOVE_INPUT1: "rotate",
  ARDUINO_SERVO_MOVE_DEGREE: "angle [0°-180°]",
  ARDUINO_SERVO_MOVE_TOOLTIP: "possible rotation between 0 and 180 degrees",
  ARDUINO_SERVO_ROT_CONTINUE_TEXT: "spin",
  ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP:
    "Spin the servo wheel connected to the specified pin, at the indicated speed [0-90]",
  // Motors — DC
  mot_tooltip:
    "L293D Motor Controller Shield: drive both motors to advance or turn, speed 0-90",
  mot_stop_tooltip: "L293D Motor Controller Shield: stop both motors",
  moteur: "spin motor DC",
  moteurstop: "🛑 stop",
  moteurdagu_tooltiprs040:
    "L298N board: activate outputs to drive DC motors, speed 0-90",
  moteurdagu_tooltiprs040stop: "L298N board: stop one of the motors",
  MOTOR_L298N_INIT: "L298N",
  ADAFRUIT_MOTORSHIELD_MOTOR1: "v1 - DC Motor",
  ADAFRUIT_MOTORSHIELD_MOTOR_DIRECTION: "direction",
  // Motors — Stepper
  STEEPER_name: "Stepper",
  STEEPER2_name: "stepper #",
  STEEPER_steprev: "steps/rev.",
  STEEPER_step: "steps",
  STEEPER_speed: "speed (rpm)",
  STEEPER_pin1: "PIN A",
  STEEPER_pin2: "B",
  STEEPER_pin3: "C",
  STEEPER_pin4: "D",
  m_pap: "step-by-step engine",
  m_pap_step: "step",
  m_pap_step1: "move forward",
  m_pap_tooltip:
    "Initialization of a stepping motor with steps, RPM and pin numbers",
  m_pap_step_tooltip:
    "Move the stepper motor by the indicated number of steps",
  // Motors — MRT
  MOTOR_Connector: "motor",
  MOTOR_MRTX_Connector: "MRTX-Uno Motor",
  MOTOR_Direction: "direction",
  MOTOR_speed: "speed(0-255)",
  MOTOR_Stop: "stop",
  DRV8833_INIT_LABEL: "DRV8833 init",
  DRV8833_INIT_TOOLTIP:
    "Configure DRV8833: 4 PWM inputs (default D5, D6, D9, D10)",

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

  // Logic blocks - NEGATE / NULL / WHILE
  LOGIC_NEGATE_TITLE: "not %1",
  LOGIC_NEGATE_TOOLTIP: "Returns true if the input is false. Returns false if the input is true.",
  LOGIC_NULL: "null",
  LOGIC_NULL_TOOLTIP: "Returns null value.",
  CONTROLS_WHILEUNTIL_OPERATOR_WHILE: "while",
  CONTROLS_WHILEUNTIL_OPERATOR_UNTIL: "until",
  CONTROLS_WHILEUNTIL_TOOLTIP_WHILE: "Repeat while the condition is true.",
  CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL: "Repeat until the condition is true.",

  // Time blocks
  _AT: "to",
  PIN: "PIN",
  ARDUINO_BASE_DELAY: "⏲ wait",
  ARDUINO_BASE_DELAY_TOOLTIP:
    "Specify the wait time in seconds, milliseconds or microseconds. The program does nothing else during this time.",
  MILLIS1: "duration in",
  MILLIS2: "from the beginning",
  MILLIS_START: "start a timekeeping in",
  MILLIS_START_TOOLTIP: "Record the current time as a reference point.",
  ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP:
    "Returns the duration in milliseconds, seconds or microseconds since the program started.",
  ARDUINO_PULSEIN: "state duration",
  ARDUINO_INOUT_PULSEIN:
    "Returns the duration in microseconds of a UP or DOWN pulse on a pin.",
  TEMPO1: "every",
  TEMPO_TOOLTIP:
    "Execute the blocks inside when the interval has elapsed. Unlike 'wait', this block is non-blocking.",
  TEMPO_HELPURL: "https://www.arduino.cc/en/tutorial/blink",

  // Ports (I/O) blocks
  ARDUINO_INOUT_DIGITAL_WRITE_INPUT1: "digital write PIN",
  ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP:
    "Write a 0 or 1 logical state to a specific output.",
  ARDUINO_INOUT_DIGITAL_READ_INPUT: "digital state PIN",
  IN_PULLUP: "pull-up",
  IN_PULLUP_TOOLTIP:
    "Returns the logical state (0 or 1) of the pin. Returns 1 by default if pull-up is enabled.",
  ARDUINO_INOUT_ANALOG_WRITE_INPUT1: "analog write PIN",
  ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP:
    "Send a PWM value between 0 and 255 on a specific output.",
  ARDUINO_INOUT_ANALOG_READ_INPUT: "analog read PIN",
  ARDUINO_INOUT_ANALOG_READ_TOOLTIP: "Returns a value between 0 and 1023.",
  TOGGLE: "toggle state of PIN",
  TOGGLE_TOOLTIP:
    "Toggle: write logical 0 if the previous state was 1 (and vice versa) on the specified output.",
  LKL_ATTACHINTERRUPT_PIN: "interrupt: when a",
  LKL_DETACHINTERRUPT_PIN: "disable interrupt on PIN",
  LKL_MODE: "detected on PIN",
  LKL_TOOLTIP_INOUT_ATTACHINTERRUPT:
    "Specifies an action when an external interrupt occurs on the pin.",
  LKL_TOOLTIP_INOUT_DETACHINTERRUPT:
    "Disable the previously specified external interrupt.",
  MRTDUINO_PIN_TOOLTIP:
    "MRTduino port to Arduino pin conversion. Select a port and get the corresponding pin number.",

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

  // Variables blocks
  NEW_VARIABLE: "Create variable",
  NEW_VARIABLE_TITLE: "New variable name:",
  RENAME_VARIABLE: "Rename variable %1",
  RENAME_VARIABLE_TITLE: "New name for %1:",
  DELETE_VARIABLE: "Delete variable %1",
  DELETE_VARIABLE_CONFIRMATION:
    "Delete %1 uses of the variable \"%2\"?",
  VARIABLE_ALREADY_EXISTS: 'A variable named "%1" already exists.',
  VARIABLE_NAME_EMPTY: "Variable name cannot be empty.",
  VARIABLE_NAME_INVALID:
    "Use letters, numbers, and underscores. Must start with a letter or underscore.",
  VARIABLE_NAME_RESERVED: "This name is a reserved Arduino keyword.",
  VARIABLE_PROMPT_OK: "OK",
  VARIABLE_PROMPT_CANCEL: "Cancel",
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
  VARIABLE_TYPE_CHARACTER: "character",
  VARIABLE_TYPE_TEXT: "text",
  VARIABLE_TYPE_BOOL: "boolean",
  VARIABLE_TYPE_BYTE: "byte",
  VARIABLE_TYPE_INTEGER: "integer",
  VARIABLE_TYPE_UNUMBER: "unsigned integer",
  VARIABLE_TYPE_LARGE_NUMBER: "long integer",
  VARIABLE_TYPE_DECIMAL: "floating point number",

  // Variables blocks - CONST
  ARDUINO_VAR_CONST: "declare constant",
  ARDUINO_VAR_CONST_TOOLTIP:
    "Declares a constant of the specified type and value.",
  VARIABLES_AS: "as",
  VARIABLES_AT: "to",
  BASE_DEF_CONST: "set constant",
  BASE_DEFINE_CONST: "which is equivalent to",
  BASE_DEFINE_CONST_TOOLTIP:
    "Allows the programmer to give a name to any value.",

  // Text blocks
  TEXT_TRIM: "trim",
  TEXT_INDEXOF_INPUT_INTEXT: "in text",
  TEXT_INDEXOF_OPERATOR_FIRST: "find first occurrence of text",
  TEXT_INDEXOF_OPERATOR_LAST: "find last occurrence of text",
  TEXT_INDEXOF_TOOLTIP:
    "Returns the index of the first/last occurrence of the first text in the second text. Returns %1 if text is not found.",

  // Arrays blocks
  ARRAY_CREATE_EMPTY_TITLE: "empty!",
  ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD: "list or array",
  ARRAY_CREATE_WITH_CONTAINER_TOOLTIP: "Add, delete, or reorder items.",
  ARRAY_CREATE_WITH_INPUT_WITH: "elements",
  ARRAY_CREATE_WITH_ITEM_TITLE: "element",
  ARRAY_CREATE_WITH_TOOLTIP: "Returns a list with a number of items.",
  ARRAY_GETINDEX_ITEM: "the element of the array",
  ARRAY_GETINDEX_TOOLTIP1: "Returns the value stored in the list.",
  ARRAY_GETINDEX_TOOLTIP2: "Create an array of the selected type.",
  ARRAY_GETINDEX_TOOLTIP3:
    "Set an element of the list or array to the given value.",
  ARRAY_create: "set array",
  ARRAY_fixe: "put the element of the array",
  ARRAY_dim: "size of",
  ARRAY_index: "index",
  ARRAY_taille: "size",
  ARRAY_contenu: "which contains",
  size: "array size",
  size_TOOLTIP: "Returns the size of the list or array.",

  // List blocks (MicroPython)
  LISTS_CREATE1: "create a list",
  LISTS_CREATE2: "with",
  LISTS_CREATE_TOOLTIP: "Create a list with the desired number of items.",
  LISTS_append: "add %1 at the end of %2",
  LISTS_append_TOOLTIP: "Add an item at the end of the list.",
  LISTS_CREATE_WITH_ITEM_TOOLTIP: "Add an item.",
  LISTS_GET: "the element",
  LISTS_of: "of",
  LISTS_SET_INDEX_SET: "put the element",

  // Storage (EEPROM)
  EEPROM_READ_ADDRESS: "read variable address",
  EEPROM_READ_TOOLTIP:
    "Returns the data stored at the specified address (8 bits).\nATmega328p & ATmega32u4 → 1024 bytes\nATmega2560 → 4096 bytes",
  EEPROM_WRITE_VALUE: "write variable",
  EEPROM_WRITE_ADDRESS: "address",
  EEPROM_WRITE_TOOLTIP:
    "Writes data (8 bits) to EEPROM at the specified address.\nATmega328p & ATmega32u4 → 1024 bytes\nATmega2560 → 4096 bytes",

  // Communication — init block labels
  COMM_SERIAL_INIT: "⚙️ Initialize USB serial",
  COMM_SOFT_SERIAL_INIT: "⚙️ Initialize software serial",
  COMM_BLUETOOTH_INIT: "⚙️ Initialize Bluetooth module",
  COMM_IR_RECEIVER_INIT: "⚙️ Initialize IR receiver",
  COMM_MRT_REMOTE_INIT: "⚙️ Initialize MRT IR remote",

  // Communication — USB Serial
  SERIAL_Init: "USB serial",
  SERIAL_BAUD: "baud",
  SERIAL_Avai: "serial available?",
  SERIAL_Read: "serial read byte",
  SERIAL_ReadString: "serial read string",
  SERIAL_ReadNum: "serial read as number",
  SERIAL_Readlf: "until line feed",
  Serial_Print_Format: "serial print format",
  SERIAL_Print: "serial print on same line",
  SERIAL_Println: "serial print on new line",
  SERIAL_Write: "serial write",

  // Communication — Software Serial
  SSERIAL_Init: "software serial",
  SSERIAL_TX: "TX",
  SSERIAL_RX: "RX",
  SSERIAL_BAUD: "bauds",
  SSERIAL_Avai: "software serial available?",
  SSERIAL_Read: "software serial read byte",
  SSERIAL_ReadString: "software serial read string",
  SSERIAL_ReadNum: "software serial read as number",
  SSERIAL_Readlf: "until line feed",
  SSerial_Print_Format: "software serial print format",
  SSERIAL_Print: "software serial print on same line",
  SSERIAL_Println: "software serial print on new line",
  SSERIAL_Write: "software serial write",

  // Communication — Bluetooth
  SSERIAL_BT_Init: "init Bluetooth",
  SSERIAL_BT_TX: "TX",
  SSERIAL_BT_RX: "RX",
  SSERIAL_BT_BAUD: "bauds",
  SSERIAL_BT_Avai: "serial BT available?",
  SSERIAL_BT_Read: "serial BT read byte",
  SSERIAL_BT_ReadString: "serial BT read string",
  SSERIAL_BT_ReadNum: "serial BT read as number",
  SSERIAL_BT_Readlf: "until line feed",
  SSerial_BT_Print_Format: "serial BT print format",
  SSERIAL_BT_Print: "serial BT print on same line",
  SSERIAL_BT_Println: "serial BT print on new line",
  SSERIAL_BT_Write: "serial BT write",

  // Communication — Remote IR
  GENERAL_IR_SETUP: "init IR remote",
  GENERAL_IR_SETUP_TOOLTIP:
    "Initialize the IR receiver on the selected pin. Place once in Setup.",
  GENERAL_IR_READ: "IR key pressed",
  GENERAL_IR_READ_TOOLTIP:
    "Returns the code of the pressed remote key. Use with an ir_remote_key block in logic.",
  GENERAL_IR: "remote control IR",
  GENERAL_PRESSED: "read key",
  PIN2: "interrupt PIN",
  KEY: "key",
  MRT_IR: "init MRT remote",
  MRT_IR_SETUP_TOOLTIP:
    "Initialize the MRT IR remote on the interrupt pin and channel. Place once in Setup.",
  MRT_CHANNEL: "channel",
  MRT_KEY: "key MRT",
  MRT_PRESSED: "pressed?",

  // Sensing — Distance
  ULTRASONIC_INIT_LABEL: "HC-SR04 init",
  ULTRASONIC_INIT_TOOLTIP:
    "HC-SR04 ultrasonic distance sensor (3–400 cm). Set TRIG and ECHO pins.",
  ULTRASONIC_DISTANCE_TOOLTIP:
    "Returns distance in cm from HC-SR04 (requires init block).",
  ultrasonic_ranger: "ultrasonic",
  ultrason_tooltip:
    "HC-SR04: ultrasonic sensor for distance measurements (3–400 cm). Connect TRIG and ECHO.",
  ultrason_distance1: "distance",
  ultrason_distance2:
    "HC-SR04: returns the distance measured in cm by the ultrasonic detector",
  TRIG: "trigger",
  Echo: "echo",
  VL53L0X: "laser I²C",
  VL53L0X_INIT_LABEL: "VL53L0X laser I²C init",
  VL53L0X_tooltip:
    "Initialize VL53L0X sensor. I²C: SDA A4, SCL A5 on Uno.",
  VL53L0X_distance: "distance (mm)",
  VL53L0X_DISTANCE_TOOLTIP:
    "Returns distance measured by VL53L0X in millimeters.",

  // Sensing — Sound
  SOUND_NAME: "microphone",
  SOUND_DETECTED: "detected",
  SOUND_AMP_NAME: "mic amplifier",
  SOUND_WINDOWS: "sample window",

  // Sensing — Temperature
  VAR_TemSens: "temperature NTC (ºC)",
  VAR_LM35: "temperature LM35 (ºC)",
  DHT_INIT_LABEL: "DHT init",
  DHT_Type11: "DHT11",
  DHT_Type21: "DHT21",
  DHT_Type22: "DHT22",
  DHT_Temp: "🌡️ temperature ºC",
  DHT_Humi: "💧 humidity %",
  DHT_Head: "☀️ heat Index ºC",
  DHT_MEASURE_TOOLTIP:
    "Read temperature, humidity or heat index from initialized DHT sensor.",
  dht22_tooltip:
    "DHT temperature/humidity sensor. Reading takes ~250 ms.",
  FLAME_NAME: "flame",
  FLAME_DETECTED: "detected",

  // Sensing — Light
  LDR_NAME: "photocell",
  LDR_DETECTED: "detected",
  ALIGHT_NAME: "ambient Light",
  IR_NAME: "infrared",
  IR_DETECTED: "sensed",
  PIR_NAME: "PIR motion",
  PIR_DETECTED: "detected",
  PHOTO_NAME: "photo interrupter",
  PHOTO_DETECTED: "detected",

  // Sensing — Gesture (APDS9960)
  APDS9960_INIT_LABEL: "APDS9960 gesture & color I²C init",
  APDS9960_INIT_TOOLTIP:
    "Initialize APDS9960 gesture and color sensor (I2C).",
  APDS9960_init_tooltip:
    "Initialize APDS9960 for gesture and color detection.",
  APDS9960_name_gesture: "gesture",
  APDS9960_name_color: "color",
  APDS9960_detection: "detection",
  APDS9960_gesture_gain: "config gesture gain",
  APDS9960_gesture_detected: "detected",
  APDS9960_readgesture: "read",
  APDS9960_readcolors: "read color frequencies",
  APDS9960_colors: "frequency",
  APDS9960_GAIN_X1: "Gain x1",
  APDS9960_GAIN_X2: "Gain x2",
  APDS9960_GAIN_X4: "Gain x4",
  APDS9960_GAIN_X8: "Gain x8",
  APDS9960_DIR_UP: "Dir Up",
  APDS9960_DIR_DOWN: "Dir Down",
  APDS9960_DIR_LEFT: "Dir Left",
  APDS9960_DIR_RIGHT: "Dir Right",
  APDS9960_COLOR_RED: "Red",
  APDS9960_COLOR_GREEN: "Green",
  APDS9960_COLOR_BLUE: "Blue",
  APDS9960_COLOR_CLEAR: "Clear",
  ENABLE: "Enable",
  DISABLE: "Disable",

  // Sensing — Color (TCS34725 + APDS9960)
  TCS34725_INIT_LABEL: "TCS34725 color I²C init",
  TCS34725_name: "color sense",
  TCS34725_read: "read all values",
  TCS34725_values: "value",
  TCS34725_color: "is",
  TCS34725_color2: "color?",
  TCS34725_GAIN_1X: "No gain",
  TCS34725_GAIN_4X: "4x gain",
  TCS34725_GAIN_16X: "16x gain",
  TCS34725_RED_RGB: "Red (RGB)",
  TCS34725_GREEN_RGB: "Green (RGB)",
  TCS34725_BLUE_RGB: "Blue (RGB)",
  TCS34725_CLARITY: "Clarity",
  TCS34725_HUE: "Hue (HSV)",
  TCS34725_SAT: "Saturation (HSV)",
  TCS34725_VAL: "Value (HSV)",
  TCS34725_LUX: "Lux",
  TCS34725_TEMP: "Temp",
  TCS34725_RED_RAW: "Red Raw",
  TCS34725_GREEN_RAW: "Green Raw",
  TCS34725_BLUE_RAW: "Blue Raw",
  TCS34725_COLOR_RED: "Red",
  TCS34725_COLOR_ORANGE: "Orange",
  TCS34725_COLOR_YELLOW: "Yellow",
  TCS34725_COLOR_GREEN: "Green",
  TCS34725_COLOR_CYAN: "Cyan",
  TCS34725_COLOR_BLUE: "Blue",
  TCS34725_COLOR_VIOLET: "Violet",

  // Sensing — Magnet
  HMC5883_INIT_LABEL: "HMC5883 compass I²C init",
  HMC5883_read: "compass read values",
  HMC5883_values: "value",
  HMC5883_X: "magnetic vector X",
  HMC5883_Y: "magnetic vector Y",
  HMC5883_Z: "magnetic vector Z",
  HMC5883_HEADING: "Heading º",
  HALL_NAME: "hall magnetic",
  HALL_DETECTED: "detected",

  // Sensing — Vibration
  VIBRATION_NAME: "vibration",
  VIBRATION_DETECTED: "detected",
  TILT_NAME: "tilt",
  TILT_DETECTED: "detected",
  KNOCK_NAME: "knock",
  KNOCK_DETECTED: "detected",

  // Sensing — Humidity (water / soil / vapor)
  WATER_NAME: "water level",
  MOISTURE_NAME: "soil moisture",
  VAPOR_NAME: "steam",

  // Sensing — Gas
  GAS_NAME: "gas CO",
  GAS_DETECTED: "detected",
  ALCOHOL_NAME: "alcohol",
  ALCOHOL_DETECTED: "detected",

  // Sensing — Pressure (BME280)
  BME280_INIT_LABEL: "BME280 atmospheric pressure I²C init",
  BME280_INIT_TOOLTIP:
    "Initialize BME280 sensor. I2C: SDA A4, SCL A5 on Uno.",
  bme280_tooltip:
    "Initialize BME280 sensor. I2C: SDA A4, SCL A5 on Uno.",
  bme280_pressure: "atmospheric pressure (hPa)",
  BME280_PRESSURE_TOOLTIP: "Returns atmospheric pressure in hPa from BME280.",
  bme280_pressure_tooltip:
    "Returns atmospheric pressure in hPa from initialized BME280.",

  // Sensing — RTC (DS3231 + ESP32 internal)
  RTCDS3231_INIT_LABEL: "DS3231 RTC I²C init",
  RTCDS3231_RTC: "set date & time",
  RTCDS3231_DAY: "day",
  RTCDS3231_MONTH: "month",
  RTCDS3231_YEAR: "year",
  RTCDS3231_HOUR: "hour",
  RTCDS3231_MINUTE: "minute",
  RTCDS3231_SECOND: "second",
  RTCDS3231_DOFWEEK: "day of week",
  RTCDS3231_READ_RTC: "RTC read date & time",
  RTCDS3231_VALUES: "value",
  RTCDS3231_Name2: "RTC",
  RTCDS3231_TEXT_DOFWEEK: "Day of week",
  RTCDS3231_TEXT_MONTH: "Month",
  INTERNALRTC_INIT_LABEL: "ESP32 internal RTC init",
  INTERNALRTC_NAME: "Internal RTC",
  INTERNALRTC_RTC: "Set Date & Time",
  INTERNALRTC_DAY: "Day",
  INTERNALRTC_MONTH: "Month",
  INTERNALRTC_YEAR: "Year",
  INTERNALRTC_HOUR: "Hour",
  INTERNALRTC_MINUTE: "Minute",
  INTERNALRTC_SECOND: "Second",
  INTERNALRTC_DOFWEEK: "Day of week",
  INTERNALRTC_VALUES: "value",
  INTERNALRTC_GETDATE: "Get Date",
  INTERNALRTC_GETTIME: "Get Time",

  // Sensing — RFID / NFC
  RFID_INIT_LABEL: "MFRC522 RFID init",
  RFID_INIT_CUSTOM_LABEL: "MFRC522 RFID custom SPI init",
  RFID_name: "RFID",
  RFID_init2: "SCK, MOSI & MISO",
  RFID_PIN_SDA: "SDA",
  RFID_PIN_RST: "RST",
  RFID_PIN_SCK: "SCK",
  RFID_PIN_MISO: "MISO",
  RFID_PIN_MOSI: "MOSI",
  RFID_VALID_VAR: "validation card:",
  RFID_STOP: "stop reading",
  RFID_C1: "value1",
  RFID_C2: "value2",
  RFID_C3: "value3",
  RFID_C4: "value4",
  RFID_DETECTED: "card detected?",
  RFID_READED: "card read?",
  RFID_CARD_READED: "read value",
  RFID_CHECK_CARD: "is card read = validation card",
  RFID_CHECK_CARD2: "?",
  NFC_INIT_LABEL: "PN532 NFC I²C init",
  NFC_name: "NFC",
  NFC_VALID_VAR: "validation card (4 bytes):",
  NFC_VALID_VAR2: "validation card (7 bytes):",
  NFC_C1: "value1",
  NFC_C2: "value2",
  NFC_C3: "value3",
  NFC_C4: "value4",
  NFC_C5: "value5",
  NFC_C6: "value6",
  NFC_C7: "value7",
  NFC_DETECTED: "card detected?",
  NFC_CARD_READED: "read value",
  NFC_CHECK_CARD: "is card read = validation card",
  NFC_CHECK_CARD2: "?",

  // Sensing — gyro (MPU6050)
  OTTO9_GETG_TEXT: "read accelerations & angular velocity",
  OTTO9_GETG_TEXT2: "value",
  GYRO_INIT_TOOLTIP:
    "In Setup: Wire.begin + MPU6050 init. In Loop: refresh ax–gz for gyro_getg.",
  GYRO_GET_TOOLTIP: "Returns ax/ay/az or gx/gy/gz after a loop refresh.",

  // Sensing — GPS
  GPS_name: "🛰️ GPS NEO-6",
  GPS_init: "GPS",
  GPS_TX: "TX",
  GPS_RX: "RX",
  GPS_readvalues: "read and save values",
  GPS_paramter: "location parameters:",
  GPS_paramter3: "date time:",
  GPS_INIT_TOOLTIP: "Initialize NEO-6M GPS via SoftwareSerial (9600 baud).",
  GPS_INIT_ESP32_TOOLTIP: "Initialize GPS on ESP32 Serial2 (9600 baud).",
  GPS_READ_TOOLTIP: "Parse NMEA and update cached GPS variables.",
  GPS_LOCATION_TOOLTIP: "Returns cached latitude, longitude, altitude, etc.",
  GPS_SPEED_TOOLTIP: "Returns cached speed (knots, mph, m/s, km/h).",
  GPS_DATETIME_TOOLTIP: "Returns cached date/time field from GPS fix.",

  // Sensing — buttons
  BUTTON_NAME: "button",
  BUTTON_TOUCH_NAME: "touch",
  BUTTON_PRESSED: "pressed?",
  BUTTON_SENSOR_TOOLTIP:
    "Digital button. Enable checkbox for inverted (active-low) logic.",
  BUTTON_TOUCH_TOOLTIP: "Capacitive touch pad read as digital input.",
  MRTX_BUTTON: "MRTNode start button pressed?",
  MRTX_BUTTON_TOOLTIP: "On-board start button on MRT boards.",

  // Sensing — knob / rotary encoder
  POTE_NAME: "potentiometer",
  POTENTIOMETER_TOOLTIP: "Analog potentiometer (slider/knob) value.",
  RotaryEncoderInit: "rotary encoder",
  RotaryEncoderNumber: "encoder",
  RE_PINDT: "DT",
  RE_PINCLK: "CLK",
  RE_READ: "read value",
  RE_WRITE: "write value",
  RE_Button: "button",
  RE_Pressed: "pressed?",
  ROTARY_ENCODER_INIT_TOOLTIP:
    "Create Encoder library instance on interrupt-capable CLK/DT pins.",
  ROTARY_ENCODER_WRITE_TOOLTIP: "Set encoder counter (value × 4 steps).",
  ROTARY_ENCODER_READ_TOOLTIP: "Read encoder position (steps ÷ 4).",
  ROTARY_ENCODER_BUTTON_TOOLTIP:
    "Encoder push button with internal pull-up (active low).",

  // Sensing — joystick
  JOYSTICK_NAME: "joystick axis",
  JOYSTICK_BUTTON: "joystick button",
  JOYSTICK_AXIS_TOOLTIP: "Analog joystick X or Y axis value.",
  JOYSTICK_BUTTON_TOOLTIP:
    "Joystick push button with INPUT_PULLUP (active LOW).",

  // Sensing — shared
  VALUE: "0-1023",
  PERCENT: "0-100%",

  // LED — digital / basic
  CAT_numerique: "digital",
  del: "LED ",
  del_tooltip: "Turns on (off) the LED connected to the indicated pin",
  on_off: "ON/OFF",
  menublink: "blink speed",
  blink: "board LED blink",
  blink_tooltip: "The board LED flashes once at the selected speed",
  ARDUINO_INOUT_BUILDIN_LED_INPUT: "board LED",
  ARDUINO_INOUT_BUILDIN_LED_TOOLTIP:
    "Turn off or turn on the LED on the Arduino board",

  // LED — RGB
  rvb_init: "RGB LED",
  rvb_init_tooltip: "Indicate the PWM pins to connect to the RGB LED",
  rvb_set: "show color",
  rvb_anode: "common anode",
  rvb_cathode: "common cathode",
  rvb_set_x: "board RGB LED show color",
  rvb_set_tooltip:
    "Displays a color from red, green and blue component values",

  // LED — NeoPixel
  pixel1: "NeoPixel",
  pixel2: "show pixels",
  pixel3: "color",
  pixel4: "# of pixels",
  pixel5: "set brightness",
  pixel6: "pixel #",
  pixel1_tooltip:
    "NeoPixel RGB module: indicate the data pin and number of pixels",
  pixel2_tooltip: "Show changes made to the pixel buffer",
  pixel5_tooltip: "Adjust pixel brightness (from 0 to 255)",
  pixel3_tooltip:
    "Choose the pixel to light and its color (indexing starts at 0)",

  // LED — matrix / MAX7219
  matrice: "matrix",
  matrice8x8_del_tooltip: "Matrix LED control (coordinates start at 0)",
  matrice8x8_helpurl: "https://xantorohara.github.io/led-matrix-editor/",
  MAX7219_LM_NAME: "LED Matrix",
  MAX7219_LM_CS: "CS",
  MAX7219_LM_CLK: "CLK",
  MAX7219_LM_DAT: "DIN",
  MAX7219_LM_Number: "#",
  MAX7219_LM_Brightness: "brightness",
  MAX7219_LM_SHUTDOWN: "activate",
  MAX7219_LM_CLEAR: "clear",
  MAX7219_LM_PAINT: "draw",
  MAX7219_LM_Row: "row",
  MAX7219_LM_value: "value (bin or hex or dec)",
  MAX7219_LM_Column: "column",
  MAX7219_LM_Led: "LED",
  OTTO9_MOVE_SPEED_TEXT: "speed",

  // Displays — OLED
  OTTO_HOME_TEXT: "⚙️",
  OLED_height: "height",
  OLED_width: "width",
  OLED_IconName: "icon design",
  OLED_ValueList: "values(hex array)",
  OLED_DrawiconName: "draw",
  OLED_X0: "X0",
  OLED_Y0: "Y0",
  OLED_COLOR: "set color",
  LCD_SHIELD_PRINT_TEXT: "show",
  LCD_raz_tooltip: "clear screen 🧹",
  LCDP_Print: "print",

  // Displays — LCD I2C
  LCD_I2C_setup: "LCD I²C address",
  LCDP_Column: "columns",
  LCDP_Row: "rows",
  LCDP_Column2: "column",
  LCDP_Row2: "row",
  LCDP_Clear: "LCD I²C clear",
  LCDP_scrollDisplay: "LCD I²C scroll display ",
  LCDP_setBcklight: "LCD I²C set backlight ",
  LCDP_showCursor: "LCD I²C show cursor ",
  LCDP_blinkCursor: "LCD I²C blink cursor ",
  LCDP_Home: "LCD I²C home",
  LCDP_SetCursor: "LCD I²C set cursor",
  LCDP_Display: "LCD I²C ",

  // Displays — ST7735 TFT
  ST7735_name: "TFT",
  ST7735_init: "TFT ST7735",
  ST7735_init2: "SCL=SCK SDA=MOSI.",
  ST7735_PIN_CS: "CS",
  ST7735_PIN_RST: "RST/RES",
  ST7735_PIN_DC: "A0/DC",
  ST7735_WRAP: "color",
  ST7735_FILLBACKGROUND: "fill background color",
  ST7735_Rotate: "rotate",
  ST7735_Invert: "invert",
  ST7735_SetCursor: "set cursor",
  ST7735_X0: "X0",
  ST7735_Y0: "Y0",
  ST7735_X1: "X1",
  ST7735_Y1: "Y1",
  ST7735_X2: "X2",
  ST7735_Y2: "Y2",
  ST7735_TEXTCOLOR: "set text color",
  ST7735_TEXTCOLOR2: "color",
  ST7735_TEXTsize: "set text size",
  ST7735_TEXTwrap: "set text wrap",
  ST7735_PrintTextLN: "print the text/value",
  ST7735_PrintTextLN2: "line feed",
  ST7735_DrawPixel: "draw pixel",
  ST7735_Drawlinefrom: "draw line from",
  ST7735_Drawlineto: "to",
  ST7735_Drawrectangle: "draw rectangle",
  ST7735_Drawtriangle: "draw triangle.Corner points",
  ST7735_Drawroundrectangle: "draw round rectangle",
  ST7735_Drawroundrectangleradius: "round",
  ST7735_Drawrectanglewidth: "width",
  ST7735_Drawrectangleheight: "height",
  ST7735_Drawcircle: "draw circle.Center in",
  ST7735_Drawcircleradius: "radius",
  ST7735_Drawfill: "fill",
  ST7735_properties: "return property:",
  ST7735_IconName: "icon",
  ST7735_ValueList: "hex array",
  ST7735_DrawiconName: "draw Icon",

  // Displays — TM1637
  TM1637_name: "TM1637 display 7 segment.",
  TM1637_init: "TM1637 display 7 segment",
  TM1637_PinCLK: "CLK",
  TM1637_PinDIO: "DIO",
  M1637_Brightness: "set brightness(0-7)",
  M1637_turnOFF_ON: "turn",
  M1637_Clear: "clear",
  M1637_number: "set number",
  M1637_Digit: "position(0-3)",
  M1637_Length: "number of digits",
  M1637_fill: "leading zeros",
  M1637_digitsegment: "set segment array digit(0-3)",
  M1637_value: "value",
  M1637_arraysegment: "display segment array.",
  M1637_points: "Points",

  // Audio — buzzer / tone
  play: "play",
  play_tooltip: "play the note",
  play_helpurl: "",
  beep: "🦗 beep on",
  beep_TOOLTIP: "beeps (at 440Hz for 1s) on the selected Pin",
  ARDUINO_TONE_INPUT1: "🎼 buzzer",
  ARDUINO_TONE_INPUT1_X: "🎼 internal buzzer",
  ARDUINO_TONE_INPUT2: "🎼 frequency (Hz)",
  ARDUINO_TONE_INPUT3: "⏰ duration (ms)",
  ARDUINO_TONE_TOOLTIP:
    "emit a sound on the selected Pin, at the desired frequency and for the desired duration",
  ARDUINO_NOTONE_INPUT: "🛑 stop sound on",
  ARDUINO_NOTONE_TOOLTIP: "stop the sound on the selected Pin",
  ARDUINO_RTTTL_BLOCK: "play ring tone",
  OTTO9_BUZZER: "buzzer",

  // Audio — DFPlayer Mini
  lp2i_mp3_helpurl: "https://wiki.dfrobot.com/DFPlayer_Mini_SKU_DFR0299",
  lp2i_mp3_Volume: "volume [0-30]",
  lp2i_mp3_autoplay: "autoplay",
  lp2i_mp3: "MP3 player",
  lp2i_mp3_tooltip:
    "DFPlayer Mini MP3: initialization, volume and operating mode",
  lp2i_mp3_play: "▶️ play MP3",
  lp2i_mp3_play_track_tooltip: "▶️ plays the specified track song file 0-2999",
  lp2i_mp3_play_tooltip: "▶️ plays the current song file",
  lp2i_mp3_pause: "⏸️ pause MP3",
  lp2i_mp3_pause_tooltip: "pause the current song file",
  lp2i_mp3_prev: "⏮️ play previous MP3",
  lp2i_mp3_prev_tooltip: "⏮️ reads the previous track song file",
  lp2i_mp3_vol: "🎚️ set the volume",
  lp2i_mp3_vol_tooltip: "🎚️ sets the volume to the specified value [0-31]",
  lp2i_mp3_next: "⏭️ play next MP3",
  lp2i_mp3_next_tooltip: "⏭️ reads the following track song file",

  // Audio — OpenSmart MP3
  MP3OS_name: "MP3 opensmart",
  MP3OS_TX: "TX",
  MP3OS_RX: "RX",
  MP3OS_volumen: "set Volume(0-30)",
  MP3OS_operation: "operation:",
  MP3OS_playsong: "play track #",
  MP3OS_playsongdirectory: "folder #",
  MP3OS_inject: "inject track number",

  // Audio — Radio TEA5767
  TEA5767_name: "radio TEA5767",
  TEA5767_init: "radio TEA5767 I²C",
  TEA5767_turnOFF_ON: "turn",
  TEA5767_muteOFF_ON: "mute",
  TEA5767_Level: "level of the signal",
  TEA5767_Stereo: "stereo signal?",
  TEA5767_RadioStation: "radio station.",
  TEA5767_SetFrequency: "frequency (Mhz)",
  TEA5767_MadridFrequency: "Madrid radio station:",

  // IoT — WiFi / ESP
  WIFI_sta_init: "WIFI.Connect as Station",
  WIFI_ap_init: "WIFI.Create an Access Point",
  WIFI_sta_ap_init: "WIFI. Station and create an Access Point",
  WIFI_password: "password:",
  WIFI_ssid: "Wifi ssid:",
  WIFI_password_ap: "and this password:",
  WIFI_ssid_ap: "Wifi ssid name:",
  WIFI_logs: "Enable logs",
  Wifi_ap_fixip: "Access point mode.Static IP",
  Wifi_sta_fixip: "Station mode.Static IP",
  Wifi_ip: "IP",
  Wifi_Mask: "Mask",
  Wifi_Gateway: "Gateway",
  ESP_yield: " Yield function",
  ESP_deepsleep: "DeepSleep ",
  ESP_timesleep: "Seconds",
  ESP_restart: "Restart ESP8266/ESP32",

  // IoT — MQTT
  MQTT_name: "MQTT",
  MQTT_name_init: "Configuration MQTT protocol",
  MQTT_password: "password:",
  MQTT_ssid: "Wifi ssid:",
  MQTT_server: "Server (broker):",
  MQTT_port: "port:",
  MQTT_user: "User:",
  MQTT_APIkey: "API Key:",
  MQTT_client: "ID client:",
  MQTT_topicattend: "Loop MQTT",
  MQTT_topicsubscribe: "Subscribe to the topic",
  MQTT_topicsubscribe2: "and save num value in the variable",
  MQTT_topicsubscribe3: "and save text value in the variable",
  MQTT_topicpublish: "Publish in the topic",
  MQTT_topicvalue: "Value",
  MQTT_logs: "Enable logs",

  // IoT — IFTTT
  IFTTT_init: "Configuration.Api key",
  IFTTT_send: "Send information",
  IFTTT_event: "Event as String",
  IFTTT_value1: "Value 1 as String",
  IFTTT_value2: "Value 2 as String",
  IFTTT_value3: "Value 3 as String",

  // IoT — NTP
  NTP_NAME: "Init NTP Server.",
  NTP_NAME2: "NTP Server.",
  NTP_READ_RTC: "NTP Server.Read the date and time",
  NTP_GMT: "GMT",
  NTP_VALUES: "value",
  NTP_EPOCH: "Epoch",
  NTP_DAY: "Day",
  NTP_MONTH: "Month",
  NTP_YEAR: "Year",
  NTP_HOUR: "Hour",
  NTP_MINUTE: "Minute",
  NTP_SECOND: "Second",
  NTP_DOFWEEK: "Day of week",
  NTP_TEXT_DOFWEEK: "Day of week in string",
  NTP_TEXT_MONTH: "Month in string ",
  NTP_TEXT_TIME: "Time in string ",

  // IoT — OpenWeather
  Openweather_init: "Configuration OpenWeather.",
  Api_key: "Api Key",
  ReadWeather: "OpenWeather.Read Weather.",
  City: "City",
  CountryCode: "Country Code",
  OW_Value: "OpenWeather. Value:",
  LocationOW: "Location",
  Country: "Country",
  Icon: "Icon",
  Weather: "Weather",
  Description: "Description",
  OW_Temperature: "Temperature ºC",
  Temp_max: "Temperature Max ºC",
  Temp_min: "Temperature Min ºC",
  Humidity: "Humidity",
  Preassure: "Preassure",
  Feels_like: "Feels like Temperature ºC",
  Cloud: "Cloud %",
  Visibility: "Visibility %",
  wind_speed: "Wind Speed",
  wind_angle: "Wind Angle",
  icon_id: "Icon Weather Id",
  sunrise: "Sunrise EPOC",
  sunset: "Sunset EPOC",

  // IoT — Thingspeak
  Thingspeak_name_init: "Configuration Thingspeak.",
  Thingspeak_name: "Thingspeak.",
  Thingspeak_channel: "Channel",
  Thingspeak_apiread: "Api read key",
  Thingspeak_apiwrite: "Api write key",
  Thingspeak_Write: "Write value",
  Thingspeak_field: "in field",
  Thingspeak_ReadLong: "Read as long the field",
  Thingspeak_ReadFloat: "Read as float the field",

  // IoT — Firebase
  Firebase_name_init: "Configuration Firebase.",
  firebase_name: "Firebase.",
  Firebase_url: "URL",
  Firebase_api: "Api key",
  Firebase_start: " Initialization in Setup",
  Firebase_type: " Store ",
  Firebase_read: " Read ",
  Firebase_Node: "in node",
  Firebase_Value: "value",
  Firebase_String_Node: "Store a text in node",
  Firebase_Read_String_Node: "Read the text in node",
  firebase_delete: "Delete node",

  // IoT — Telegram
  Telegram_name_init: "Configuration Telegram chat.",
  Telegram_name: "Telegram.",
  Telegram_BotToken: "BOT token",
  Telegram_ChatID: "Chat ID",
  Telegram_Loop: "Telegram Loop.Update messages",
  Telegram_receive: "Telegram.When message is recived",
  TelegramSend: "Send message:",
  Telegram_message: "Telegram.Received message",
  Telegram_fromName: "Name of person sent the message",

  // IoT — WiFi server
  WifiServer_wait: "Wait connections of clients",
  WifiServer_port: "Wifi server begin in port",
  WifiServer_ESP8266webserver_port: "Wifi AsynWebServer begin in port",
  WifiServer_answer: "Wifi server answer:",
  WifiServer_stop: "Stop the connected client to the our server",
  WifiServer_flush: "Flush the connected client to the our server",
  WifiServer_ip: "IP of the connected customer",
  WifiServer_request: "Request of the connected customer",
  WifiServer_ESP8266webserver_parameter: "AsynWebServer Read the parameter: ",
  WifiServer_ESP8266webserver_parameter2: "AsynWebServer Parameter: ",
  WifiServer_esp8266_send_html_URL:
    "When a client with this URL (empty for root):",
  WifiServer_esp8266_send_html_HTML_page: "is connected then show this HTML page: ",
  WifiServer_esp8266_send_html_execute: "(optional) and do: ",
  WifiServer_esp8266_manage_requets: "Manage client request",
  WifiServer_esp8266_send_text: "is connected then show this text: ",
  WifiServer_ESP8266webserver_OTA: "OTA is enabled",
  esp8266_send_html_title: "PageName",
  esp8266_html_webpage: "HTML page name:",
  esp8266_html_tooltip: "Build HTML page content",
  esp8266_send_html_tooltip: "Register HTML page route",

  // IoT — ESP-NOW
  ESPNOW_init: "Init the protocol. Node",
  ESPNOW_msg_received: "When a message is received",
  ESPNOW_send_all: "Send the message to all nodes.",
  ESPNOW_send_mac: "Send the message to the mac: ",
  ESPNOW_fill_int: "Fill the Int param of the struct to:",
  ESPNOW_fill_float: "Fill the Float param of the struct to:",
  ESPNOW_fill_text: "Fill the Text param of the struct to:",
  ESPNOW_read_node: "Id node received",
  ESPNOW_read_param_int: "Param Int received",
  ESPNOW_read_param_float: "Param Float received",
  ESPNOW_read_param_text: "Param Text received",

  // IoT — Alexa
  Alexa_init: "Alexa.Device number:",
  Alexa_init2: "Name:",
  Alexa_cb: "When a Alexa message is received from device:",
  Alexa_Loop: "Manage the Alexa connection.Loop",
  Alexa_Param: "Get parameter",

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


