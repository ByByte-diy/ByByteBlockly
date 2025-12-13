# Logic & Math Blocks

## ✅ Створено категорії Logic та Math

Додано дві нові категорії з блоками для Arduino програмування.

---

## 📁 Структура

```
src/app/modules/blockly/definitions/
├── generic/              # Generic blocks (код, коментар, тощо)
├── logic/
│   └── index.ts         # Logic category blocks
└── math/
    └── index.ts         # Math category blocks
```

---

## 🎯 Category: Logic

### Standard Blockly Blocks (вбудовані):

1. **if-then** (`controls_if`)
   - Умовний оператор
   - Підтримує if, else if, else

2. **repeat [N] times** (`controls_repeat_ext`)
   - Повторити N разів
   - З динамічною кількістю повторень

3. **repeat while/until** (`controls_whileUntil`)
   - Повторювати доки/поки виконується умова
   - While та Until варіанти

4. **for loop** (`controls_for`)
   - For цикл з лічильником
   - `for (i from 0 to 5 step 1)`

5. **exit loop** (`controls_flow_statements`)
   - Break/Continue для циклів
   - Вийти з циклу або перейти до наступної ітерації

6. **logical AND/OR** (`logic_operation`)
   - Логічні оператори AND і OR
   - `[] and []` або `[] or []`

7. **NOT** (`logic_negate`)
   - Логічне заперечення
   - `not []`

8. **null** (`logic_null`)
   - Null значення

### Custom Arduino Blocks:

1. **switch-case** (`controls_switch`)
   ```arduino
   // switch [i] is [value] then
   if (i == value) {
     // statements
   }
   ```
   - Switch-case statement
   - Можна комбінувати декілька для повного switch

---

## 🔢 Category: Math

### Standard Blockly Blocks (вбудовані):

1. **Number** (`math_number`)
   - Числове значення: `[0]`

2. **Arithmetic** (`math_arithmetic`)
   - Арифметичні операції: `[] + []`, `[] - []`, `[] * []`, `[] / []`, `[] ^ []`

3. **Comparison** (`logic_compare`)
   - Порівняння: `[] = []`, `[] ≠ []`, `[] < []`, `[] > []`, `[] ≤ []`, `[] ≥ []`

4. **Math functions** (`math_single`)
   - Математичні функції: sqrt, abs, -, ln, log10, e^, 10^

5. **Trigonometry** (`math_trig`)
   - Тригонометричні функції: sin, cos, tan, asin, acos, atan

6. **Rounding** (`math_round`)
   - Округлення: round, ceil, floor

7. **Remainder** (`math_modulo`)
   - Залишок від ділення: `remainder of [] / []`

### Custom Arduino Blocks:

1. **Angle** (`math_angle`)
   ```arduino
   90° // Angle value (0-360)
   ```
   - Кут в градусах (0-360°)
   - Зручно для серво моторів

2. **Analog Pin** (`math_analog_pin`)
   ```arduino
   A0 // Analog pin dropdown
   ```
   - Вибір аналогового піна
   - Автоматично підтягує доступні піни з BoardProfile

3. **Map** (`math_map`)
   ```arduino
   // map [value] from [0] - [1023] to [0] - [255]
   map(value, 0, 1023, 0, 255)
   ```
   - Перетворення діапазону значень
   - Корисно для аналогових датчиків

4. **Constrain** (`math_constrain`)
   ```arduino
   // constrain # [value] between [0] & [100]
   constrain(value, 0, 100)
   ```
   - Обмеження значення між мін і макс

5. **Random Integer** (`math_random_int`)
   ```arduino
   // random integer [0] & [99]
   random(0, 99)
   ```
   - Випадкове ціле число

6. **Range Comparison** (`math_range_compare`)
   ```arduino
   // [0] < [x] < [10]
   (0 < x && x < 10)
   ```
   - Порівняння діапазону (a < b < c)
   - Підтримує <, <=, >, >=

7. **Casting to byte** (`math_cast_byte`)
   ```arduino
   // casting to byte [value]
   (byte)(value)
   ```
   - Приведення до byte (0-255)

8. **Casting to unsigned int** (`math_cast_uint`)
   ```arduino
   // casting to unsigned int [value]
   (unsigned int)(value)
   ```
   - Приведення до unsigned int

9. **Casting to int** (`math_cast_int`)
   ```arduino
   // casting to int [value]
   (int)(value)
   ```
   - Приведення до signed int

10. **Casting to float** (`math_cast_float`)
    ```arduino
    // casting to float [value]
    (float)(value)
    ```
    - Приведення до float

---

## 📖 Використання

### 1. Блоки автоматично реєструються

```typescript
// В blocks-loader.service.ts
initializeAllBlocks(); // Реєструє Generic + Logic + Math
```

### 2. З'являються в Toolbox автоматично

```typescript
// ToolboxBuilder автоматично додає їх
const toolbox = ToolboxBuilder.forBoard('uno');

// Результат:
{
  "kind": "categoryToolbox",
  "contents": [
    { "name": "Generic", "contents": [...] },
    { "name": "Logic", "contents": [...] },
    { "name": "Math", "contents": [...] }
  ]
}
```

### 3. Приклад використання в коді

```typescript
// Створення нового блоку
const myBlock = new BlockBuilder('my_custom_block')
  .setCategory('Math')
  .setColor(BLOCK_COLORS.MATH)
  .setMessage('my operation %1')
  .addValueInput('INPUT', 'Number')
  .setOutput('Number')
  .setArduinoGenerator((block) => {
    const input = Blockly.Arduino.valueToCode(block, 'INPUT', 0);
    return [`myFunction(${input})`, 0];
  })
  .build();

// Реєстрація
BlockRegistry.register(myBlock);
```

---

## 🎨 Кольори

```typescript
export const BLOCK_COLORS = {
  LOGIC: 210,        // Синій
  LOOPS: 120,        // Зелений
  MATH: 230,         // Фіолетовий
  // ...
};
```

---

## 🔧 Розширення

### Додавання нового блоку в Logic:

```typescript
// src/app/modules/blockly/definitions/logic/index.ts

export const myLogicBlock = new BlockBuilder('my_logic_block')
  .setCategory('Logic')
  .setColor(BLOCK_COLORS.LOGIC)
  .setMessage('my condition %1')
  .addValueInput('CONDITION', 'Boolean')
  .setPreviousStatement(true, null)
  .setNextStatement(true, null)
  .setArduinoGenerator((block) => {
    const condition = Blockly.Arduino.valueToCode(block, 'CONDITION', 0);
    return `if (${condition}) { /* ... */ }\n`;
  })
  .build();

// Додати в LOGIC_BLOCKS array
export const LOGIC_BLOCKS: BlockDefinition[] = [
  switchBlock,
  myLogicBlock  // <-- Додати сюди
];
```

### Додавання нового блоку в Math:

```typescript
// src/app/modules/blockly/definitions/math/index.ts

export const myMathBlock = new BlockBuilder('my_math_block')
  .setCategory('Math')
  .setColor(BLOCK_COLORS.MATH)
  .setMessage('calculate %1')
  .addValueInput('VALUE', 'Number')
  .setOutput('Number')
  .setArduinoGenerator((block) => {
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', 0);
    return [`calculate(${value})`, 0];
  })
  .build();

// Додати в MATH_BLOCKS array
export const MATH_BLOCKS: BlockDefinition[] = [
  angleBlock,
  analogPinBlock,
  // ... інші блоки
  myMathBlock  // <-- Додати сюди
];
```

---

## 📊 Статистика

### Logic Category:
- **Standard Blockly blocks**: 8 блоків
- **Custom Arduino blocks**: 1 блок (switch-case)
- **Total**: 9 блоків

### Math Category:
- **Standard Blockly blocks**: 7 блоків
- **Custom Arduino blocks**: 10 блоків
- **Total**: 17 блоків

---

## 🚀 Наступні кроки

1. **Додати IO категорію** (digital_write, digital_read, analog_read, analog_write)
2. **Додати Sensors категорію** (ultrasonic, temperature, IR, тощо)
3. **Додати Actuators категорію** (servo, motor, stepper)
4. **Додати Communication категорію** (Serial, I2C, SPI)
5. **Додати Display категорію** (LCD, OLED, LED Matrix)

---

## ✨ Переваги нової архітектури

✅ **Type-safe блоки** - TypeScript для всіх блоків
✅ **BlockBuilder pattern** - простий і зрозумілий API
✅ **Automatic registration** - блоки автоматично з'являються в toolbox
✅ **BoardProfile integration** - dropdown автоматично підтягує піни з профілю
✅ **Модульна структура** - кожна категорія в окремій папці
✅ **Easy extensibility** - легко додавати нові блоки
✅ **Generator separation** - логіка генерації коду відокремлена від UI

---

## 📚 Додаткові ресурси

- [BlockBuilder API](src/app/modules/blockly/builders/block-builder.ts)
- [Block Types](src/app/modules/blockly/types/block.types.ts)
- [BlockRegistry](src/app/modules/blockly/registry/block-registry.ts)
- [Board Profiles](src/app/core/constants/board-profiles.constants.ts)
- [Blockly Globals](src/app/modules/blockly/utils/blockly-globals.ts)


