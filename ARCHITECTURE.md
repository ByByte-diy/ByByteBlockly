# Архітектура ByByte Blockly

## Огляд

ByByte Blockly тепер використовує модульну архітектуру на базі Angular, що підтримує як веб-версію, так і десктопну (Electron) версію через платформні адаптери.

## Структура проекту

```
src/
├── app/
│   ├── core/              # Ядро: інтерфейси та базова логіка
│   │   ├── interfaces/    # TypeScript інтерфейси для платформних сервісів
│   │   └── services/      # Базові сервіси
│   │
│   ├── platform/          # Платформні адаптери
│   │   ├── web/          # Реалізація для веб-версії
│   │   └── electron/     # Реалізація для Electron
│   │
│   ├── modules/          # Функціональні модулі
│   │   ├── blockly/      # Blockly редактор
│   │   ├── device/       # Менеджер пристроїв
│   │   ├── upload/       # Завантаження прошивки
│   │   ├── lessons/      # Навчальні уроки
│   │   ├── docs/         # Документація
│   │   └── settings/     # Налаштування
│   │
│   ├── shared/           # Спільні компоненти та утиліти
│   └── state/            # Управління станом додатку
│
└── assets/               # Статичні ресурси
```

## Принципи архітектури

### 1. Розділення відповідальностей

- **Core** - визначає інтерфейси та контракти
- **Platform** - реалізує платформно-специфічну логіку
- **Modules** - містять бізнес-логіку та UI
- **Shared** - переважно UI компоненти
- **State** - управління станом

### 2. Ін'єкція залежностей

Використовуємо Angular DI для підміни платформних сервісів:

```typescript
// Core інтерфейс
export interface ICompiler {
  compile(code: string): Promise<CompileResult>;
}

// Electron реалізація
@Injectable()
export class ElectronCompiler implements ICompiler {
  compile(code: string): Promise<CompileResult> {
    // Викликаємо arduino-cli через Node.js
  }
}

// Web реалізація
@Injectable()
export class WebCompiler implements ICompiler {
  compile(code: string): Promise<CompileResult> {
    // Викликаємо API сервера
  }
}
```

### 3. Платформні адаптери

Кожна платформа має свій провайдер модуль:

```typescript
// platform/electron/electron-platform.module.ts
@NgModule({
  providers: [
    { provide: ICompiler, useClass: ElectronCompiler },
    { provide: IUploader, useClass: ElectronUploader },
    { provide: ISerial, useClass: ElectronSerial }
  ]
})
export class ElectronPlatformModule { }
```

### 4. Відсутність умовних перевірок платформи

❌ **Неправильно:**
```typescript
if (isElectron()) {
  // Electron логіка
} else {
  // Web логіка
}
```

✅ **Правильно:**
```typescript
constructor(private compiler: ICompiler) { }

compile() {
  this.compiler.compile(this.code);
}
```

## Збірка

### Web версія
```bash
npm run start:web    # Dev сервер
npm run build:web    # Production збірка
```

### Electron версія
```bash
npm run start:electron      # Запуск Electron
npm run build:electron      # Збірка Electron
```

## Етапи міграції

1. ✅ **Крок 1**: Ініціалізація Angular та базова структура
2. **Крок 2**: Створення Core інтерфейсів
3. **Крок 3**: Реалізація платформних адаптерів
4. **Крок 4**: Міграція Blockly модуля
5. **Крок 5**: Міграція Device модуля
6. **Крок 6**: Міграція Upload модуля
7. **Крок 7**: Додаткові модулі (Lessons, Docs, Settings)
8. **Крок 8**: Налаштування збірок
9. **Крок 9**: Тестування та відладка
10. **Крок 10**: Документація

## Наступні кроки

Перейти до створення Core інтерфейсів для компілятора, завантажувача та serial порту.

