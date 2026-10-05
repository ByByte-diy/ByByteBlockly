# Toolbox Architecture: Dynamic Generation Pattern

## ✅ Виконано

Старі XML файли (`www/toolbox/*.xml`) повністю замінено на **динамічну генерацію** toolbox з використанням **Builder Pattern** + **Strategy Pattern**.

---

## 📁 Нова структура

```
src/app/modules/blockly/
├── types/
│   └── toolbox.types.ts          # TypeScript типи для toolbox
├── builders/
│   ├── block-builder.ts          # Builder для блоків
│   └── toolbox-builder.ts        # Builder для toolbox (NEW!)
├── registry/
│   └── block-registry.ts         # Реєстр блоків
└── services/
    └── blocks-loader.service.ts  # Завантажувач (оновлено)
```

---

## 🎯 Переваги нового підходу

### ✅ Що отримали:

1. **Dynamic Generation** - toolbox генерується автоматично
   ```typescript
   const toolbox = ToolboxBuilder.forBoard('esp32', {
     includeStandardBlocks: true,
     includeAdvancedBlocks: false
   });
   ```

2. **Type Safety** - TypeScript типи для toolbox конфігурації
   ```typescript
   interface ToolboxDefinition {
     kind: 'categoryToolbox' | 'flyoutToolbox';
     contents: (ToolboxCategory | ToolboxBlock)[];
   }
   ```

3. **Strategy Pattern** - різні стратегії для різних плат
   ```typescript
   // Автоматично визначає тип плати
   ToolboxBuilder.forBoard('uno');     // Arduino blocks
   ToolboxBuilder.forBoard('esp32');   // ESP32 blocks
   ToolboxBuilder.forBoard('esp8266'); // ESP8266 blocks
   ```

4. **Integration with BlockRegistry** - автоматично виявляє блоки
   ```typescript
   // Всі зареєстровані блоки автоматично потрапляють в toolbox
   BlockRegistry.register(myBlock);
   // Toolbox оновлюється автоматично!
   ```

5. **Filtering & Customization** - гнучка фільтрація
   ```typescript
   ToolboxBuilder.forBoard('mega', {
     includeAdvancedBlocks: true,
     excludeCategories: ['Deprecated'],
     customCategories: ['MyCustom']
   });
   ```

6. **No XML Files** - більше не потрібні XML файли
   - ❌ `www/toolbox/toolbox_arduino_all.xml`
   - ❌ `www/toolbox/toolbox_arduino_all-esp32.xml`
   - ❌ `www/toolbox/toolbox_arduino_all-esp8266.xml`

7. **Automatic Categorization** - блоки автоматично групуються
   ```typescript
   // Block з category: 'I/O' автоматично потрапляє в категорію "Input/Output"
   new BlockBuilder('digital_write')
     .setCategory('I/O')
     .build();
   ```

### ❌ Що видалили:

- ❌ XML toolbox файли
- ❌ Hardcoded шляхи до файлів
- ❌ XML parsing (`DOMParser`)
- ❌ `<parametre>` теги
- ❌ Ручне управління категоріями

---

## 📖 Використання

### 1. Базове використання

```typescript
// В BlocksLoaderService
async loadToolbox(boardId: string): Promise<any> {
  const { ToolboxBuilder } = await import('../builders/toolbox-builder');
  
  const toolbox = ToolboxBuilder.forBoard(boardId, {
    includeStandardBlocks: true,
    includeAdvancedBlocks: false
  });
  
  return toolbox;
}
```

### 2. Створення custom toolbox

```typescript
const toolbox = new ToolboxBuilder({
  boardType: 'arduino',
  includeStandardBlocks: true,
  includeAdvancedBlocks: true,
  excludeCategories: ['Deprecated', 'Experimental']
})
  .setBoardType('esp32')
  .includeAdvanced(true)
  .build();
```

### 3. Додавання блоку з metadata

```typescript
export const digitalWriteBlock = new BlockBuilder('digital_write')
  .setCategory('I/O')
  .setColor(BLOCK_COLORS.IO)
  .addField('PIN', {
    type: 'field_dropdown',
    options: () => getAllPins()
  })
  .setArduinoGenerator((block) => {
    const pin = block.getFieldValue('PIN');
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', 0) || 'LOW';
    return `digitalWrite(${pin}, ${value});\n`;
  })
  // NEW: Metadata для toolbox
  .setMetadata({
    requiredBoardTypes: ['arduino', 'esp32', 'esp8266'],
    minLevel: 'beginner',
    tags: ['gpio', 'output', 'digital']
  })
  .build();
```

### 4. Автоматичне визначення типу плати

```typescript
// ToolboxBuilder автоматично визначає тип плати:
ToolboxBuilder.forBoard('uno');           // BoardType: 'arduino'
ToolboxBuilder.forBoard('esp32');         // BoardType: 'esp32'
ToolboxBuilder.forBoard('esp8266');       // BoardType: 'esp8266'
ToolboxBuilder.forBoard('wemosD1mini');   // BoardType: 'esp8266'
ToolboxBuilder.forBoard('OttoESP');       // BoardType: 'esp8266'
ToolboxBuilder.forBoard('Ottoky');        // BoardType: 'esp32'
ToolboxBuilder.forBoard('microbit');      // BoardType: 'microbit'
ToolboxBuilder.forBoard('pyboard');       // BoardType: 'python'
```

---

## 🏗️ Архітектура

### 1. ToolboxBuilder (Builder Pattern)

```typescript
export class ToolboxBuilder {
  // Статичні методи для швидкого створення
  static fromRegistry(options?: Partial<ToolboxOptions>): ToolboxDefinition;
  static forBoard(boardId: string, options?: Partial<ToolboxOptions>): ToolboxDefinition;
  
  // Fluent API
  setBoardType(boardType: BoardType): this;
  includeAdvanced(include: boolean): this;
  excludeCategories(categories: string[]): this;
  build(): ToolboxDefinition;
}
```

### 2. Board Type Detection (Strategy Pattern)

```typescript
private static detectBoardType(boardId: string): BoardType {
  if (boardId.includes('esp32')) return 'esp32';
  if (boardId.includes('esp8266')) return 'esp8266';
  if (boardId.includes('microbit')) return 'microbit';
  return 'arduino'; // Default
}
```

### 3. Block Filtering

```typescript
private filterBlocksByBoardType(blocks: BlockDefinition[]): BlockDefinition[] {
  return blocks.filter(block => {
    // Перевіряємо metadata.requiredBoardTypes
    if (block.metadata?.requiredBoardTypes) {
      return block.metadata.requiredBoardTypes.includes(this.options.boardType);
    }
    
    // ESP блоки тільки для ESP плат
    if (block.category.toLowerCase().includes('esp')) {
      return this.options.boardType.includes('esp');
    }
    
    return true; // Generic blocks для всіх
  });
}
```

### 4. Automatic Categorization

```typescript
private buildCategories(): ToolboxCategory[] {
  const categories: ToolboxCategory[] = [];
  
  // Стандартні категорії (Logic, Loops, Math, Text, Variables)
  if (this.options.includeStandardBlocks) {
    categories.push(...this.buildStandardCategories());
  }
  
  // Custom категорії з BlockRegistry
  const categoryMap = this.groupBlocksByCategory();
  for (const [categoryName, blocks] of Object.entries(categoryMap)) {
    const metadata = this.getCategoryMetadata(categoryName);
    categories.push({
      kind: 'category',
      name: metadata.name,
      colour: metadata.colour,
      contents: blocks.map(b => this.blockToToolboxBlock(b))
    });
  }
  
  // Сортування за порядком
  return this.sortCategories(categories);
}
```

### 5. Category Metadata

```typescript
private getCategoryMetadata(categoryName: string): CategoryMetadata {
  const metadata: Record<string, CategoryMetadata> = {
    'Base': { name: 'Program', colour: '160', order: 1 },
    'Generic': { name: 'Generic', colour: '160', order: 2 },
    'I/O': { name: 'Input/Output', colour: '230', order: 3 },
    'Sensors': { name: 'Sensors', colour: '290', order: 4 },
    'Actuators': { name: 'Actuators', colour: '65', order: 5 },
    'Communication': { name: 'Communication', colour: '20', order: 6 },
    'Display': { name: 'Display', colour: '120', order: 7 },
    'Time': { name: 'Time', colour: '180', order: 8 }
  };
  
  return metadata[categoryName] || {
    name: categoryName,
    colour: '0',
    order: 50
  };
}
```

---

## 🔧 API Reference

### ToolboxBuilder

#### Static Methods

```typescript
// Generate toolbox from BlockRegistry
ToolboxBuilder.fromRegistry(options?: Partial<ToolboxOptions>): ToolboxDefinition

// Generate toolbox for specific board
ToolboxBuilder.forBoard(boardId: string, options?: Partial<ToolboxOptions>): ToolboxDefinition
```

#### Instance Methods

```typescript
// Set board type
setBoardType(boardType: BoardType): this

// Include advanced blocks
includeAdvanced(include: boolean = true): this

// Exclude specific categories
excludeCategories(categories: string[]): this

// Build the toolbox
build(): ToolboxDefinition
```

### ToolboxOptions

```typescript
interface ToolboxOptions {
  boardType: BoardType;                    // 'arduino' | 'esp32' | 'esp8266' | 'microbit' | 'python'
  includeStandardBlocks?: boolean;         // Include Logic, Loops, Math, etc.
  includeAdvancedBlocks?: boolean;         // Include advanced/expert blocks
  customCategories?: string[];             // Additional categories to include
  excludeCategories?: string[];            // Categories to exclude
}
```

### BlockMetadata (для блоків)

```typescript
interface BlockMetadata {
  requiredBoardTypes?: BoardType[];        // Block only shows for these boards
  requiredPlatform?: Platform;             // 'web' | 'electron' | 'both'
  minLevel?: BlockLevel;                   // 'beginner' | 'intermediate' | 'advanced'
  tags?: string[];                         // Tags for searching/filtering
  defaultValues?: Record<string, any>;     // Default field values
  deprecated?: boolean;                    // Is this block deprecated?
  replacedBy?: string;                     // Replacement block (if deprecated)
}
```

---

## 🎨 Приклади

### Приклад 1: Базовий Arduino Toolbox

```typescript
const toolbox = ToolboxBuilder.forBoard('uno');

// Результат:
{
  "kind": "categoryToolbox",
  "contents": [
    { "name": "Logic", "colour": "210", "contents": [...] },
    { "name": "Loops", "colour": "120", "contents": [...] },
    { "name": "Math", "colour": "230", "contents": [...] },
    { "name": "Program", "colour": "160", "contents": [
      { "kind": "block", "type": "base_setup_loop" },
      { "kind": "block", "type": "base_code" }
    ]},
    { "name": "Input/Output", "colour": "230", "contents": [...] }
  ]
}
```

### Приклад 2: ESP32 з Advanced блоками

```typescript
const toolbox = ToolboxBuilder.forBoard('esp32', {
  includeAdvancedBlocks: true
});

// ESP-специфічні блоки автоматично додаються
// Arduino блоки теж включені
```

### Приклад 3: Custom фільтрація

```typescript
const toolbox = new ToolboxBuilder({
  boardType: 'arduino',
  includeStandardBlocks: false,  // Без Logic/Loops/Math
  includeAdvancedBlocks: false,
  excludeCategories: ['Deprecated', 'Experimental']
})
  .setBoardType('mega')
  .build();

// Тільки custom блоки для Mega, без стандартних
```

### Приклад 4: Блок з metadata

```typescript
// Блок тільки для ESP32/ESP8266
export const wifiConnectBlock = new BlockBuilder('wifi_connect')
  .setCategory('Communication')
  .setColor(BLOCK_COLORS.COMMUNICATION)
  .addField('SSID', {
    type: 'field_text',
    value: 'MyWiFi'
  })
  .setMetadata({
    requiredBoardTypes: ['esp32', 'esp8266'],  // Тільки для ESP
    minLevel: 'intermediate',
    tags: ['wifi', 'network', 'wireless']
  })
  .build();

// Цей блок НЕ з'явиться для Arduino Uno
// Цей блок З'ЯВИТЬСЯ для ESP32/ESP8266
```

---

## 🔄 Міграція з XML

### Старий підхід ❌

```typescript
// Завантаження XML файлу
async loadToolbox(boardId: string) {
  let toolboxFile = 'www/toolbox/toolbox_arduino_all.xml';
  
  if (boardId.includes('esp32')) {
    toolboxFile = 'www/toolbox/toolbox_arduino_all-esp32.xml';
  }
  
  const xml = await this.http.get(toolboxFile).toPromise();
  const dom = parser.parseFromString(xml, 'text/xml');
  return dom.documentElement;
}
```

### Новий підхід ✅

```typescript
// Динамічна генерація
async loadToolbox(boardId: string) {
  const { ToolboxBuilder } = await import('../builders/toolbox-builder');
  
  return ToolboxBuilder.forBoard(boardId, {
    includeStandardBlocks: true,
    includeAdvancedBlocks: false
  });
}
```

---

## 📊 Порівняння

| Feature | XML Approach ❌ | Builder Approach ✅ |
|---------|----------------|---------------------|
| Type Safety | ❌ No | ✅ Yes |
| Dynamic | ❌ Static files | ✅ Generated at runtime |
| Board Detection | ❌ Manual if/else | ✅ Automatic |
| Block Filtering | ❌ Manual | ✅ Automatic |
| Extensibility | ❌ Edit XML | ✅ Add blocks to registry |
| Testing | ❌ Hard | ✅ Easy |
| Bundle Size | ❌ +XML files | ✅ Smaller |
| Maintenance | ❌ Update 3 files | ✅ Auto-generated |

---

## 🚀 Наступні кроки

1. **Видалити XML файли:**
   ```bash
   rm -rf www/toolbox/*.xml
   ```

2. **Додати metadata до існуючих блоків:**
   ```typescript
   .setMetadata({
     requiredBoardTypes: ['arduino'],
     minLevel: 'beginner'
   })
   ```

3. **Створити ESP32/ESP8266 специфічні блоки:**
   ```typescript
   const esp32Block = new BlockBuilder('esp32_wifi')
     .setMetadata({
       requiredBoardTypes: ['esp32']
     })
     .build();
   ```

4. **Створити advanced блоки:**
   ```typescript
   const advancedBlock = new BlockBuilder('advanced_feature')
     .setMetadata({
       minLevel: 'advanced'
     })
     .build();
   ```

---

## ⚠️ Важливі примітки

1. **Автоматична реєстрація:**
   - Всі блоки з `BlockRegistry` автоматично потрапляють в toolbox
   - Немає потреби вручну додавати в XML

2. **Board Type Detection:**
   - Автоматично визначається з board ID
   - Можна перевизначити через options

3. **Performance:**
   - Toolbox генерується один раз при завантаженні
   - Кешується в пам'яті
   - No HTTP requests

4. **Extensibility:**
   - Легко додавати нові категорії
   - Легко додавати нові board types
   - Легко фільтрувати блоки

---

## ✨ Результат

✅ **Динамічна генерація toolbox**
✅ **Type Safety**
✅ **Automatic board detection**
✅ **Integration з BlockRegistry**
✅ **No XML files**
✅ **Кращий Developer Experience**
✅ **Strategy Pattern для різних плат**

**Старий підхід: 3 XML файли, manual management**
**Новий підхід: Dynamic generation, automatic categorization**


