# Mutator Registry Architecture

## Огляд

`MutatorRegistry` забезпечує централізоване управління всіма мутаторами Blockly в додатку. Це гарантує, що всі мутатори реєструються один раз і в правильному порядку.

## Навіщо це потрібно?

### Проблема

Раніше мутатори реєструвались безпосередньо в файлах блоків через IIFE (Immediately Invoked Function Expression):

```typescript
// ❌ Старий підхід (не рекомендується)
const registerSwitchMutatorExtension = (() => {
  let registered = false;
  return () => {
    if (registered) return;
    // ... реєстрація мутатора
    registered = true;
  };
})();

registerSwitchMutatorExtension(); // Виклик на рівні модуля
```

**Проблеми цього підходу:**
- 🚫 Побічні ефекти на рівні модуля
- 🚫 Важко тестувати
- 🚫 Відсутність централізованого контролю
- 🚫 Можливі проблеми з порядком ініціалізації
- 🚫 Код розкиданий по різних файлах

### Рішення

`MutatorRegistry` централізує весь процес:

```typescript
// ✅ Новий підхід (рекомендується)
MutatorRegistry.define({
  name: 'controls_switch_mutator',
  mixin: SWITCH_MUTATOR_MIXIN,
  helperBlocks: ['controls_case_break', 'controls_case_default'],
  init: function(this: Blockly.Block) {
    (this as any).casebreakCount_ = 0;
    (this as any).defaultCount_ = 0;
  },
});
```

**Переваги:**
- ✅ Декларативний підхід
- ✅ Централізована ініціалізація
- ✅ Легко тестувати
- ✅ Чіткий порядок виконання
- ✅ Немає побічних ефектів на рівні модуля

## Як використовувати

### 1. Визначення мутатора

В файлі блоку (наприклад, `switch.block.ts`):

```typescript
import { MutatorRegistry } from "../../lib/registry/mutator-registry";

// 1. Створіть mixin з методами мутатора
const SWITCH_MUTATOR_MIXIN = {
  mutationToDom: function(this: Blockly.Block) {
    // Серіалізація стану мутатора в XML
  },
  
  domToMutation: function(this: Blockly.Block, xmlElement: Element) {
    // Десеріалізація стану мутатора з XML
  },
  
  decompose: function(this: Blockly.Block, workspace: Blockly.Workspace) {
    // Створення діалогу мутатора
  },
  
  compose: function(this: Blockly.Block, containerBlock: Blockly.Block) {
    // Застосування змін з діалогу мутатора
  },
  
  saveConnections: function(this: Blockly.Block, containerBlock: Blockly.Block) {
    // Збереження з'єднань перед оновленням блоку
  },
};

// 2. Зареєструйте мутатор
MutatorRegistry.define({
  name: 'controls_switch_mutator',           // Унікальна назва мутатора
  mixin: SWITCH_MUTATOR_MIXIN,              // Mixin з методами
  helperBlocks: ['controls_case_break'],    // Допоміжні блоки для діалогу
  init: function(this: Blockly.Block) {     // Опціональна ініціалізація
    (this as any).casebreakCount_ = 0;
  },
});
```

### 2. Використання мутатора в блоці

```typescript
export const switchBlock = new BlockBuilder("controls_switch")
  .setCategory(CATEGORY_NAME)
  // ... інші налаштування
  .setMutator("controls_switch_mutator")  // Прив'язка мутатора до блоку
  .build();
```

### 3. Ініціалізація

Мутатори автоматично ініціалізуються через `BlockRegistry`:

```typescript
// src/app/modules/blockly/definitions/index.ts
export function initializeAllBlocks(): void {
  // 1. Спочатку ініціалізуємо всі мутатори
  BlockRegistry.initializeMutators();

  // 2. Потім реєструємо блоки
  [generic, logic, math].forEach((module) => {
    module.initialize();
  });

  BlockRegistry.setInitialized();
}
```

## API

### MutatorRegistry.define()

Реєструє визначення мутатора (не реєструє в Blockly).

```typescript
MutatorRegistry.define({
  name: string;              // Унікальна назва мутатора
  mixin: any;               // Об'єкт з методами мутатора
  helperBlocks: string[];   // Масив типів допоміжних блоків
  init?: (this: Blockly.Block) => void;  // Опціональна ініціалізація
});
```

### MutatorRegistry.initializeAll()

Ініціалізує всі зареєстровані мутатори з Blockly. Викликається автоматично через `BlockRegistry.initializeMutators()`.

```typescript
MutatorRegistry.initializeAll();
```

### MutatorRegistry.isInitialized()

Перевіряє, чи вже були ініціалізовані мутатори.

```typescript
if (MutatorRegistry.isInitialized()) {
  console.log('Mutators are ready!');
}
```

### MutatorRegistry.getAll()

Повертає список всіх зареєстрованих назв мутаторів.

```typescript
const mutators = MutatorRegistry.getAll();
// ['controls_switch_mutator', 'controls_if_mutator']
```

### MutatorRegistry.has()

Перевіряє, чи існує мутатор з заданою назвою.

```typescript
if (MutatorRegistry.has('controls_switch_mutator')) {
  console.log('Switch mutator is registered!');
}
```

## Структура Mixin

Типовий mixin для мутатора містить:

```typescript
{
  // Серіалізація: Block → XML
  mutationToDom: function(this: Blockly.Block): Element | null {
    const container = document.createElement('mutation');
    container.setAttribute('count', this.itemCount_.toString());
    return container;
  },
  
  // Десеріалізація: XML → Block
  domToMutation: function(this: Blockly.Block, xmlElement: Element): void {
    const count = parseInt(xmlElement.getAttribute('count') || '0', 10);
    this.itemCount_ = count;
    // Відновлюємо inputs на основі count
  },
  
  // Створення діалогу мутатора
  decompose: function(this: Blockly.Block, workspace: Blockly.Workspace): Blockly.Block {
    const containerBlock = workspace.newBlock('controls_container');
    containerBlock.initSvg();
    // Створюємо helper blocks на основі поточного стану
    return containerBlock;
  },
  
  // Застосування змін з діалогу
  compose: function(this: Blockly.Block, containerBlock: Blockly.Block): void {
    // Читаємо helper blocks з containerBlock
    // Оновлюємо inputs основного блоку
  },
  
  // Збереження з'єднань (опціонально)
  saveConnections: function(this: Blockly.Block, containerBlock: Blockly.Block): void {
    // Зберігаємо connections дочірніх блоків
  },
}
```

## Приклади

### Switch Statement Mutator

```typescript
// switch.block.ts
MutatorRegistry.define({
  name: 'controls_switch_mutator',
  mixin: {
    mutationToDom: function(this: Blockly.Block) {
      const caseCount = (this as any).casebreakCount_ || 0;
      if (!caseCount) return null;
      const container = document.createElement('mutation');
      container.setAttribute('casebreak', caseCount.toString());
      return container;
    },
    // ... інші методи
  },
  helperBlocks: ['controls_case_break', 'controls_case_default'],
  init: function(this: Blockly.Block) {
    (this as any).casebreakCount_ = 0;
    (this as any).defaultCount_ = 0;
  },
});
```

## Порядок ініціалізації

```
1. Модулі блоків завантажуються
   ├─ MutatorRegistry.define() викликається для кожного мутатора
   └─ Визначення зберігаються в реєстрі

2. initializeAllBlocks() викликається
   ├─ BlockRegistry.initializeMutators()
   │  └─ MutatorRegistry.initializeAll()
   │     └─ Blockly.Extensions.registerMutator() для кожного мутатора
   │
   └─ Реєстрація блоків через module.initialize()
      └─ BlockRegistry.register() для кожного блоку
```

## Тестування

```typescript
import { MutatorRegistry } from './mutator-registry';

describe('MutatorRegistry', () => {
  beforeEach(() => {
    MutatorRegistry._reset(); // Очищуємо для тестів
  });

  it('should register mutator definition', () => {
    MutatorRegistry.define({
      name: 'test_mutator',
      mixin: {},
      helperBlocks: [],
    });

    expect(MutatorRegistry.has('test_mutator')).toBe(true);
  });
});
```

## Міграція з старого підходу

### Було:

```typescript
const registerMutator = (() => {
  let registered = false;
  return () => {
    if (registered) return;
    Blockly.Extensions.registerMutator('my_mutator', MIXIN, init, helpers);
    registered = true;
  };
})();

registerMutator(); // ❌ Виклик на рівні модуля
```

### Стало:

```typescript
MutatorRegistry.define({
  name: 'my_mutator',
  mixin: MIXIN,
  helperBlocks: helpers,
  init: init,
}); // ✅ Декларативне визначення
```

## Кращі практики

1. **Визначайте мутатори поруч з блоками** - в тому ж файлі де визначається блок
2. **Використовуйте описові назви** - `controls_switch_mutator` краще ніж `switch_mut`
3. **Документуйте mixin методи** - додайте коментарі до кожного методу
4. **Тестуйте мутатори окремо** - створюйте unit tests для mixin логіки
5. **Не викликайте побічні ефекти** - `.define()` тільки реєструє, не виконує

## Висновок

`MutatorRegistry` надає чистий, централізований підхід до управління мутаторами Blockly. Він покращує тестованість, підтримку та читабельність коду, усуваючи побічні ефекти на рівні модулів.

