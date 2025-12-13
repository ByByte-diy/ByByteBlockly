# 🧪 Інструкції для тестування

## Запуск додатку

```bash
# Збудувати і запустити Electron
npm run start:electron
```

## Що має працювати

### ✅ 1. UI Елементи
- Заголовок "ByByte Blockly"
- Селектор вибору плати (Arduino Uno, Nano, Mega, ESP32, ESP8266)
- Селектор портів з кнопкою оновлення 🔄
- Кнопки "Завантажити" та "Компілювати"
- Індикатор статусу

### ✅ 2. Blockly Редактор
- Toolbox з категоріями блоків (зліва)
- Workspace для додавання блоків
- Drag & Drop блоків
- Zoom controls (+ / -)
- Кошик (Trashcan)

### ✅ 3. Блоки Arduino
Мають завантажитись категорії:
- **Arduino** (base_setup_loop, digital_write, digital_read)
- **Logic** (if, compare, boolean)
- **Loops** (repeat, while)
- **Math** (numbers, arithmetic)
- **Otto** (якщо є в toolbox)
- **Sensors**, **Motors**, **LEDs** (залежно від плати)

### ✅ 4. Функціональність

#### Вибір плати
1. Клацніть на селектор "Плата"
2. Оберіть плату (наприклад Arduino Uno)
3. Toolbox має оновитись відповідно до плати

#### Сканування портів
1. Клацніть кнопку 🔄 поруч з селектором портів
2. Список портів має оновитись
3. Якщо є підключений Arduino - порт з'явиться в списку

#### Створення коду
1. Перетягніть блок `base_setup_loop` в workspace
2. Додайте інші блоки всередину setup або loop
3. Код має генеруватись автоматично (подивіться в консоль DevTools)

#### Компіляція
1. Створіть програму з блоків
2. Оберіть плату та порт
3. Натисніть "Компілювати"
4. Статус має показати процес компіляції

## Перевірка в DevTools Console

Відкрийте DevTools (F12) і перевірте:

### ✅ Успішні повідомлення
```
Loading Blockly blocks and generators...
Blockly blocks and generators loaded successfully
Arduino generator available: function
```

### ❌ НЕ має бути помилок
- ❌ `goog is not defined`
- ❌ `Cannot set properties of undefined`
- ❌ `Toolbox should be an <xml> document`
- ❌ `workspaceToCode is not a function`

### ⚠️ Допустимі попередження
- ⚠️ Electron Security Warning (Content-Security-Policy) - нормально для dev режиму
- ⚠️ VAAPI / OpenGL warnings - графічні драйвери, не критично

## Відома поведінка

### Arduino код генерація
- Код генерується автоматично при змінах в workspace
- Перша генерація може бути порожньою (генератор ще завантажується)
- Після 2 секунд код має генеруватись коректно

### Компіляція
Для роботи компіляції потрібно:
1. ✅ arduino-cli встановлений в `compilation/arduino/`
2. ✅ Cores встановлені (arduino:avr, esp32:esp32, etc.)
3. ✅ Обрана плата та порт

Якщо arduino-cli не встановлений:
```bash
cd compilation/arduino
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
mv bin/arduino-cli ./
```

## Troubleshooting

### Білий екран
- Переконайтесь що `baseHref: "./"` в angular.json
- Перебудуйте: `npm run build:electron:dev`

### Порти не відображаються
- В Web версії: потрібен Chrome/Edge з Web Serial API
- В Electron: має працювати автоматично через serialport

### Блоки не завантажуються
- Перевірте що файли існують в `www/blocs&generateurs/`
- Подивіться в консоль DevTools на помилки завантаження

### Компіляція не працює
- Перевірте що arduino-cli встановлений
- Запустіть `./compilation/arduino/arduino-cli version`
- Встановіть cores: `arduino-cli core install arduino:avr`

## Звіт про баги

Якщо знайдете проблему, створіть issue з:
1. Кроками для відтворення
2. Скріншотом консолі DevTools
3. Версією OS та Node.js
4. Чи Web чи Electron версія

