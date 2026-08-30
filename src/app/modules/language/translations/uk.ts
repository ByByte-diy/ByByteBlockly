/**
 * Ukrainian translations for Blockly blocks and categories
 * These are loaded into Blockly.Msg
 */

import * as Blockly from 'blockly';

// Export translations object
export const translations = {
  // Categories
  CAT_GENERIC: "Загальні",

  CAT_BYBYTE: "БАБАЙ",
  CAT_TIME: "Час",
  CAT_PORTS: "Ввід/Вивід",
  CAT_LOGIC: "Логіка",
  CAT_MATH: "Математика",
  CAT_TEXT: "Текст",
  CAT_FUNCTIONS: "Функції",
  CAT_VARIABLES: "Змінні",
  CAT_ARRAYS: "Масиви",
  CAT_SENSING: "Датчики",
  //Subcategories for Sensing
  CAT_SENSING_DISTANCE: "Відстань",
  CAT_SENSING_SOUND: "Шум",
  CAT_SENSING_TEMPERATURE: "Температура",
  CAT_SENSING_LIGHT: "Світло",
  CAT_SENSING_GESTURE: "Жести",
  CAT_SENSING_COLOR: "Колір",
  CAT_SENSING_MAGNET: "Магніт",
  CAT_SENSING_VIBRATION: "Вібрація",
  CAT_SENSING_HUMIDITY: "Вологість",
  CAT_SENSING_CO2: "CO₂",
  CAT_SENSING_GAS: "Газ",
  CAT_SENSING_PRESSURE: "Тиск",
  CAT_SENSING_REALTIMECLOCK: "Годинник",
  CAT_SENSING_RFID: "RFID",
  CAT_SENSING_COMPASS: "Компас",
  CAT_SENSING_GYRO: "Гіроскоп",
  CAT_SENSING_GPS: "GPS",

  CAT_MOTORS: "Двигуни",
  //Subcategories for Motors
  CAT_MOTORS_SERVO: "Сервопривід",
  CAT_MOTORS_STEPPER: "Кроковий двигун",

  CAT_LED: "Світлодіоди",
  //Subcategories for LEDs
  CAT_LED_RGB: "RGB світлодіод",
  CAT_LED_NEOPIXEL: "NeoPixel",
  CAT_LED_NEOMATRIX: "NeoMatrix",
  CAT_LED_BARS: "LED смуги",
  CAT_LED_MATRIX: "LED матриця",

  CAT_DISPLAYS: "Дисплеї",
  //Subcategories for Displays
  CAT_DISPLAYS_OLED: "OLED",
  CAT_DISPLAYS_TFT: "TFT",
  CAT_DISPLAYS_LCD: "LCD",

  CAT_AUDIO: "Звук",
  //Subcategories for Audio
  CAT_AUDIO_BUZZER: "Зуммер",
  CAT_AUDIO_DFPLAYER: "MP3 DFMini",
  CAT_AUDIO_OPENSMART: "MP3 OpenSmart",
  CAT_AUDIO_RADIO: "Радіо",

  CAT_COMMUNICATION: "Зв'язок",
  //Subcategories for Communication
  CAT_COMMUNICATION_SERIAL: "USB Serial",
  CAT_COMMUNICATION_SOFTSERIAL: "Soft Serial",
  CAT_COMMUNICATION_BLUETOOTH: "Bluetooth",
  CAT_COMMUNICATION_REMOTE: "Пульт",

  CAT_IOT: "IoT",
  //Subcategories for IoT
  CAT_IOT_WIFI: "WiFi",
  CAT_IOT_WIFISERVER: "WiFi сервер",
  CAT_IOT_MQTT: "MQTT",
  CAT_IOT_IFTTT: "IFTTT",
  CAT_IOT_NTP: "NTP",
  CAT_IOT_OPENWEATHER: "OpenWeather",
  CAT_IOT_THINGSPEAK: "Thingspeak",
  CAT_IOT_TELEGRAM: "Telegram",
  CAT_IOT_HTML: "HTML",

  CAT_STORAGE: "Сховище",

  //BLOCKS

  // Generic blocks
  GENERIC_SETUP: "⚙️ Конф.",
  GENERIC_LOOP: "🔄 Цикл",
  GENERIC_SETUP_LOOP_TOOLTIP:
    "Функція ініціалізації: \nВикористовується для ініціалізації змінних, напрямку пінів ... \nВиконується лише один раз \nФункція циклу: \nЦе основна частина програми, всі блоки, розміщені тут, будуть виконуватись у циклі та безкінечно (кілька тисяч разів на секунду)",
  GENERIC_SETUP_TOOLTIP: "Конф. секція - виконується один раз при запуску",
  GENERIC_LOOP_TOOLTIP: "Цикл секція - виконується безперервно",
  GENERIC_CODE_TOOLTIP: "Введіть власний код Arduino",
  GENERIC_CODE_DEFAULT_VALUE: "// Ваш код тут",
  GENERIC_DEFINE_TOOLTIP: "Визначте константу або макрос препроцесора",
  GENERIC_DEFINE_DEFAULT_VALUE: "#define LED_PIN 13",

  // Logic blocks - IF
  CONTROLS_IF_MSG_IF: "якщо",
  CONTROLS_IF_MSG_THEN: "то",
  CONTROLS_IF_MSG_ELSEIF: "інакше якщо",
  CONTROLS_IF_MSG_ELSE: "інакше",
  CONTROLS_IF_TOOLTIP: "Якщо значення істинне, виконати певні дії",
  CONTROLS_IF_IF_TITLE_IF: "якщо",
  CONTROLS_IF_IF_TOOLTIP: "Додати, видалити або змінити порядок секцій",
  CONTROLS_IF_ELSEIF_TITLE_ELSEIF: "інакше якщо",
  CONTROLS_IF_ELSEIF_TOOLTIP: "Додати умову до блоку if",
  CONTROLS_IF_ELSE_TITLE_ELSE: "інакше",
  CONTROLS_IF_ELSE_TOOLTIP: "Додати фінальну умову до блоку if",

  // Logic blocks - SWITCH
  CONTROLS_SWITCH_MSG_SWITCH: "обрати",
  CONTROLS_SWITCH_MSG_CASE: "варіант",
  CONTROLS_SWITCH_MSG_DO: "виконати",
  CONTROLS_SWITCH_MSG_DEFAULT: "за замовч.",
  CONTROLS_SWITCH_TOOLTIP:
    "Оператор вибору - виконує різний код залежно від значення",
  CONTROLS_SWITCH_VAR_TOOLTIP: "Контейнер для варіантів перемикача",
  CONTROLS_SWITCH_CASE_TITLE: "варіант",
  CONTROLS_SWITCH_CASE_TOOLTIP: "Додати варіант до перемикача",
  CONTROLS_SWITCH_DEFAULT_TITLE: "за замовч.",
  CONTROLS_SWITCH_DEFAULT_TOOLTIP: "Додати варіант за замовчуванням",

  // Logic blocks - FOR
  CONTROLS_FOR_MSG_FOR: "для",
  CONTROLS_FOR_MSG_FROM: "від",
  CONTROLS_FOR_MSG_TO: "до",
  CONTROLS_FOR_MSG_BY: "крок",
  CONTROLS_FOR_TOOLTIP:
    "Рахувати від початкового до кінцевого числа з вказаним кроком",

  // Logic blocks - REPEAT
  CONTROLS_REPEAT_MSG_REPEAT: "🔁 повторити",
  CONTROLS_REPEAT_MSG_TIMES: "разів",
  CONTROLS_REPEAT_TOOLTIP: "Повторити вкладені блоки вказану кількість разів",

  // Logic blocks - FLOW STATEMENTS
  CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK: "вийти з циклу",
  CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE: "продовжити наступну ітерацію",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK: "Вийти з поточного циклу",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE:
    "Пропустити решту циклу та продовжити з наступною ітерацією",
  CONTROLS_FLOW_STATEMENTS_WARNING:
    "Увага: Цей блок можна використовувати лише всередині циклу.",

  // Logic blocks - OPERATION
  LOGIC_OPERATION_AND: "та",
  LOGIC_OPERATION_OR: "або",
  LOGIC_OPERATION_XOR: "xor",
  LOGIC_OPERATION_SHIFTL: "<<",
  LOGIC_OPERATION_SHIFTR: ">>",
  LOGIC_OPERATION_TOOLTIP_AND: "Повертає істину, якщо обидва входи істинні",
  LOGIC_OPERATION_TOOLTIP_OR: "Повертає істину, якщо хоча б один вхід істинний",
  LOGIC_OPERATION_TOOLTIP_XOR: "Повертає істину, якщо рівно один вхід істинний",
  LOGIC_OPERATION_TOOLTIP_SHIFTL: "Зсув бітів вліво",
  LOGIC_OPERATION_TOOLTIP_SHIFTR: "Зсув бітів вправо",

  // Logic blocks - COMPARE
  LOGIC_COMPARE_TOOLTIP_EQ: "Повертає істину, якщо обидва входи рівні один одному",
  LOGIC_COMPARE_TOOLTIP_NEQ: "Повертає істину, якщо обидва входи не рівні один одному",
  LOGIC_COMPARE_TOOLTIP_LT: "Повертає істину, якщо перший вхід менший за другий",
  LOGIC_COMPARE_TOOLTIP_LTE: "Повертає істину, якщо перший вхід менший або рівний другому",
  LOGIC_COMPARE_TOOLTIP_GT: "Повертає істину, якщо перший вхід більший за другий",
  LOGIC_COMPARE_TOOLTIP_GTE: "Повертає істину, якщо перший вхід більший або рівний другому",

  // Math blocks - ANGLE
  MATH_ANGLE_TOOLTIP: "Кут значення (0-360 градусів)",

  // Math blocks - ANALOG INPUT
  MATH_ANALOG_INPUT_TOOLTIP: "Вибір аналогового піна",

  // Math blocks - ARITHMETIC
  MATH_ARITHMETIC_TOOLTIP_ADD: "Повертає суму двох чисел",
  MATH_ARITHMETIC_TOOLTIP_MINUS: "Повертає різницю двох чисел",
  MATH_ARITHMETIC_TOOLTIP_MULTIPLY: "Повертає добуток двох чисел",
  MATH_ARITHMETIC_TOOLTIP_DIVIDE: "Повертає частку двох чисел",
  MATH_ARITHMETIC_TOOLTIP_POWER: "Повертає перше число в степені другого",

  // Math blocks - RANGE COMPARE
  MATH_RANGE_COMPARE_TOOLTIP: "Перевіряє, чи значення знаходиться в діапазоні (наприклад, 5 < x < 10)",
  
  // Math blocks - MAP
  MATH_MAP_MSG_MAP: "привести",
  MATH_MAP_MSG_FROM: "від",
  MATH_MAP_MSG_TO: "до",
  MATH_MAP_TOOLTIP: "Перетворює значення з одного діапазону на інший",

  // Math blocks - CONSTRAIN
  MATH_CONSTRAIN_MSG_CONSTRAIN: "обмежити",
  MATH_CONSTRAIN_MSG_LOW: "між",
  MATH_CONSTRAIN_MSG_HIGH: "і",
  MATH_CONSTRAIN_TOOLTIP: "Обмежити значення між мінімальним і максимальним",

  // Math blocks - RANDOM INT
  MATH_RANDOM_INT_MSG_RANDOM_INT: "випадкове",
  MATH_RANDOM_INT_TOOLTIP: "Випадкове ціле число між мінімальним і максимальним",

  // Math blocks - ROUND
  MATH_ROUND_MSG_ROUND: "округлити",
  MATH_ROUND_MSG_ROUNDUP: "округлити вгору",
  MATH_ROUND_MSG_ROUNDDOWN: "округлити вниз",
  MATH_ROUND_TOOLTIP: "Округлити до найближчого цілого",
  MATH_ROUND_TOOLTIP_ROUNDUP: "Округлити вгору до найближчого цілого",
  MATH_ROUND_TOOLTIP_ROUNDDOWN: "Округлити вниз до найближчого цілого",

  // Math blocks - CAST BYTE
  MATH_CAST_BYTE_MSG_CAST_BYTE: "привести до byte",
  MATH_CAST_BYTE_TOOLTIP: "Привести значення до byte (0-255)",

  // Math blocks - CAST UINT
  MATH_CAST_UINT_MSG_CAST_UINT: "привести до unsigned int",
  MATH_CAST_UINT_TOOLTIP: "Привести значення до unsigned int (0-65535)",

  // Math blocks - CAST INT
  MATH_CAST_INT_MSG_CAST_INT: "привести до int",
  MATH_CAST_INT_TOOLTIP: "Привести значення до int (-32768 - 32767)",

  // Math blocks - CAST FLOAT
  MATH_CAST_FLOAT_MSG_CAST_FLOAT: "привести до float",
  MATH_CAST_FLOAT_TOOLTIP: "Привести значення до float (-3.4028234663852886e+38 до 3.4028234663852886e+38)",

  // Math blocks - SINGLE
  MATH_SINGLE_OP_ROOT: "√",
  MATH_SINGLE_OP_ABSOLUTE: "abs",
  MATH_SINGLE_TOOLTIP_ROOT: "Повернути квадратний корінь числа",
  MATH_SINGLE_TOOLTIP_ABS: "Повернути абсолютне значення числа",
  MATH_SINGLE_TOOLTIP_NEG: "Повернути від'ємне значення числа",

  // Math blocks - CONSTANT
  MATH_CONSTANT_TOOLTIP: "Повернути одну з поширених констант: π (3.141…), e (2.718…), φ (1.618…), √2 (1.414…), √½ (0.707…), або ∞ (нескінченність)",

  // Math blocks - TRIG
  MATH_TRIG_SIN: "sin",
  MATH_TRIG_COS: "cos",
  MATH_TRIG_TAN: "tan",
  MATH_TRIG_TOOLTIP_SIN: "Повернути синус числа (в радіанах)",
  MATH_TRIG_TOOLTIP_COS: "Повернути косинус числа (в радіанах)",
  MATH_TRIG_TOOLTIP_TAN: "Повернути тангенс числа (в радіанах)",

  // Variables blocks 
  VARIABLES_GET_NAME: "отримати",
  VARIABLES_GET_TOOLTIP: "Повертає значення цієї змінної.",

  // Variables blocks - SET
  VARIABLES_SET_NAME: "встановити",
  VARIABLES_SET_TO: "значення",
  VARIABLES_SET_TOOLTIP: "Встановлює цю змінну рівною вхідному значенню.",

  // Variables blocks - CHANGE
  MATH_CHANGE_NAME: "додати до",
  MATH_CHANGE_TO: "значення",
  MATH_CHANGE_TOOLTIP: "Додати число до змінної",

  // Variables blocks - SET INIT
  VARIABLES_SET_INIT_NAME: "оголосити",
  VARIABLES_TYPE: "типу",
  VARIABLES_SET_INIT_TOOLTIP: "Оголосити і ініціалізувати змінну з типом та значенням.",

  // Other Blockly messages
  COM1: "⚠️ оберіть USB",
  COM2: "⚠️ будь ласка, оберіть USB порт",
  CHECK: "перевірка...",
  UPLOAD: "завантаження...",
  ERROR: "🛑 ПОМИЛКА блоки НЕ з'єднані",
  VERIF: "⛔ спочатку перевірте код",
  YES: "так",
  NO: "ні",
  UPTODATE: "✅ ваша версія актуальна!",
  DOWNLOAD:
    "завантаження завершено, програма встановиться та перезапуститься ...",
  HIGH: "ВИСОКИЙ",
  LOW: "НИЗЬКИЙ",
};

// Apply to Blockly.Msg
Object.assign(Blockly.Msg, translations);

export default translations;


