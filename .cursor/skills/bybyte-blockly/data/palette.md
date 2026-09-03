# CATEGORY_PALETTE (hue 0–360)

File: `constants/category-palette.const.ts`. S=0.45, V=0.65 (Blockly default).

## Main toolbox categories

| Key | Hue | Category |
|-----|-----|----------|
| LOGIC | 0 | Logic |
| KEYBOARD | 340 | Communication → Keyboard |
| MOTORS | 30 | Motors / actuators |
| MATH | 45 | Math |
| PORTS | 55 | GPIO / ports |
| ARRAYS | 75 | Arrays |
| LOOPS | 90 | Loops (standard Blockly) |
| LED | 120 | LED |
| DISPLAYS | 140 | OLED / LCD / TFT |
| TEXT | 170 | Text |
| TIME | 180 | Time |
| STORAGE | 200 | EEPROM / storage |
| COMMUNICATION | 215 | Serial, BT, IR, MuVision |
| ROBOT | 230 | Robot container, Otto movement |
| GENERIC | 245 | Program / generic |
| IOT | 265 | WiFi, MQTT, cloud |
| SENSING | 285 | Sensors |
| FUNCTIONS | 300 | Functions |
| VARIABLES | 315 | Variables |
| AUDIO | 330 | Buzzer, MP3, radio |
| BYBYTE | 350 | ByByte robot |

## Accents (blocks inside flyouts)

| Key | Hue | Usage |
|-----|-----|-------|
| ROBOT_SOUND | 330 | Otto sound |
| ROBOT_EEPROM | 100 | Otto EEPROM |
| ROBOT_SENSOR | 160 | Otto sensor |
| ROBOT_ESCORNABOT_SENSOR | 285 | Escornabot sensor |
| IOT_HTML_VAR | 45 | IoT HTML var |
| IOT_HTML_TEXT | 330 | IoT HTML text |
| IOT_HTML_ELEMENT | 245 | IoT HTML element |
| IOT_HTML_TABLE | 200 | IoT HTML table |
| IOT_HTML_STYLE | 120 | IoT HTML style |
| IOT_HTML_FORM | 180 | IoT HTML form |
| IOT_WIFI_SERVER_ASYNC | 180 | WiFi server async |

## Rules

- New hue → add to `CATEGORY_PALETTE`; do not hardcode in config.
- `BLOCK_COLORS.X` = alias; prefer `CATEGORY_PALETTE` in new code.
- `#hex` only for `field_colour` defaults (HTML colour picker), not categories.
- Preview: `node -e "const B=require('blockly'); console.log(B.utils.colour.hueToHex(HUE))"`
