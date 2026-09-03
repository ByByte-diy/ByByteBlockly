/**
 * Maps Blockly category message keys to icon asset filenames.
 * Icons live in src/assets/icons/categories/{filename}.svg
 */
export const CATEGORY_ICON_FILES: Record<string, string> = {
  CAT_GENERIC: 'generic',
  CAT_BYBYTE: 'robot',
  CAT_TIME: 'clock',
  CAT_PORTS: 'gpio',
  CAT_LOGIC: 'logic',
  CAT_MATH: 'math',
  CAT_TEXT: 'text',
  CAT_FUNCTIONS: 'function',
  CAT_VARIABLES: 'variable',
  CAT_ARRAYS: 'array',
  CAT_SENSING: 'sensor',
  CAT_SENSING_DISTANCE: 'ruler',
  CAT_SENSING_SOUND: 'mic',
  CAT_SENSING_TEMPERATURE: 'thermometer',
  CAT_SENSING_LIGHT: 'sun',
  CAT_SENSING_GESTURE: 'hand',
  CAT_SENSING_COLOR: 'palette',
  CAT_SENSING_MAGNET: 'magnet',
  CAT_SENSING_VIBRATION: 'vibration',
  CAT_SENSING_HUMIDITY: 'droplet',
  CAT_SENSING_CO2: 'cloud',
  CAT_SENSING_GAS: 'gas',
  CAT_SENSING_PRESSURE: 'gauge',
  CAT_SENSING_REALTIMECLOCK: 'clock',
  CAT_SENSING_RFID: 'card',
  CAT_SENSING_COMPASS: 'compass',
  CAT_SENSING_GYRO: 'gyro',
  CAT_SENSING_GPS: 'gps',
  CAT_SENSING_BUTTONS: 'button',
  CAT_SENSING_KNOB: 'knob',
  CAT_SENSING_JOYSTICK: 'joystick',
  CAT_MOTORS: 'motor',
  CAT_MOTORS_SERVO: 'servo',
  CAT_MOTORS_STEPPER: 'stepper',
  CAT_MOTORS_DC: 'motor',
  CAT_LED: 'led',
  CAT_LED_RGB: 'led-rgb',
  CAT_LED_NEOPIXEL: 'neopixel',
  CAT_LED_NEOMATRIX: 'matrix',
  CAT_LED_BARS: 'led-bar',
  CAT_LED_MATRIX: 'matrix',
  CAT_DISPLAYS: 'display',
  CAT_DISPLAYS_OLED: 'oled',
  CAT_DISPLAYS_TFT: 'tft',
  CAT_DISPLAYS_LCD: 'lcd',
  CAT_AUDIO: 'speaker',
  CAT_AUDIO_BUZZER: 'buzzer',
  CAT_AUDIO_DFPLAYER: 'mp3',
  CAT_AUDIO_OPENSMART: 'mp3',
  CAT_AUDIO_RADIO: 'radio',
  CAT_COMMUNICATION: 'antenna',
  CAT_COMMUNICATION_SERIAL: 'serial',
  CAT_COMMUNICATION_SOFTSERIAL: 'serial',
  CAT_COMMUNICATION_BLUETOOTH: 'bluetooth',
  CAT_COMMUNICATION_REMOTE: 'remote',
  CAT_COMMUNICATION_KEYBOARD: 'keyboard',
  CAT_COMMUNICATION_MUVISION: 'muvision',
  CAT_IOT: 'cloud',
  CAT_IOT_WIFI: 'wifi',
  CAT_IOT_WIFISERVER: 'server',
  CAT_IOT_MQTT: 'mqtt',
  CAT_IOT_IFTTT: 'webhook',
  CAT_IOT_NTP: 'clock',
  CAT_IOT_OPENWEATHER: 'weather',
  CAT_IOT_THINGSPEAK: 'chart',
  CAT_IOT_TELEGRAM: 'telegram',
  CAT_IOT_HTML: 'html',
  CAT_IOT_FIREBASE: 'cloud',
  CAT_IOT_ESPNOW: 'wifi',
  CAT_IOT_ALEXA: 'speaker',
  CAT_ROBOT: 'robot',
  CAT_ROBOT_OTTO: 'robot',
  CAT_ROBOT_BYBYTE: 'robot',
  CAT_ROBOT_OTTO_BIPED: 'robot',
  CAT_ROBOT_OTTO_ARMS: 'robot',
  CAT_ROBOT_OTTO_QUAD: 'robot',
  CAT_ROBOT_OTTO_NINJA: 'robot',
  CAT_ROBOT_OTTO_WHEELS: 'motor',
  CAT_ROBOT_ESCORNABOT: 'robot',
  CAT_STORAGE: 'storage',
};

const BKY_KEY_PATTERN = /%\{BKY_(\w+)\}/;

/** Extract Blockly.Msg key from a category name like "%{BKY_CAT_GENERIC}". */
export function extractCategoryMsgKey(categoryName: string): string | null {
  const match = categoryName.match(BKY_KEY_PATTERN);
  return match?.[1] ?? null;
}

/** Resolve CSS classes for a toolbox category icon span. */
export function getCategoryIconCssClass(categoryName: string): string | undefined {
  const msgKey = extractCategoryMsgKey(categoryName);
  if (!msgKey) {
    return undefined;
  }

  const iconFile = CATEGORY_ICON_FILES[msgKey];
  if (!iconFile) {
    return undefined;
  }

  // Keep Blockly's default icon class — cssconfig.icon REPLACES, not merges.
  return `blocklyToolboxCategoryIcon toolbox-cat-icon toolbox-cat-icon--${iconFile}`;
}

/** Resolve icon filename for a category BKY name. */
export function getCategoryIconFile(categoryName: string): string | undefined {
  const msgKey = extractCategoryMsgKey(categoryName);
  return msgKey ? CATEGORY_ICON_FILES[msgKey] : undefined;
}
