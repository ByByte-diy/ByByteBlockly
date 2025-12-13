# Storage Architecture - Universal Cross-Platform System

## 🎯 Огляд

Універсальна система зберігання з **автоматичним вибором адаптера** на основі платформи.

### Підтримувані платформи

| Платформа | Адаптер | Ліміт | Швидкість |
|-----------|---------|-------|-----------|
| **🌐 Web** | LocalStorage | ~5-10 MB | Швидко |
| **🖥️ Electron** | FileSystem | Необмежений | Дуже швидко |
| **📱 Android** | Native Storage | Майбутнє | - |
| **🍎 iOS** | Native Storage | Майбутнє | - |
| **🍏 macOS** | FileSystem | Майбутнє | - |

## 🏗️ Архітектура

### Діаграма компонентів

```
┌─────────────────────────────────────┐
│   WorkspaceStorageService           │  ← Головний сервіс (Angular)
│   - saveWorkspace()                 │
│   - loadWorkspace()                 │
│   - saveSettings()                  │
└──────────────┬──────────────────────┘
               │
               │ використовує
               ↓
┌─────────────────────────────────────┐
│   StorageAdapterFactory             │  ← Фабрика (автовибір)
│   - createAdapter()                 │
│   - getAdapterForPlatform()         │
└──────────────┬──────────────────────┘
               │
               │ створює
               ↓
┌─────────────────────────────────────┐
│   IStorageAdapter (interface)       │  ← Інтерфейс адаптера
│   - getItem()                       │
│   - setItem()                       │
│   - removeItem()                    │
│   - keys()                          │
│   - getSize()                       │
└──────────────┬──────────────────────┘
               │
               │ імплементують
               ↓
     ┌─────────┴─────────┐
     │                   │
     ↓                   ↓
┌──────────────┐  ┌──────────────────┐
│ WebLocalStorage│  │ElectronFileSystem│
│   Adapter    │  │    Adapter       │
└──────────────┘  └──────────────────┘
```

### Шаблон проектування

**Adapter Pattern** + **Factory Pattern** + **Strategy Pattern**

- **Adapter**: Уніфікує різні API зберігання
- **Factory**: Автоматично вибирає правильний адаптер
- **Strategy**: Дозволяє змінювати стратегію зберігання в runtime

## 📦 Структура файлів

```
src/app/modules/blockly/services/storage/
├── index.ts                              # Barrel export
├── storage-adapter.interface.ts          # Інтерфейси та enum'и
├── storage-adapter.factory.ts            # Фабрика адаптерів
├── workspace-storage.service.ts          # Головний сервіс
└── adapters/
    ├── base-adapter.ts                   # Базовий клас
    ├── web-localstorage.adapter.ts       # Web адаптер
    ├── electron-filesystem.adapter.ts    # Electron адаптер
    └── [майбутні адаптери...]
```

## 🔌 Інтерфейси

### IStorageAdapter

Базовий інтерфейс для всіх адаптерів:

```typescript
interface IStorageAdapter {
  // Базові операції
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;

  // Метадані
  isAvailable(): boolean;
  getType(): StorageType;
  getPlatform(): PlatformType;
  getSize(): Promise<number | null>;
  getCapacity(): Promise<number | null>;
}
```

### IAdvancedStorageAdapter

Розширений інтерфейс для адаптерів з додатковими можливостями:

```typescript
interface IAdvancedStorageAdapter extends IStorageAdapter {
  // Файлові операції
  exportToFile?(path: string): Promise<boolean>;
  importFromFile?(path: string): Promise<boolean>;
  getStorageLocation?(): string | null;

  // Backup
  createBackup?(): Promise<string | null>;
  restoreBackup?(backupPath: string): Promise<boolean>;
}
```

## 🎨 Використання

### Базовий приклад

```typescript
@Component({...})
export class BlocklyEditorComponent {
  constructor(private storage: WorkspaceStorageService) {}

  async ngOnInit() {
    // Автоматично вибирає правильний адаптер
    const result = await this.storage.initialize();
    
    if (!result.compatible) {
      // Обробка несумісної версії
      this.handleIncompatibleVersion();
    }

    // Завантаження збереженого workspace
    if (await this.storage.hasSavedData()) {
      await this.storage.loadWorkspace(this.workspace);
    }
  }

  onWorkspaceChange() {
    // Автозбереження з debounce
    this.storage.saveWorkspace(this.workspace, true);
  }
}
```

### Отримання інформації про storage

```typescript
const info = await this.storage.getStorageInfo();

console.log('Type:', info.type);           // 'localStorage' або 'fileSystem'
console.log('Platform:', info.platform);   // 'web' або 'electron'
console.log('Size:', info.size);           // Розмір в байтах
console.log('Capacity:', info.capacity);   // Ліміт (null = необмежений)
console.log('Location:', info.location);   // Шлях (тільки для fileSystem)
```

### Використання розширених можливостей

```typescript
// Створити backup (тільки для адаптерів з підтримкою)
const backupPath = await this.storage.createBackup();
if (backupPath) {
  console.log('Backup created:', backupPath);
}

// Експорт в файл (Electron)
const success = await this.storage.exportToFile('/path/to/file.json');

// Отримати локацію зберігання (Electron)
const location = this.storage.getStorageLocation();
if (location) {
  // Відкрити в провіднику
  shell.openPath(location);
}
```

## 🔧 Створення нового адаптера

### Крок 1: Створити клас адаптера

```typescript
import { BaseStorageAdapter } from './base-adapter';
import { StorageType, PlatformType } from '../storage-adapter.interface';

export class AndroidNativeStorageAdapter extends BaseStorageAdapter {
  getType(): StorageType {
    return StorageType.NATIVE_STORAGE;
  }

  getPlatform(): PlatformType {
    return PlatformType.ANDROID;
  }

  isAvailable(): boolean {
    // Перевірка доступності Android API
    return !!(window as any).AndroidStorage;
  }

  async getItem(key: string): Promise<string | null> {
    const fullKey = this.ensurePrefix(key);
    // Виклик Android API
    return (window as any).AndroidStorage.getItem(fullKey);
  }

  async setItem(key: string, value: string): Promise<void> {
    const fullKey = this.ensurePrefix(key);
    (window as any).AndroidStorage.setItem(fullKey, value);
  }

  // ... інші методи
}
```

### Крок 2: Додати в Factory

```typescript
// storage-adapter.factory.ts

static createAdapter(): IStorageAdapter {
  const platform = detectPlatform();

  switch (platform) {
    case Platform.ANDROID:
      return this.createAndroidAdapter();
    
    case Platform.ELECTRON:
      return this.createElectronAdapter();
    
    case Platform.WEB:
      return this.createWebAdapter();
  }
}

private static createAndroidAdapter(): IStorageAdapter {
  const adapter = new AndroidNativeStorageAdapter();
  
  if (adapter.isAvailable()) {
    console.log('📱 Using Android Native Storage');
    return adapter;
  }

  // Fallback
  return this.createWebAdapter();
}
```

### Крок 3: Експортувати

```typescript
// index.ts
export * from './adapters/android-native-storage.adapter';
```

## 📊 Порівняння адаптерів

### WebLocalStorageAdapter

**Платформа:** Web (всі браузери)

**Переваги:**
- ✅ Універсальність (працює всюди)
- ✅ Простота
- ✅ Швидкість
- ✅ Не потребує додаткових дозволів

**Недоліки:**
- ❌ Обмежений розмір (~5-10 MB)
- ❌ Може бути очищений користувачем
- ❌ Немає прямого доступу до файлів

**Використання:**
```typescript
Storage: localStorage
Keys: blockly_*
Location: Browser storage
```

### ElectronFileSystemAdapter

**Платформа:** Electron (Windows, Linux, macOS)

**Переваги:**
- ✅ Необмежений розмір
- ✅ Швидкий доступ
- ✅ Прямий доступ до файлів
- ✅ Підтримка backup/restore
- ✅ Експорт/імпорт файлів

**Недоліки:**
- ❌ Тільки для Electron
- ❌ Потребує Node.js інтеграції

**Використання:**
```typescript
Storage: Node.js fs
Keys: blockly_*.json файли
Location: User Data Directory
  Windows: C:\Users\...\AppData\Roaming\App\blockly-storage\
  macOS: ~/Library/Application Support/App/blockly-storage/
  Linux: ~/.config/App/blockly-storage/
```

## 🔐 Версіонування

### Semantic Versioning

Версія формату даних: `MAJOR.MINOR.PATCH`

```typescript
STORAGE_VERSION = '1.0.0'
```

- **MAJOR**: Несумісні зміни формату
- **MINOR**: Додавання нових полів (сумісно)
- **PATCH**: Виправлення без змін формату

### Перевірка сумісності

```typescript
private isVersionCompatible(savedVersion: string): boolean {
  const [savedMajor] = savedVersion.split('.').map(Number);
  const [currentMajor] = STORAGE_VERSION.split('.').map(Number);
  
  // Тільки major версія має значення
  return savedMajor === currentMajor;
}
```

### Обробка несумісних версій

```typescript
const result = await this.storage.initialize();

if (!result.compatible) {
  const message = `
    Версія збережених даних застаріла (${result.data?.version}).
    Поточна версія: ${STORAGE_VERSION}.
    
    Дані будуть очищені. Продовжити?
  `;

  if (confirm(message)) {
    await this.storage.clearStorage();
  }
}
```

## 🧪 Тестування

### Unit тести

```typescript
describe('WorkspaceStorageService', () => {
  let service: WorkspaceStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkspaceStorageService]
    });
    service = TestBed.inject(WorkspaceStorageService);
  });

  it('should initialize with compatible version', async () => {
    const result = await service.initialize();
    expect(result.compatible).toBe(true);
  });

  it('should save and load workspace', async () => {
    const mockWorkspace = createMockWorkspace();
    
    await service.saveWorkspace(mockWorkspace, false);
    expect(await service.hasSavedData()).toBe(true);
    
    const newWorkspace = createMockWorkspace();
    const loaded = await service.loadWorkspace(newWorkspace);
    expect(loaded).toBe(true);
  });
});
```

### Integration тести

```typescript
describe('Storage Adapters', () => {
  it('should auto-select correct adapter', () => {
    const adapter = StorageAdapterFactory.createAdapter();
    
    if (isElectron()) {
      expect(adapter.getType()).toBe(StorageType.FILE_SYSTEM);
    } else {
      expect(adapter.getType()).toBe(StorageType.LOCAL_STORAGE);
    }
  });
});
```

## 🚀 Розширення системи

### Додавання нової платформи

1. **Створити адаптер** (`adapters/platform-name.adapter.ts`)
2. **Додати в Factory** (`storage-adapter.factory.ts`)
3. **Додати PlatformType** (`storage-adapter.interface.ts`)
4. **Експортувати** (`index.ts`)
5. **Написати тести**
6. **Оновити документацію**

### Приклад: iOS адаптер

```typescript
// adapters/ios-native-storage.adapter.ts
export class IOSNativeStorageAdapter extends BaseStorageAdapter 
  implements IAdvancedStorageAdapter {
  
  getType(): StorageType {
    return StorageType.NATIVE_STORAGE;
  }

  getPlatform(): PlatformType {
    return PlatformType.IOS;
  }

  // Використання Capacitor Storage API
  async getItem(key: string): Promise<string | null> {
    const { value } = await Capacitor.Storage.get({ 
      key: this.ensurePrefix(key) 
    });
    return value;
  }

  // ... інші методи
}
```

## 📝 Кращі практики

### 1. Завжди використовуйте async/await

```typescript
// ✅ Правильно
async saveData() {
  await this.storage.saveWorkspace(workspace);
}

// ❌ Неправильно
saveData() {
  this.storage.saveWorkspace(workspace); // Promise не обробляється
}
```

### 2. Обробляйте помилки

```typescript
try {
  await this.storage.saveSettings(settings);
} catch (error) {
  console.error('Failed to save settings:', error);
  this.showErrorNotification();
}
```

### 3. Використовуйте debounce для частих оновлень

```typescript
// З debounce (рекомендовано)
this.storage.saveWorkspace(workspace, true);

// Без debounce (для critical saves)
this.storage.saveWorkspace(workspace, false);
```

### 4. Перевіряйте доступність перед використанням

```typescript
const info = await this.storage.getStorageInfo();

if (!info.available) {
  console.error('Storage not available');
  return;
}
```

### 5. Очищайте дані при logout

```typescript
logout() {
  await this.storage.clearStorage();
  // ... інша логіка logout
}
```

## 🎯 Висновок

Нова архітектура надає:

- ✅ **Універсальність** - один API для всіх платформ
- ✅ **Масштабованість** - легко додавати нові адаптери
- ✅ **Гнучкість** - автоматичний вибір на основі платформи
- ✅ **Надійність** - версіонування та перевірка сумісності
- ✅ **Продуктивність** - оптимізовано для кожної платформи
- ✅ **Майбутнє** - готово до Android, iOS, macOS

**Система готова до використання та розширення!** 🚀

