# Storage System - Quick Start 🚀

## 📦 Що це?

Універсальна система зберігання workspace та налаштувань з **автоматичним вибором** адаптера для кожної платформи.

## ✨ Можливості

- ✅ **Автозбереження** workspace при кожній зміні
- ✅ **Збереження налаштувань** (board, port, тощо)
- ✅ **Автовибір платформи** (Web/Electron/інші)
- ✅ **Версіонування даних** з перевіркою сумісності
- ✅ **Експорт/Імпорт** проектів
- ✅ **Backup/Restore** (Electron)

## 🏗️ Архітектура

```
Service → Factory → Adapter (Web/Electron/інші)
```

**Adapter Pattern**: Один інтерфейс для всіх платформ

## 🎯 Швидкий старт

### 1. Імпорт сервісу

```typescript
import { WorkspaceStorageService } from '@app/modules/blockly/services/storage';
```

### 2. Inject в компонент

```typescript
@Component({...})
export class BlocklyEditorComponent {
  constructor(
    private storage: WorkspaceStorageService
  ) {}
}
```

### 3. Ініціалізація

```typescript
async ngOnInit() {
  // Перевірка версії
  const result = await this.storage.initialize();
  
  if (!result.compatible) {
    // Показати попередження про несумісну версію
    this.handleVersionMismatch();
  }

  // Завантаження збереженого workspace
  if (await this.storage.hasSavedData()) {
    await this.storage.loadWorkspace(this.workspace);
  }
}
```

### 4. Автозбереження

```typescript
this.workspace.addChangeListener((event) => {
  // Автозбереження з debounce (1 сек)
  if (event.type !== Blockly.Events.UI) {
    this.storage.saveWorkspace(this.workspace, true);
  }
});
```

### 5. Збереження налаштувань

```typescript
this.deviceManager.selectedBoard$.subscribe((board) => {
  this.storage.saveSettings({
    selectedBoard: board.id,
    selectedPort: this.deviceManager.getSelectedPort()?.path
  });
});
```

## 📊 Платформи

| Платформа | Адаптер | Ліміт |
|-----------|---------|-------|
| 🌐 Web | LocalStorage | ~5-10 MB |
| 🖥️ Electron | FileSystem | ♾️ Необмежений |
| 📱 Майбутнє | Native Storage | TBD |

## 🔧 API

### Основні методи

```typescript
// Ініціалізація
await storage.initialize();

// Workspace
await storage.saveWorkspace(workspace, debounce?);
await storage.loadWorkspace(workspace);
await storage.hasSavedData();

// Налаштування
await storage.saveSettings(settings);
await storage.loadSettings();

// Управління
await storage.clearStorage();
await storage.getLastSavedTime();
```

### Розширені методи (Electron)

```typescript
// Інформація
await storage.getStorageInfo();
storage.getStorageLocation();

// Backup
await storage.createBackup();
await storage.restoreBackup(path);

// Експорт/Імпорт
await storage.exportToFile(path);
await storage.importFromFile(path);
```

## 💡 Приклади

### Експорт проекту

```typescript
async exportProject() {
  const data = await this.storage.exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  
  // Download файл
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `project-${Date.now()}.json`;
  a.click();
}
```

### Імпорт проекту

```typescript
async importProject(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  
  await this.storage.importData(data);
  await this.storage.loadWorkspace(this.workspace);
  
  alert('Проект імпортовано!');
}
```

### Показати статус

```typescript
async showStorageInfo() {
  const info = await this.storage.getStorageInfo();
  
  console.log('Platform:', info.platform);
  console.log('Type:', info.type);
  console.log('Size:', this.formatBytes(info.size));
  console.log('Location:', info.location);
}

formatBytes(bytes: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
```

### Відкрити папку (Electron)

```typescript
openStorageFolder() {
  const location = this.storage.getStorageLocation();
  
  if (location) {
    const { shell } = require('electron');
    shell.openPath(location);
  } else {
    alert('Доступно тільки в desktop версії');
  }
}
```

## 🐛 Troubleshooting

### Storage недоступний

```typescript
const info = await this.storage.getStorageInfo();

if (!info.available) {
  console.error('Storage not available');
  // Fallback: використати тимчасове зберігання
}
```

### Очистити при помилці

```typescript
try {
  await this.storage.loadWorkspace(workspace);
} catch (error) {
  console.error('Failed to load workspace:', error);
  await this.storage.clearStorage();
}
```

### Версія несумісна

```typescript
const result = await this.storage.initialize();

if (!result.compatible) {
  const message = `
    Дані застарілої версії.
    Очистити?
  `;
  
  if (confirm(message)) {
    await this.storage.clearStorage();
  }
}
```

## 📚 Документація

- **[STORAGE_ARCHITECTURE.md](./STORAGE_ARCHITECTURE.md)** - Повна архітектура
- **Inline коментарі** - Докладні пояснення в коді

## 🎯 Наступні кроки

1. ✅ **Базова інтеграція** - Додайте в компонент
2. ✅ **Автозбереження** - Налаштуйте listeners
3. ✅ **Налаштування** - Зберігайте board/port
4. ✅ **UI** - Додайте індикатор збереження
5. ✅ **Тести** - Напишіть unit тести

## 🚀 Готово!

Система автоматично:
- 🔍 Визначить платформу
- 📦 Вибере правильний адаптер
- 💾 Збережатиме дані
- ⚡ Оптимізує продуктивність

**Просто використовуйте API - решту система зробить сама!** ✨

