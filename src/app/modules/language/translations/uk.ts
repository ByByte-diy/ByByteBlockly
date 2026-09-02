/**
 * Ukrainian translations for Blockly blocks and categories
 * These are loaded into Blockly.Msg
 */

import * as Blockly from 'blockly';

// Export translations object
export const translations = {
  // Toolbox level switcher
  LEVEL_LABEL: "Рівень:",
  LEVEL_BEGINNER: "Beginner",
  LEVEL_MIDDLE: "Middle",
  LEVEL_PRO: "Pro",

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
  CAT_SENSING_BUTTONS: "Кнопки",
  CAT_SENSING_KNOB: "Регулятор",
  CAT_SENSING_JOYSTICK: "Джойстик",

  CAT_MOTORS: "Двигуни",
  //Subcategories for Motors
  CAT_MOTORS_SERVO: "Сервопривід",
  CAT_MOTORS_STEPPER: "Кроковий двигун",
  CAT_MOTORS_DC: "DC двигун",

  CAT_LED: "Світлодіоди",
  //Subcategories for LEDs
  CAT_LED_BASIC: "Цифровий LED",
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
  CAT_COMMUNICATION_KEYBOARD: "Пристрої",
  CAT_COMMUNICATION_MUVISION: "AI-камера",

  KeyboardFunction: "клавіатура",
  KeyPressed: "клавіша",
  WriteText: "написати текст",
  LineFeed: "новий рядок",
  MouseFunction: "миша",
  MouseMoveX: "позиція X",
  MouseMoveY: "позиція Y",
  MouseMoveW: "колесо",

  LKL_VS2_HELP_INIT: "ініціалізація MU vision sensor, вибір порту.",
  LKL_VS2_HELP_VISION_LEVEL:
    "Рівень розпізнавання; вищий рівень зменшує хибні спрацювання, але може знизити точність.",
  LKL_VS2_HELP_VISION_ZOOM:
    "Масштаб зображення; вищий рівень збільшує дистанцію, але зменшує кут.",
  LKL_VS2_WARNING_SETUP_ONLY: "Цей блок можна розміщувати лише в блоці setup!",
  LKL_VS2_WARNING_MU_INIT:
    "Не забудьте ініціалізувати uart1, Serial1 та налаштувати baud.",
  LKL_VS2_ALL: "Усі",
  LKL_VS2_AUTO: "авто",
  LKL_VS2_VISION_ZOOM: "Масштаб",
  LKL_VS2_LEVEL: "рівень",
  LKL_VS2_HIGH_SPEED: "швидкість",
  LKL_VS2_NORMAL: "баланс",
  LKL_VS2_HIGH_ACCURACY: "точність",
  LKL_VS2_COLOR_BLOCK: "Кольоровий блок",
  LKL_VS2_VISION_COLOR_DETECT: "Кольоровий блок",
  LKL_VS2_VISION_COLOR_RECOGNITION: "Розпізнавання кольору",
  LKL_VS2_STATE_VALUE_X: "Горизонталь",
  LKL_VS2_STATE_VALUE_Y: "Вертикаль",
  LKL_VS2_STATE_VALUE_WIDTH: "Ширина",
  LKL_VS2_STATE_VALUE_HEIGHT: "Висота",
  LKL_VS2_STATE_VALUE_R_CHANNEL: "Канал R",
  LKL_VS2_STATE_VALUE_G_CHANNEL: "Канал G",
  LKL_VS2_STATE_VALUE_B_CHANNEL: "Канал B",
  LKL_VS2_STATE_VALUE_LABEL: "Мітка",
  LKL_VS2_ENABLE: "увімкнути",
  LKL_VS2_DISABLE: "вимкнути",
  LKL_VS2_LOCK_AWB: "Фікс. AWB",
  LKL_VS2_WHITE_LIGHT: "Біле світло",
  LKL_VS2_YELLOW_LIGHT: "Жовте світло",
  LKL_VS2_COLOR: "колір",
  LKL_VS2_DEFAULT: "типовий",
  LKL_VS2_LOW: "низький",
  LKL_VS2_MID: "середній",
  LKL_VS2_HIGH: "високий",
  LKL_VS2_MU: "ініціалізація",
  LKL_VS2_MODE: "режим",
  LKL_VS2_SetupVS: "налаштування",
  LKL_VS2_SET_RECOGNITION_REGION: "область розпізнавання",
  LKL_VS2_SET_MIN_RECOGNITION_SIZE: "мін. розмір розпізнавання",
  LKL_VS2_SERIAL: "порт",
  LKL_VS2_RESET: "скинути до типового",
  LKL_VS2_LED_DETECT_COLOR: "якщо виявлено",
  LKL_VS2_LED_UNDETECT_COLOR: "інакше",
  LKL_VS2_BRIGHTNESS: "яскравість",
  LKL_VS2_VISION_TYPE: "алгоритм",
  LKL_VS2_SET_VISION_LEVEL: "рівень",
  LKL_VS2_SET_FRAME_ROTATE: "повернути кадр",
  LKL_VS2_SET_CAMERA_HFR: "режим високого FPS",
  LKL_VS2_SET_CAMERA_AWB: "баланс білого камери",
  LKL_VS2_SET_VISION_ZOOM: "масштаб",
  LKL_VS2_SET_UART_BAUD: "швидкість UART",
  LKL_VS2_DETECTED: "виявлено",
  LKL_VS2_RECOGNIZED: "розпізнано",
  LKL_VS2_GET_DETECTED_MESSAGE: "отримати",
  LKL_VS2_VALUE: "значення",
  LKL_VS2_CARD_TYPE: "тип",
  LKL_VS2_COORDINATE: "координата",
  LKL_VS2_LIGHT_SENSOR: "датчик світла",
  LKL_VS2_SET: "встановити",
  LKL_VS2_SENSITIVITY: "чутливість",
  LKL_VS2_WB_CORRECTION: "корекція балансу білого",
  LKL_VS2_READ: "читати",
  LKL_VS2_PROXIMITY: "близькість",
  LKL_VS2_ALS: "освітленість",
  LKL_VS2_GESTURE_SENSOR: "жести",
  LKL_VS2_GESTURE: "жест",
  LKL_VS2_GESTURE_UP: "вгору",
  LKL_VS2_GESTURE_DOWN: "вниз",
  LKL_VS2_GESTURE_LEFT: "ліворуч",
  LKL_VS2_GESTURE_RIGHT: "праворуч",
  LKL_VS2_GESTURE_LIFT_UP: "підняти",
  LKL_VS2_GESTURE_PUSH_DOWN: "натиснути",
  LKL_VS2_SSID: "SSID",
  LKL_VS2_PASSWORD: "пароль",
  LKL_VS2_WAIT_CONNECT: "з'єднання успішне",
  LKL_VS2_DISCONNECT: "відключити",
  LKL_VS2_CLIENT: "клієнт",
  LKL_VS2_HOT_SPOT: "точка доступу",
  LKL_VS2_TARGET_IP: "цільовий IP",
  LKL_VS2_LOCAL_IP: "локальний IP",
  LKL_VS2_WRITE: "записати",

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
  CAT_IOT_FIREBASE: "Firebase",
  CAT_IOT_ESPNOW: "ESP-NOW",
  CAT_IOT_ALEXA: "Alexa",

  CAT_ROBOT: "Робот",
  CAT_ROBOT_OTTO_BIPED: "Двоногий",
  CAT_ROBOT_OTTO_ARMS: "Руки",
  CAT_ROBOT_OTTO_QUAD: "Четвероногий",
  CAT_ROBOT_OTTO_NINJA: "Ninja",
  CAT_ROBOT_OTTO_WHEELS: "Колеса",
  CAT_ROBOT_ESCORNABOT: "Escornabot",

  AV: "вперед",
  AR: "назад",

  OTTO9_HOME_TEXT: "додому",
  OTTO9_HOME_TOOLTIP: "Otto переходить у домашню позицію",
  OTTO9_CALIBRATION: "калібрувати ",
  OTTO9_CALIBRATION_LEG: "нога ",
  OTTO9_CALIBRATION_FOOT: "стопа ",
  OTTO9_CALIBRATION_TOOLTIP:
    "Використовуйте малі додатні та від'ємні значення поступово, доки робот не стане прямо (90°)",
  OTTO9_EEPROM_TEXT: "зберегти trim у EEPROM",
  OTTO9_EEPROM_TOOLTIP:
    "Використовуйте лише після повного вирівнювання (90°) один раз, потім видаліть цей блок",
  OTTO9_MOVE_TEXT: "рух",
  OTTO9_MOVE_TOOLTIP: "Базові рухи Otto",
  OTTO9_DANCE_TEXT: "танець",
  OTTO9_DANCE_TOOLTIP: "Otto танцює!",
  OTTO9_DANCE_SIZE_TEXT: "розмір",
  OTTO9_DO_TEXT: "виконати",
  OTTO9_DO_TOOLTIP: "Складні рухи Otto",
  OTTO9_GESTURE_TEXT: "жест",
  OTTO9_GESTURE_TOOLTIP: "Емоційні звуки разом із рухами",
  OTTO9_SOUND_TEXT: "звук",
  OTTO9_SOUND_TOOLTIP: "Емоційні звуки",
  OTTO9_GETNOISE_TEXT: "рівень шуму",
  OTTO9_GETNOISE_TOOLTIP:
    "Pin A6: 100 — тихо, 500 — шум, понад 1000 — гучно; налаштуйте чутливість trimmer",
  OTTO9_ARMS_TEXT: "руки ",
  OTTO9_ARMS_TOOLTIP: "Рух руками!",
  OTTO_WHEELS_TEXT: "колеса",
  OTTO_NINJA_TEXT: "ninja",
  OTTO_BIPED_TEXT: "двоногий",
  OTTO_HEAD_TEXT: "голова ",
  OTTO_FRONT_TEXT: "перед ",
  OTTO_BACK_TEXT: "зад ",
  OTTO_HIP_TEXT: "стегно ",
  OTTO_HELLO_TEXT: "привіт",
  OTTO_JUMP_TEXT: "стрибок",
  OTTO_SCARED_TEXT: "наляканий",
  OTTO_WALK_TEXT: "ходьба",
  OTTO_ROLL_TEXT: "кочення",
  OTTO_MODE_TEXT: " режим",

  ESCORNABOT_MODE_TEXT: "Escornabot",
  ESCORNABOT_INIT_TOOLTIP:
    "Режим: 1 — слабший, менше споживання; 2 — сильніший, більше живлення; 3 — середній",
  ESCORNABOT_URL: "https://escornabot.com/es/index",
  ESCORNABOT_SPIN: "Обертання: ",
  ESCORNABOT_SPIN_NUMBER: "Nº: ",
  ESCORNABOT_SPIN_TOOLTIP:
    "Кількість обертів (від'ємне значення — назад) і швидкість",
  ESCORNABOT_SPIN_VELOCITY_TEXT: "Швидкість: ",
  ESCORNABOT_DISTANCE: "Відстань: ",
  ESCORNABOT_DISTANCE_TEXT: "см: ",
  ESCORNABOT_DISTANCE_TOOLTIP:
    "Відстань у см (від'ємне значення — рух назад) і швидкість",
  ESCORNABOT_TURNSPIN_TEXT: "Поворот на N обертів: ",
  ESCORNABOT_TURNSPIN_TOOLTIP:
    "Поворот за/проти годинникової (залежно від знаку числа обертів)",
  ESCORNABOT_TURNANGLE_TEXT: "Поворот на кут: ",
  ESCORNABOT_ANGLE_NUMBER: "Кут: ",
  ESCORNABOT_TURNANGLE_TOOLTIP:
    "Поворот на кут (знак визначає напрямок)",
  ESCORNABOT_STOP_TEXT: "Стоп",
  ESCORNABOT_STOP_TOOLTIP: "Зупинити робота",
  ESCORNABOT_BEEP_TEXT: "Сигнал",
  ESCORNABOT_TIME_TEXT: "мс",
  ESCORNABOT_BEEP_TOOLTIP: "Сигнал протягом заданого часу",
  ESCORNABOT_LEDON_TEXT: "LED увімк.: ",
  ESCORNABOT_LEDOFF_TEXT: "LED вимк.: ",
  ESCORNABOT_LEDON_TOOLTIP: "Увімкнути обраний LED",
  ESCORNABOT_LEDOFF_TOOLTIP: "Вимкнути обраний LED",
  ESCORNABOT_GETBUTTON_TEXT: "Кнопка натиснута: ",
  ESCORNABOT_GETBUTTON_TOOLTIP: "Перевірити, чи натиснута обрана кнопка",
  ESCORNABOT_APP_TOOLTIP: "Автономна робота",
  ESCORNABOT_APP_URL: "https://escornabot.com/es/descargas",
  ESCORNABOT_USINIT_TEXT: "Ультразвук",
  ESCORNABOT_TRIGGER_TEXT: "Trigger",
  ESCORNABOT_ECHO_TEXT: "Echo",
  ESCORNABOT_GETUS_TEXT: "Відстань",
  ESCORNABOT_GETUS_TOOLTIP: "Відстань",
  ESCORNABOT_IRINIT_TEXT: "Ініціалізація IR",
  ESCORNABOT_IR_TOOLTIP: "Ініціалізація інфрачервоних сенсорів",
  ESCORNABOT_GETBLACKLEFT_TEXT: "Чорний зліва",
  ESCORNABOT_GETBLACKLEFT_TOOLTIP: "TRUE, якщо зліва виявлено чорний",
  ESCORNABOT_GETBLACKRIGHT_TEXT: "Чорний справа",
  ESCORNABOT_GETBLACKRIGHT_TOOLTIP: "TRUE, якщо справа виявлено чорний",
  ESCORNABOT_GETWHITELEFT_TEXT: "Білий зліва",
  ESCORNABOT_GETWHITELEFT_TOOLTIP: "TRUE, якщо зліва виявлено білий",
  ESCORNABOT_GETWHITERIGHT_TEXT: "Білий справа",
  ESCORNABOT_GETWHITERIGHT_TOOLTIP: "TRUE, якщо справа виявлено білий",
  ESCORNABOT_IRLEFT_TEXT: "лівий",
  ESCORNABOT_IRRIGHT_TEXT: "правий",

  CAT_STORAGE: "Сховище",

  // Motors — Servo
  pin: "Пін",
  vitesse: "швидкість",
  direction: "напрям",
  values: "↺0-90 | ↻90-180",
  right: "правий",
  left: "лівий",
  LetR: "лівий і правий",
  motor: "DC двигун",
  ARDUINO_SERVO_MOVE_INPUT1: "повернути",
  ARDUINO_SERVO_MOVE_DEGREE: "кут [0°-180°]",
  ARDUINO_SERVO_MOVE_TOOLTIP: "можливий поворот від 0 до 180 градусів",
  ARDUINO_SERVO_ROT_CONTINUE_TEXT: "обертати",
  ARDUINO_SERVO_ROT_CONTINUE_TOOLTIP:
    "Обертати серво на вказаному піні зі швидкістю [0-90]",
  // Motors — DC
  mot_tooltip:
    "L293D Motor Shield: керування обома двигунами вперед або поворот, швидкість 0-90",
  mot_stop_tooltip: "L293D Motor Shield: зупинити обидва двигуни",
  moteur: "обертати DC двигун",
  moteurstop: "🛑 стоп",
  moteurdagu_tooltiprs040:
    "L298N: керування DC двигунами, швидкість 0-90",
  moteurdagu_tooltiprs040stop: "L298N: зупинити один з двигунів",
  MOTOR_L298N_INIT: "L298N",
  ADAFRUIT_MOTORSHIELD_MOTOR1: "v1 - DC двигун",
  ADAFRUIT_MOTORSHIELD_MOTOR_DIRECTION: "напрям",
  // Motors — Stepper
  STEEPER_name: "Кроковий",
  STEEPER2_name: "кроковий #",
  STEEPER_steprev: "кроків/об.",
  STEEPER_step: "кроків",
  STEEPER_speed: "швидкість (об/хв)",
  STEEPER_pin1: "Пін A",
  STEEPER_pin2: "B",
  STEEPER_pin3: "C",
  STEEPER_pin4: "D",
  m_pap: "кроковий двигун",
  m_pap_step: "крок",
  m_pap_step1: "рух вперед",
  m_pap_tooltip:
    "Ініціалізація крокового двигуна: кроки, об/хв та номери пінів",
  m_pap_step_tooltip:
    "Перемістити кроковий двигун на вказану кількість кроків",
  // Motors — MRT
  MOTOR_Connector: "двигун",
  MOTOR_MRTX_Connector: "MRTX-Uno двигун",
  MOTOR_Direction: "напрям",
  MOTOR_speed: "швидкість(0-255)",
  MOTOR_Stop: "стоп",
  DRV8833_INIT_LABEL: "Ініціалізація DRV8833",
  DRV8833_INIT_TOOLTIP:
    "Налаштування DRV8833: 4 PWM входи (за замовч. D5, D6, D9, D10)",

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

  // Logic blocks - NEGATE / NULL / WHILE
  LOGIC_NEGATE_TITLE: "не %1",
  LOGIC_NEGATE_TOOLTIP: "Повертає істину, якщо вхід хибний. Повертає хибу, якщо вхід істинний.",
  LOGIC_NULL: "null",
  LOGIC_NULL_TOOLTIP: "Повертає значення null.",
  CONTROLS_WHILEUNTIL_OPERATOR_WHILE: "поки",
  CONTROLS_WHILEUNTIL_OPERATOR_UNTIL: "доки",
  CONTROLS_WHILEUNTIL_TOOLTIP_WHILE: "Повторювати, поки умова істинна.",
  CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL: "Повторювати, доки умова не стане істинною.",

  // Time blocks
  _AT: "на",
  PIN: "PIN",
  ARDUINO_BASE_DELAY: "⏲ чекати",
  ARDUINO_BASE_DELAY_TOOLTIP:
    "Вказати час очікування в секундах, мілісекундах або мікросекундах. Програма нічого не робить протягом цього часу.",
  MILLIS1: "тривалість у",
  MILLIS2: "від початку",
  MILLIS_START: "почати хронометраж у",
  MILLIS_START_TOOLTIP: "Зафіксувати поточний час як точку відліку.",
  ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP:
    "Повертає тривалість у мілісекундах, секундах або мікросекундах від запуску програми.",
  ARDUINO_PULSEIN: "тривалість стану",
  ARDUINO_INOUT_PULSEIN:
    "Повертає тривалість імпульсу HIGH або LOW на піні в мікросекундах.",
  TEMPO1: "кожні",
  TEMPO_TOOLTIP:
    "Виконати блоки всередині, коли минув інтервал. На відміну від «чекати», цей блок не блокує програму.",
  TEMPO_HELPURL: "https://www.arduino.cc/en/tutorial/blink",

  // Ports (I/O) blocks
  ARDUINO_INOUT_DIGITAL_WRITE_INPUT1: "цифровий запис PIN",
  ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP:
    "Записати логічний стан 0 або 1 на вказаний вихід.",
  ARDUINO_INOUT_DIGITAL_READ_INPUT: "цифровий стан PIN",
  IN_PULLUP: "pull-up",
  IN_PULLUP_TOOLTIP:
    "Повертає логічний стан (0 або 1) піна. За замовчуванням повертає 1, якщо увімкнено pull-up.",
  ARDUINO_INOUT_ANALOG_WRITE_INPUT1: "аналоговий запис PIN",
  ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP:
    "Надіслати PWM-значення від 0 до 255 на вказаний вихід.",
  ARDUINO_INOUT_ANALOG_READ_INPUT: "аналогове читання PIN",
  ARDUINO_INOUT_ANALOG_READ_TOOLTIP: "Повертає значення від 0 до 1023.",
  TOGGLE: "перемкнути стан PIN",
  TOGGLE_TOOLTIP:
    "Перемкнути: записати 0, якщо раніше був 1 (і навпаки) на вказаний вихід.",
  LKL_ATTACHINTERRUPT_PIN: "переривання: коли",
  LKL_DETACHINTERRUPT_PIN: "вимкнути переривання на PIN",
  LKL_MODE: "виявлено на PIN",
  LKL_TOOLTIP_INOUT_ATTACHINTERRUPT:
    "Вказати дію при зовнішньому перериванні на піні.",
  LKL_TOOLTIP_INOUT_DETACHINTERRUPT:
    "Вимкнути раніше вказане зовнішнє переривання.",
  MRTDUINO_PIN_TOOLTIP:
    "Конвертація порту MRTduino в номер піна Arduino.",

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
  NEW_VARIABLE: "Створити змінну",
  NEW_VARIABLE_TITLE: "Нова змінна:",
  RENAME_VARIABLE: "Перейменувати змінну %1",
  RENAME_VARIABLE_TITLE: "Нова назва для %1:",
  DELETE_VARIABLE: "Видалити змінну %1",
  DELETE_VARIABLE_CONFIRMATION:
    "Видалити %1 використань змінної «%2»?",
  VARIABLE_ALREADY_EXISTS: "Змінна «%1» уже існує.",
  VARIABLE_NAME_EMPTY: "Ім'я змінної не може бути порожнім.",
  VARIABLE_NAME_INVALID:
    "Допустимі лише літери, цифри та _. Починатися має з літери або _.",
  VARIABLE_NAME_RESERVED: "Це зарезервоване слово Arduino.",
  VARIABLE_PROMPT_OK: "Готово",
  VARIABLE_PROMPT_CANCEL: "Скасувати",
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
  VARIABLES_TYPE: "тип",
  VARIABLES_SET_INIT_TOOLTIP: "Оголосити і ініціалізувати змінну з типом та значенням.",
  VARIABLE_TYPE_CHARACTER: "символ",
  VARIABLE_TYPE_TEXT: "текст",
  VARIABLE_TYPE_BOOL: "логічний",
  VARIABLE_TYPE_BYTE: "байт",
  VARIABLE_TYPE_INTEGER: "ціле",
  VARIABLE_TYPE_UNUMBER: "ціле без знаку",
  VARIABLE_TYPE_LARGE_NUMBER: "довге ціле",
  VARIABLE_TYPE_DECIMAL: "дробове",

  // Variables blocks - CONST
  ARDUINO_VAR_CONST: "оголосити константу",
  ARDUINO_VAR_CONST_TOOLTIP:
    "Оголошує константу з указаним типом та значенням.",
  VARIABLES_AS: "як",
  VARIABLES_AT: "у",
  BASE_DEF_CONST: "встановити константу",
  BASE_DEFINE_CONST: "що дорівнює",
  BASE_DEFINE_CONST_TOOLTIP:
    "Дозволяє програмісту дати ім'я будь-якому значенню.",

  // Text blocks
  TEXT_TRIM: "обрізати",
  TEXT_INDEXOF_INPUT_INTEXT: "у тексті",
  TEXT_INDEXOF_OPERATOR_FIRST: "знайти перше входження тексту",
  TEXT_INDEXOF_OPERATOR_LAST: "знайти останнє входження тексту",
  TEXT_INDEXOF_TOOLTIP:
    "Повертає індекс першого/останнього входження першого тексту в другому. Повертає %1, якщо текст не знайдено.",

  // Arrays blocks
  ARRAY_CREATE_EMPTY_TITLE: "порожній!",
  ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD: "список або масив",
  ARRAY_CREATE_WITH_CONTAINER_TOOLTIP: "Додати, видалити або змінити порядок.",
  ARRAY_CREATE_WITH_INPUT_WITH: "елементи",
  ARRAY_CREATE_WITH_ITEM_TITLE: "елемент",
  ARRAY_CREATE_WITH_TOOLTIP: "Повертає список з певною кількістю елементів.",
  ARRAY_GETINDEX_ITEM: "елемент масиву",
  ARRAY_GETINDEX_TOOLTIP1: "Повертає значення, збережене в списку.",
  ARRAY_GETINDEX_TOOLTIP2: "Створити масив обраного типу.",
  ARRAY_GETINDEX_TOOLTIP3:
    "Встановити елемент списку або масиву на вказане значення.",
  ARRAY_create: "створити масив",
  ARRAY_fixe: "встановити елемент масиву",
  ARRAY_dim: "розмір",
  ARRAY_index: "індекс",
  ARRAY_taille: "розмір",
  ARRAY_contenu: "який містить",
  size: "розмір масиву",
  size_TOOLTIP: "Повертає розмір списку або масиву.",

  // List blocks (MicroPython)
  LISTS_CREATE1: "створити список",
  LISTS_CREATE2: "з",
  LISTS_CREATE_TOOLTIP: "Створити список з потрібною кількістю елементів.",
  LISTS_append: "додати %1 в кінець %2",
  LISTS_append_TOOLTIP: "Додати елемент в кінець списку.",
  LISTS_CREATE_WITH_ITEM_TOOLTIP: "Додати елемент.",
  LISTS_GET: "елемент",
  LISTS_of: "з",
  LISTS_SET_INDEX_SET: "встановити елемент",

  // Storage (EEPROM)
  EEPROM_READ_ADDRESS: "адреса змінної для читання",
  EEPROM_READ_TOOLTIP:
    "Повертає дані за вказаною адресою (8 біт).\nATmega328p & ATmega32u4 → 1024 байти\nATmega2560 → 4096 байт",
  EEPROM_WRITE_VALUE: "записати змінну",
  EEPROM_WRITE_ADDRESS: "адреса",
  EEPROM_WRITE_TOOLTIP:
    "Записує дані (8 біт) в EEPROM за вказаною адресою.\nATmega328p & ATmega32u4 → 1024 байти\nATmega2560 → 4096 байт",

  // Communication — init block labels
  COMM_SERIAL_INIT: "⚙️ Ініціалізувати USB Serial",
  COMM_SOFT_SERIAL_INIT: "⚙️ Ініціалізувати програмний Serial",
  COMM_BLUETOOTH_INIT: "⚙️ Ініціалізувати модуль Bluetooth",
  COMM_IR_RECEIVER_INIT: "⚙️ Ініціалізувати ІЧ-приймач",
  COMM_MRT_REMOTE_INIT: "⚙️ Ініціалізувати ІЧ-пульт MRT",

  // Communication — USB Serial
  SERIAL_Init: "USB serial",
  SERIAL_BAUD: "швидкість",
  SERIAL_Avai: "serial доступний?",
  SERIAL_Read: "serial read byte",
  SERIAL_ReadString: "serial read string",
  SERIAL_ReadNum: "serial read as number",
  SERIAL_Readlf: "до кінця рядка",
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
  SSERIAL_Readlf: "до кінця рядка",
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
  SSERIAL_BT_Readlf: "до кінця рядка",
  SSerial_BT_Print_Format: "serial BT print format",
  SSERIAL_BT_Print: "serial BT print on same line",
  SSERIAL_BT_Println: "serial BT print on new line",
  SSERIAL_BT_Write: "serial BT write",

  // Communication — Remote IR
  GENERAL_IR_SETUP: "ініціалізувати ІЧ пульт",
  GENERAL_IR_SETUP_TOOLTIP:
    "Ініціалізує ІЧ-приймач на обраному піні. Розмістіть один раз у Setup.",
  GENERAL_IR_READ: "натиснута клавіша ІЧ",
  GENERAL_IR_READ_TOOLTIP:
    "Повертає код натиснутої клавіши пульта. Використовуйте з блоком ir_remote_key у логіці.",
  GENERAL_IR: "ІЧ пульт",
  GENERAL_PRESSED: "прочитати клавішу",
  PIN2: "PIN переривання",
  KEY: "клавіша",
  MRT_IR: "ініціалізувати пульт MRT",
  MRT_IR_SETUP_TOOLTIP:
    "Ініціалізує пульт MRT на піні переривання та каналі. Розмістіть один раз у Setup.",
  MRT_CHANNEL: "канал",
  MRT_KEY: "клавіша MRT",
  MRT_PRESSED: "натиснуто?",

  // Sensing — Distance
  ULTRASONIC_INIT_LABEL: "Ініціалізація HC-SR04",
  ULTRASONIC_INIT_TOOLTIP:
    "Ультразвуковий датчик HC-SR04 (3–400 см). Вкажіть піни TRIG та ECHO.",
  ULTRASONIC_DISTANCE_TOOLTIP:
    "Повертає відстань у см від HC-SR04 (потрібен блок ініціалізації).",
  ultrasonic_ranger: "ультразвук",
  ultrason_tooltip:
    "HC-SR04: ультразвуковий датчик відстані (3–400 см). Підключіть TRIG та ECHO.",
  ultrason_distance1: "відстань",
  ultrason_distance2:
    "HC-SR04: повертає відстань у см, виміряну ультразвуковим датчиком",
  TRIG: "TRIG",
  Echo: "ECHO",
  VL53L0X: "лазер I²C",
  VL53L0X_INIT_LABEL: "Ініціалізація VL53L0X",
  VL53L0X_tooltip:
    "Ініціалізація VL53L0X. I²C: SDA A4, SCL A5 на Uno.",
  VL53L0X_distance: "відстань (мм)",
  VL53L0X_DISTANCE_TOOLTIP:
    "Повертає відстань, виміряну VL53L0X, у міліметрах.",

  // Sensing — Sound
  SOUND_NAME: "мікрофон",
  SOUND_DETECTED: "виявлено",
  SOUND_AMP_NAME: "підсилювач мікрофона",
  SOUND_WINDOWS: "вікно вибірки",

  // Sensing — Temperature
  VAR_TemSens: "температура NTC (ºC)",
  VAR_LM35: "температура LM35 (ºC)",
  DHT_INIT_LABEL: "Ініціалізація DHT",
  DHT_Type11: "DHT11",
  DHT_Type21: "DHT21",
  DHT_Type22: "DHT22",
  DHT_Temp: "🌡️ температура ºC",
  DHT_Humi: "💧 вологість %",
  DHT_Head: "☀️ індекс тепла ºC",
  DHT_MEASURE_TOOLTIP:
    "Зчитати температуру, вологість або індекс тепла з ініціалізованого DHT.",
  dht22_tooltip:
    "DHT датчик температури/вологості. Зчитування займає ~250 мс.",
  FLAME_NAME: "полум'я",
  FLAME_DETECTED: "виявлено",

  // Sensing — Light
  LDR_NAME: "фоторезистор",
  LDR_DETECTED: "виявлено",
  ALIGHT_NAME: "освітленість",
  IR_NAME: "інфрачервоний",
  IR_DETECTED: "виявлено",
  PIR_NAME: "PIR рух",
  PIR_DETECTED: "виявлено",
  PHOTO_NAME: "фото-переривання",
  PHOTO_DETECTED: "виявлено",

  // Sensing — Gesture (APDS9960)
  APDS9960_INIT_LABEL: "Ініціалізація APDS9960 (жести + колір I²C)",
  APDS9960_INIT_TOOLTIP:
    "Ініціалізація датчика жестів і кольору APDS9960 (I2C).",
  APDS9960_init_tooltip:
    "Ініціалізація APDS9960 для жестів і визначення кольору.",
  APDS9960_name_gesture: "жест",
  APDS9960_name_color: "колір",
  APDS9960_detection: "виявлення",
  APDS9960_gesture_gain: "підсилення жестів",
  APDS9960_gesture_detected: "виявлено",
  APDS9960_readgesture: "зчитати",
  APDS9960_readcolors: "зчитати частоти кольору",
  APDS9960_colors: "частота",
  APDS9960_GAIN_X1: "Підсилення x1",
  APDS9960_GAIN_X2: "Підсилення x2",
  APDS9960_GAIN_X4: "Підсилення x4",
  APDS9960_GAIN_X8: "Підсилення x8",
  APDS9960_DIR_UP: "Вгору",
  APDS9960_DIR_DOWN: "Вниз",
  APDS9960_DIR_LEFT: "Ліворуч",
  APDS9960_DIR_RIGHT: "Праворуч",
  APDS9960_COLOR_RED: "Червоний",
  APDS9960_COLOR_GREEN: "Зелений",
  APDS9960_COLOR_BLUE: "Синій",
  APDS9960_COLOR_CLEAR: "Clear",
  ENABLE: "Увімкнути",
  DISABLE: "Вимкнути",

  // Sensing — Color (TCS34725 + APDS9960)
  TCS34725_INIT_LABEL: "Ініціалізація TCS34725 (колір I²C)",
  TCS34725_name: "датчик кольору",
  TCS34725_read: "зчитати всі значення",
  TCS34725_values: "значення",
  TCS34725_color: "це",
  TCS34725_color2: "колір?",
  TCS34725_GAIN_1X: "Без підсилення",
  TCS34725_GAIN_4X: "Підсилення 4x",
  TCS34725_GAIN_16X: "Підсилення 16x",
  TCS34725_RED_RGB: "Червоний (RGB)",
  TCS34725_GREEN_RGB: "Зелений (RGB)",
  TCS34725_BLUE_RGB: "Синій (RGB)",
  TCS34725_CLARITY: "Яскравість",
  TCS34725_HUE: "Відтінок (HSV)",
  TCS34725_SAT: "Насиченість (HSV)",
  TCS34725_VAL: "Значення (HSV)",
  TCS34725_LUX: "Lux",
  TCS34725_TEMP: "Темп.",
  TCS34725_RED_RAW: "Червоний (raw)",
  TCS34725_GREEN_RAW: "Зелений (raw)",
  TCS34725_BLUE_RAW: "Синій (raw)",
  TCS34725_COLOR_RED: "Червоний",
  TCS34725_COLOR_ORANGE: "Помаранчевий",
  TCS34725_COLOR_YELLOW: "Жовтий",
  TCS34725_COLOR_GREEN: "Зелений",
  TCS34725_COLOR_CYAN: "Блакитний",
  TCS34725_COLOR_BLUE: "Синій",
  TCS34725_COLOR_VIOLET: "Фіолетовий",

  // Sensing — Magnet
  HMC5883_INIT_LABEL: "Ініціалізація HMC5883 (компас I²C)",
  HMC5883_read: "зчитати значення компаса",
  HMC5883_values: "значення",
  HMC5883_X: "магнітний вектор X",
  HMC5883_Y: "магнітний вектор Y",
  HMC5883_Z: "магнітний вектор Z",
  HMC5883_HEADING: "Курс º",
  HALL_NAME: "датчик Холла",
  HALL_DETECTED: "виявлено",

  // Sensing — Vibration
  VIBRATION_NAME: "вібрація",
  VIBRATION_DETECTED: "виявлено",
  TILT_NAME: "нахил",
  TILT_DETECTED: "виявлено",
  KNOCK_NAME: "стук",
  KNOCK_DETECTED: "виявлено",

  // Sensing — Humidity (water / soil / vapor)
  WATER_NAME: "рівень води",
  MOISTURE_NAME: "вологость ґрунту",
  VAPOR_NAME: "пара",

  // Sensing — Gas
  GAS_NAME: "газ CO",
  GAS_DETECTED: "виявлено",
  ALCOHOL_NAME: "алкоголь",
  ALCOHOL_DETECTED: "виявлено",

  // Sensing — Pressure (BME280)
  BME280_INIT_LABEL: "Ініціалізація BME280 (тиск I²C)",
  BME280_INIT_TOOLTIP:
    "Ініціалізація BME280. I2C: SDA A4, SCL A5 на Uno.",
  bme280_tooltip:
    "Ініціалізація BME280. I2C: SDA A4, SCL A5 на Uno.",
  bme280_pressure: "атмосферний тиск (гПа)",
  BME280_PRESSURE_TOOLTIP: "Повертає атмосферний тиск у гПа з BME280.",
  bme280_pressure_tooltip:
    "Повертає атмосферний тиск у гПа з ініціалізованого BME280.",

  // Sensing — RTC (DS3231 + ESP32 internal)
  RTCDS3231_INIT_LABEL: "Ініціалізація DS3231 (RTC I²C)",
  RTCDS3231_RTC: "встановити дату і час",
  RTCDS3231_DAY: "день",
  RTCDS3231_MONTH: "місяць",
  RTCDS3231_YEAR: "рік",
  RTCDS3231_HOUR: "година",
  RTCDS3231_MINUTE: "хвилина",
  RTCDS3231_SECOND: "секунда",
  RTCDS3231_DOFWEEK: "день тижня",
  RTCDS3231_READ_RTC: "зчитати дату і час RTC",
  RTCDS3231_VALUES: "значення",
  RTCDS3231_Name2: "RTC",
  RTCDS3231_TEXT_DOFWEEK: "День тижня",
  RTCDS3231_TEXT_MONTH: "Місяць",
  INTERNALRTC_INIT_LABEL: "Ініціалізація внутрішнього RTC ESP32",
  INTERNALRTC_NAME: "Внутрішній RTC",
  INTERNALRTC_RTC: "Встановити дату і час",
  INTERNALRTC_DAY: "День",
  INTERNALRTC_MONTH: "Місяць",
  INTERNALRTC_YEAR: "Рік",
  INTERNALRTC_HOUR: "Година",
  INTERNALRTC_MINUTE: "Хвилина",
  INTERNALRTC_SECOND: "Секунда",
  INTERNALRTC_DOFWEEK: "День тижня",
  INTERNALRTC_VALUES: "значення",
  INTERNALRTC_GETDATE: "Отримати дату",
  INTERNALRTC_GETTIME: "Отримати час",

  // Sensing — RFID / NFC
  RFID_INIT_LABEL: "Ініціалізація MFRC522 RFID",
  RFID_INIT_CUSTOM_LABEL: "MFRC522 RFID (кастомні SPI-піни)",
  RFID_name: "RFID",
  RFID_init2: "SCK, MOSI & MISO",
  RFID_PIN_SDA: "SDA",
  RFID_PIN_RST: "RST",
  RFID_PIN_SCK: "SCK",
  RFID_PIN_MISO: "MISO",
  RFID_PIN_MOSI: "MOSI",
  RFID_VALID_VAR: "картка для перевірки:",
  RFID_STOP: "зупинити зчитування",
  RFID_C1: "значення1",
  RFID_C2: "значення2",
  RFID_C3: "значення3",
  RFID_C4: "значення4",
  RFID_DETECTED: "картку виявлено?",
  RFID_READED: "картку зчитано?",
  RFID_CARD_READED: "зчитане значення",
  RFID_CHECK_CARD: "зчитана картка = картка для перевірки",
  RFID_CHECK_CARD2: "?",
  NFC_INIT_LABEL: "Ініціалізація PN532 NFC I²C",
  NFC_name: "NFC",
  NFC_VALID_VAR: "картка для перевірки (4 байти):",
  NFC_VALID_VAR2: "картка для перевірки (7 байт):",
  NFC_C1: "значення1",
  NFC_C2: "значення2",
  NFC_C3: "значення3",
  NFC_C4: "значення4",
  NFC_C5: "значення5",
  NFC_C6: "значення6",
  NFC_C7: "значення7",
  NFC_DETECTED: "картку виявлено?",
  NFC_CARD_READED: "зчитане значення",
  NFC_CHECK_CARD: "зчитана картка = картка для перевірки",
  NFC_CHECK_CARD2: "?",

  // Sensing — gyro (MPU6050)
  OTTO9_GETG_TEXT: "зчитати прискорення та кутову швидкість",
  OTTO9_GETG_TEXT2: "значення",
  GYRO_INIT_TOOLTIP:
    "У Setup: Wire.begin + ініціалізація MPU6050. У Loop: оновлення ax–gz для gyro_getg.",
  GYRO_GET_TOOLTIP: "Повертає ax/ay/az або gx/gy/gz після оновлення в loop.",

  // Sensing — GPS
  GPS_name: "🛰️ GPS NEO-6",
  GPS_init: "GPS",
  GPS_TX: "TX",
  GPS_RX: "RX",
  GPS_readvalues: "зчитати та зберегти значення",
  GPS_paramter: "параметри місцезнаходження:",
  GPS_paramter3: "дата і час:",
  GPS_INIT_TOOLTIP: "Ініціалізація NEO-6M GPS через SoftwareSerial (9600 бод).",
  GPS_INIT_ESP32_TOOLTIP: "Ініціалізація GPS на ESP32 Serial2 (9600 бод).",
  GPS_READ_TOOLTIP: "Розбір NMEA та оновлення змінних GPS.",
  GPS_LOCATION_TOOLTIP: "Повертає широту, довготу, висоту тощо.",
  GPS_SPEED_TOOLTIP: "Повертає швидкість (вузли, mph, м/с, км/г).",
  GPS_DATETIME_TOOLTIP: "Повертає поле дати/часу з GPS-фіксації.",

  // Sensing — buttons
  BUTTON_NAME: "кнопка",
  BUTTON_TOUCH_NAME: "сенсор дотику",
  BUTTON_PRESSED: "натиснуто?",
  BUTTON_SENSOR_TOOLTIP:
    "Цифрова кнопка. Позначте чекбокс для інверсної (active-low) логіки.",
  BUTTON_TOUCH_TOOLTIP: "Ємнісний сенсор дотику як цифровий вхід.",
  MRTX_BUTTON: "кнопка Start на MRTNode натиснута?",
  MRTX_BUTTON_TOOLTIP: "Вбудована кнопка Start на платах MRT.",

  // Sensing — knob / rotary encoder
  POTE_NAME: "потенціометр",
  POTENTIOMETER_TOOLTIP: "Значення аналогового потенціометра (повзунок/ручка).",
  RotaryEncoderInit: "енкодер",
  RotaryEncoderNumber: "енкодер",
  RE_PINDT: "DT",
  RE_PINCLK: "CLK",
  RE_READ: "зчитати значення",
  RE_WRITE: "записати значення",
  RE_Button: "кнопка",
  RE_Pressed: "натиснуто?",
  ROTARY_ENCODER_INIT_TOOLTIP:
    "Створити екземпляр Encoder на пінах CLK/DT з підтримкою переривань.",
  ROTARY_ENCODER_WRITE_TOOLTIP: "Встановити лічильник енкодера (значення × 4).",
  ROTARY_ENCODER_READ_TOOLTIP: "Зчитати положення енкодера (кроки ÷ 4).",
  ROTARY_ENCODER_BUTTON_TOOLTIP:
    "Кнопка енкодера з внутрішнім pull-up (active low).",

  // Sensing — joystick
  JOYSTICK_NAME: "вісь джойстика",
  JOYSTICK_BUTTON: "кнопка джойстика",
  JOYSTICK_AXIS_TOOLTIP: "Аналогове значення осі X або Y джойстика.",
  JOYSTICK_BUTTON_TOOLTIP:
    "Кнопка джойстика з INPUT_PULLUP (active LOW).",

  // Sensing — shared
  VALUE: "0-1023",
  PERCENT: "0-100%",

  // LED — digital / basic
  CAT_numerique: "цифровий",
  del: "LED ",
  del_tooltip: "Увімкнути (вимкнути) світлодіод на вказаному піні",
  on_off: "УВІМК/ВИМК",
  menublink: "швидкість блимання",
  blink: "блимання LED на платі",
  blink_tooltip: "Світлодіод на платі блимає один раз з обраною швидкістю",
  ARDUINO_INOUT_BUILDIN_LED_INPUT: "LED на платі",
  ARDUINO_INOUT_BUILDIN_LED_TOOLTIP:
    "Увімкнути або вимкнути світлодіод на платі Arduino",

  // LED — RGB
  rvb_init: "RGB LED",
  rvb_init_tooltip: "Вкажіть PWM-піни для підключення RGB світлодіода",
  rvb_set: "показати колір",
  rvb_anode: "спільний анод",
  rvb_cathode: "спільний катод",
  rvb_set_x: "RGB LED на платі — показати колір",
  rvb_set_tooltip:
    "Показує колір за значеннями червоного, зеленого та синього компонентів",

  // LED — NeoPixel
  pixel1: "NeoPixel",
  pixel2: "показати пікселі",
  pixel3: "колір",
  pixel4: "кількість пікселів",
  pixel5: "яскравість",
  pixel6: "піксель №",
  pixel1_tooltip:
    "Модуль NeoPixel RGB: вкажіть пін даних і кількість пікселів",
  pixel2_tooltip: "Показати зміни в буфері пікселів",
  pixel5_tooltip: "Налаштувати яскравість пікселів (від 0 до 255)",
  pixel3_tooltip:
    "Обрати піксель і його колір (нумерація починається з 0)",

  // LED — matrix / MAX7219
  matrice: "матриця",
  matrice8x8_del_tooltip:
    "Керування LED матриці (координати починаються з 0)",
  matrice8x8_helpurl: "https://xantorohara.github.io/led-matrix-editor/",
  MAX7219_LM_NAME: "LED матриця",
  MAX7219_LM_CS: "CS",
  MAX7219_LM_CLK: "CLK",
  MAX7219_LM_DAT: "DIN",
  MAX7219_LM_Number: "№",
  MAX7219_LM_Brightness: "яскравість",
  MAX7219_LM_SHUTDOWN: "активувати",
  MAX7219_LM_CLEAR: "очистити",
  MAX7219_LM_PAINT: "малювати",
  MAX7219_LM_Row: "рядок",
  MAX7219_LM_value: "значення (bin, hex або dec)",
  MAX7219_LM_Column: "стовпець",
  MAX7219_LM_Led: "LED",
  OTTO9_MOVE_SPEED_TEXT: "швидкість",

  // Displays — OLED
  OTTO_HOME_TEXT: "⚙️",
  OLED_height: "висота",
  OLED_width: "ширина",
  OLED_IconName: "дизайн іконки",
  OLED_ValueList: "значення (hex масив)",
  OLED_DrawiconName: "намалювати",
  OLED_X0: "X0",
  OLED_Y0: "Y0",
  OLED_COLOR: "колір",
  LCD_SHIELD_PRINT_TEXT: "показати",
  LCD_raz_tooltip: "очистити екран 🧹",
  LCDP_Print: "друкувати",

  // Displays — LCD I2C
  LCD_I2C_setup: "адреса LCD I²C",
  LCDP_Column: "стовпці",
  LCDP_Row: "рядки",
  LCDP_Column2: "стовпець",
  LCDP_Row2: "рядок",
  LCDP_Clear: "LCD I²C очистити",
  LCDP_scrollDisplay: "LCD I²C прокрутка ",
  LCDP_setBcklight: "LCD I²C підсвітка ",
  LCDP_showCursor: "LCD I²C курсор ",
  LCDP_blinkCursor: "LCD I²C мигання курсора ",
  LCDP_Home: "LCD I²C додому",
  LCDP_SetCursor: "LCD I²C позиція курсора",
  LCDP_Display: "LCD I²C ",

  // Displays — ST7735 TFT
  ST7735_name: "TFT",
  ST7735_init: "TFT ST7735",
  ST7735_init2: "SCL=SCK SDA=MOSI.",
  ST7735_PIN_CS: "CS",
  ST7735_PIN_RST: "RST/RES",
  ST7735_PIN_DC: "A0/DC",
  ST7735_WRAP: "колір",
  ST7735_FILLBACKGROUND: "залити фон",
  ST7735_Rotate: "повернути",
  ST7735_Invert: "інвертувати",
  ST7735_SetCursor: "курсор",
  ST7735_X0: "X0",
  ST7735_Y0: "Y0",
  ST7735_X1: "X1",
  ST7735_Y1: "Y1",
  ST7735_X2: "X2",
  ST7735_Y2: "Y2",
  ST7735_TEXTCOLOR: "колір тексту",
  ST7735_TEXTCOLOR2: "колір",
  ST7735_TEXTsize: "розмір тексту",
  ST7735_TEXTwrap: "перенос тексту",
  ST7735_PrintTextLN: "друкувати текст/значення",
  ST7735_PrintTextLN2: "новий рядок",
  ST7735_DrawPixel: "піксель",
  ST7735_Drawlinefrom: "лінія від",
  ST7735_Drawlineto: "до",
  ST7735_Drawrectangle: "прямокутник",
  ST7735_Drawtriangle: "трикутник. Кути",
  ST7735_Drawroundrectangle: "округлений прямокутник",
  ST7735_Drawroundrectangleradius: "радіус",
  ST7735_Drawrectanglewidth: "ширина",
  ST7735_Drawrectangleheight: "висота",
  ST7735_Drawcircle: "коло. Центр",
  ST7735_Drawcircleradius: "радіус",
  ST7735_Drawfill: "заливка",
  ST7735_properties: "властивість:",
  ST7735_IconName: "іконка",
  ST7735_ValueList: "hex масив",
  ST7735_DrawiconName: "намалювати іконку",

  // Displays — TM1637
  TM1637_name: "TM1637 7-сегментний дисплей.",
  TM1637_init: "TM1637 7-сегментний дисплей",
  TM1637_PinCLK: "CLK",
  TM1637_PinDIO: "DIO",
  M1637_Brightness: "яскравість (0-7)",
  M1637_turnOFF_ON: "увімкнути",
  M1637_Clear: "очистити",
  M1637_number: "число",
  M1637_Digit: "позиція (0-3)",
  M1637_Length: "кількість цифр",
  M1637_fill: "ведучі нулі",
  M1637_digitsegment: "сегмент масиву (0-3)",
  M1637_value: "значення",
  M1637_arraysegment: "показати масив сегментів.",
  M1637_points: "крапки",

  // Audio — buzzer / tone
  play: "грати",
  play_tooltip: "відтворити ноту",
  play_helpurl: "",
  beep: "🦗 сигнал на",
  beep_TOOLTIP: "короткий сигнал (440 Гц, 1 с) на обраному піні",
  ARDUINO_TONE_INPUT1: "🎼 зуммер",
  ARDUINO_TONE_INPUT1_X: "🎼 внутрішній зуммер",
  ARDUINO_TONE_INPUT2: "🎼 частота (Гц)",
  ARDUINO_TONE_INPUT3: "⏰ тривалість (мс)",
  ARDUINO_TONE_TOOLTIP:
    "відтворити звук на обраному піні з заданою частотою та тривалістю",
  ARDUINO_NOTONE_INPUT: "🛑 зупинити звук на",
  ARDUINO_NOTONE_TOOLTIP: "зупинити звук на обраному піні",
  ARDUINO_RTTTL_BLOCK: "відтворити мелодію",
  OTTO9_BUZZER: "зуммер",

  // Audio — DFPlayer Mini
  lp2i_mp3_helpurl: "https://wiki.dfrobot.com/DFPlayer_Mini_SKU_DFR0299",
  lp2i_mp3_Volume: "гучність [0-30]",
  lp2i_mp3_autoplay: "автовідтворення",
  lp2i_mp3: "MP3-плеєр",
  lp2i_mp3_tooltip: "DFPlayer Mini: ініціалізація, гучність і режим роботи",
  lp2i_mp3_play: "▶️ відтворити MP3",
  lp2i_mp3_play_track_tooltip: "▶️ відтворити трек № 0-2999",
  lp2i_mp3_play_tooltip: "▶️ відтворити поточний трек",
  lp2i_mp3_pause: "⏸️ пауза MP3",
  lp2i_mp3_pause_tooltip: "призупинити поточний трек",
  lp2i_mp3_prev: "⏮️ попередній MP3",
  lp2i_mp3_prev_tooltip: "⏮️ попередній трек",
  lp2i_mp3_vol: "🎚️ встановити гучність",
  lp2i_mp3_vol_tooltip: "🎚️ гучність [0-31]",
  lp2i_mp3_next: "⏭️ наступний MP3",
  lp2i_mp3_next_tooltip: "⏭️ наступний трек",

  // Audio — OpenSmart MP3
  MP3OS_name: "MP3 OpenSmart",
  MP3OS_TX: "TX",
  MP3OS_RX: "RX",
  MP3OS_volumen: "гучність (0-30)",
  MP3OS_operation: "операція:",
  MP3OS_playsong: "трек №",
  MP3OS_playsongdirectory: "папка №",
  MP3OS_inject: "вставити трек №",

  // Audio — Radio TEA5767
  TEA5767_name: "радіо TEA5767",
  TEA5767_init: "радіо TEA5767 I²C",
  TEA5767_turnOFF_ON: "увімкнути",
  TEA5767_muteOFF_ON: "без звуку",
  TEA5767_Level: "рівень сигналу",
  TEA5767_Stereo: "стерео?",
  TEA5767_RadioStation: "радіостанція.",
  TEA5767_SetFrequency: "частота (МГц)",
  TEA5767_MadridFrequency: "радіостанції Мадрида:",

  // IoT — WiFi / ESP
  WIFI_sta_init: "WIFI. Підключитися як станція",
  WIFI_ap_init: "WIFI. Створити точку доступу",
  WIFI_sta_ap_init: "WIFI. Станція і точка доступу",
  WIFI_password: "пароль:",
  WIFI_ssid: "Wifi ssid:",
  WIFI_password_ap: "і пароль:",
  WIFI_ssid_ap: "Ім'я Wifi ssid:",
  WIFI_logs: "Увімкнути логи",
  Wifi_ap_fixip: "Режим AP. Статична IP",
  Wifi_sta_fixip: "Режим станції. Статична IP",
  Wifi_ip: "IP",
  Wifi_Mask: "Маска",
  Wifi_Gateway: "Шлюз",
  ESP_yield: " Функція Yield",
  ESP_deepsleep: "DeepSleep ",
  ESP_timesleep: "Секунди",
  ESP_restart: "Перезапуск ESP8266/ESP32",

  // IoT — MQTT
  MQTT_name: "MQTT",
  MQTT_name_init: "Налаштування протоколу MQTT",
  MQTT_password: "пароль:",
  MQTT_ssid: "Wifi ssid:",
  MQTT_server: "Сервер (broker):",
  MQTT_port: "порт:",
  MQTT_user: "Користувач:",
  MQTT_APIkey: "API Key:",
  MQTT_client: "ID клієнта:",
  MQTT_topicattend: "Loop MQTT",
  MQTT_topicsubscribe: "Підписатися на topic",
  MQTT_topicsubscribe2: "і зберегти числове значення у змінну",
  MQTT_topicsubscribe3: "і зберегти текстове значення у змінну",
  MQTT_topicpublish: "Опублікувати в topic",
  MQTT_topicvalue: "Значення",
  MQTT_logs: "Увімкнути логи",

  // IoT — IFTTT
  IFTTT_init: "Налаштування. Api key",
  IFTTT_send: "Надіслати інформацію",
  IFTTT_event: "Подія як String",
  IFTTT_value1: "Значення 1 як String",
  IFTTT_value2: "Значення 2 як String",
  IFTTT_value3: "Значення 3 як String",

  // IoT — NTP
  NTP_NAME: "Ініціалізація NTP сервера.",
  NTP_NAME2: "NTP сервер.",
  NTP_READ_RTC: "NTP сервер. Читати дату і час",
  NTP_GMT: "GMT",
  NTP_VALUES: "значення",
  NTP_EPOCH: "Epoch",
  NTP_DAY: "День",
  NTP_MONTH: "Місяць",
  NTP_YEAR: "Рік",
  NTP_HOUR: "Година",
  NTP_MINUTE: "Хвилина",
  NTP_SECOND: "Секунда",
  NTP_DOFWEEK: "День тижня",
  NTP_TEXT_DOFWEEK: "День тижня (рядок)",
  NTP_TEXT_MONTH: "Місяць (рядок)",
  NTP_TEXT_TIME: "Час (рядок)",

  // IoT — OpenWeather
  Openweather_init: "Налаштування OpenWeather.",
  Api_key: "Api Key",
  ReadWeather: "OpenWeather. Читати погоду.",
  City: "Місто",
  CountryCode: "Код країни",
  OW_Value: "OpenWeather. Значення:",
  LocationOW: "Локація",
  Country: "Країна",
  Icon: "Іконка",
  Weather: "Погода",
  Description: "Опис",
  OW_Temperature: "Температура ºC",
  Temp_max: "Макс. температура ºC",
  Temp_min: "Мін. температура ºC",
  Humidity: "Вологість",
  Preassure: "Тиск",
  Feels_like: "Відчутна температура ºC",
  Cloud: "Хмарність %",
  Visibility: "Видимість %",
  wind_speed: "Швидкість вітру",
  wind_angle: "Кут вітру",
  icon_id: "Id іконки погоди",
  sunrise: "Схід EPOC",
  sunset: "Захід EPOC",

  // IoT — Thingspeak
  Thingspeak_name_init: "Налаштування Thingspeak.",
  Thingspeak_name: "Thingspeak.",
  Thingspeak_channel: "Канал",
  Thingspeak_apiread: "Api read key",
  Thingspeak_apiwrite: "Api write key",
  Thingspeak_Write: "Записати значення",
  Thingspeak_field: "у поле",
  Thingspeak_ReadLong: "Читати long з поля",
  Thingspeak_ReadFloat: "Читати float з поля",

  // IoT — Firebase
  Firebase_name_init: "Налаштування Firebase.",
  firebase_name: "Firebase.",
  Firebase_url: "URL",
  Firebase_api: "Api key",
  Firebase_start: " Ініціалізація в Setup",
  Firebase_type: " Зберегти ",
  Firebase_read: " Читати ",
  Firebase_Node: "у вузлі",
  Firebase_Value: "значення",
  Firebase_String_Node: "Зберегти текст у вузлі",
  Firebase_Read_String_Node: "Читати текст у вузлі",
  firebase_delete: "Видалити вузол",

  // IoT — Telegram
  Telegram_name_init: "Налаштування Telegram чату.",
  Telegram_name: "Telegram.",
  Telegram_BotToken: "BOT token",
  Telegram_ChatID: "Chat ID",
  Telegram_Loop: "Telegram Loop. Оновити повідомлення",
  Telegram_receive: "Telegram. Коли отримано повідомлення",
  TelegramSend: "Надіслати повідомлення:",
  Telegram_message: "Telegram. Отримане повідомлення",
  Telegram_fromName: "Ім'я відправника",

  // IoT — WiFi server
  WifiServer_wait: "Очікувати підключення клієнтів",
  WifiServer_port: "WiFi сервер на порту",
  WifiServer_ESP8266webserver_port: "AsyncWebServer на порту",
  WifiServer_answer: "Відповідь WiFi сервера:",
  WifiServer_stop: "Зупинити підключеного клієнта",
  WifiServer_flush: "Flush підключеного клієнта",
  WifiServer_ip: "IP підключеного клієнта",
  WifiServer_request: "Запит підключеного клієнта",
  WifiServer_ESP8266webserver_parameter: "AsyncWebServer. Параметр: ",
  WifiServer_ESP8266webserver_parameter2: "AsyncWebServer. Параметр: ",
  WifiServer_esp8266_send_html_URL:
    "Коли клієнт з URL (порожньо для root):",
  WifiServer_esp8266_send_html_HTML_page: "підключився, показати HTML: ",
  WifiServer_esp8266_send_html_execute: "(опційно) і виконати: ",
  WifiServer_esp8266_manage_requets: "Обробити запит клієнта",
  WifiServer_esp8266_send_text: "підключився, показати текст: ",
  WifiServer_ESP8266webserver_OTA: "OTA увімкнено",
  esp8266_send_html_title: "PageName",
  esp8266_html_webpage: "Назва HTML сторінки:",
  esp8266_html_tooltip: "Зібрати HTML сторінку",
  esp8266_send_html_tooltip: "Зареєструвати маршрут HTML",

  // IoT — ESP-NOW
  ESPNOW_init: "Ініціалізація протоколу. Вузол",
  ESPNOW_msg_received: "Коли отримано повідомлення",
  ESPNOW_send_all: "Надіслати повідомлення всім вузлам.",
  ESPNOW_send_mac: "Надіслати повідомлення на MAC: ",
  ESPNOW_fill_int: "Заповнити Int параметр структури:",
  ESPNOW_fill_float: "Заповнити Float параметр структури:",
  ESPNOW_fill_text: "Заповнити Text параметр структури:",
  ESPNOW_read_node: "Id отриманого вузла",
  ESPNOW_read_param_int: "Отриманий Int параметр",
  ESPNOW_read_param_float: "Отриманий Float параметр",
  ESPNOW_read_param_text: "Отриманий Text параметр",

  // IoT — Alexa
  Alexa_init: "Alexa. Номер пристрою:",
  Alexa_init2: "Ім'я:",
  Alexa_cb: "Коли отримано повідомлення Alexa від пристрою:",
  Alexa_Loop: "Керувати підключенням Alexa. Loop",
  Alexa_Param: "Отримати параметр",

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


