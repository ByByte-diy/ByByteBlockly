# Storage

Універсальна система збереження workspace та налаштувань з автовибором адаптера за платформою.

## Документи

| Документ | Зміст |
|----------|--------|
| [architecture.md](./architecture.md) | Повна архітектура, діаграми, API |
| [quickstart.md](./quickstart.md) | Швидкий старт для розробників |
| [summary.md](./summary.md) | Короткий огляд компонентів |
| [changelog.md](./changelog.md) | Історія змін storage subsystem |

## Платформи

| Платформа | Адаптер | Примітка |
|-----------|---------|----------|
| Web | LocalStorage | ~5–10 MB |
| Electron | FileSystem | Необмежено |

## Interface

`IFileSystem` / `WorkspaceStorageService` — див. [architecture.md](./architecture.md).

Platform adapters: [architecture/platform-adapters.md](../architecture/platform-adapters.md).
