# ByByte Blockly — Documentation

Центральний індекс документації для розробників і AI-агентів.

> Уся документація проєкту — **лише в `docs/`**. Корінь репо: [README.md](../README.md).

## Швидка навігація

| Розділ | Для кого | Зміст |
|--------|----------|--------|
| [Getting started](./getting-started/README.md) | Усі | Запуск web/electron |
| [Architecture](./architecture/README.md) | Розробники | Шари, DI, platform adapters |
| [**Compile & Upload**](./compile-upload/README.md) | Web AVR | WASM compile + STK500 upload |
| [Web Serial](./web-serial/README.md) | Користувачі + web dev | Підключення порту, upload |
| [Blockly](./blockly/README.md) | Block authors | Blocks, toolbox, mutators |
| [Storage](./storage/README.md) | Розробники | Workspace persistence |
| [i18n](./i18n/README.md) | Перекладачі | Angular + Blockly locales |
| [Testing](./testing/README.md) | QA / CI | Unit tests, manual checklist |
| [History](./history/README.md) | Архів | Angular migration notes |
| [Harness (AI)](./harness/README.md) | AI agents | Glossary, file map, conventions |

## Ключові команди

```bash
npm run start:web          # Chrome/Edge → http://localhost:4200
npm run start:electron     # Desktop (arduino-cli upload)
npm run prepare:wasm-avr   # WASM toolchain (web compile)
npm test
npm run build:web
```

## Платформи

| Можливість | Web (Chrome/Edge) | Electron |
|------------|-------------------|----------|
| Компіляція AVR (Uno/Nano) | WASM | arduino-cli |
| Upload Uno/Nano | Web Serial + STK500v1 | arduino-cli |
| Upload Mega/ESP | ❌ (поки) | ✅ |
| Список COM-портів | Після дозволу користувача | Автоматично |

## Для AI-агентів

Почніть з [AGENTS.md](./AGENTS.md) → [harness/README.md](./harness/README.md).

## Не документувати / не чіпати

- `www/` — legacy код, буде видалено
- `compilation/` — third-party Arduino libs (власні README vendor)
- `.cursor/` — skills/plans для IDE
