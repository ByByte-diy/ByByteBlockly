# Conventions

## Architecture

- Бізнес-модулі залежать від `@core/interfaces`, не від `platform/*` напряму.
- Platform-specific code лише в `src/app/platform/web|electron/`.

## Compile / Upload

- Web upload: завжди `hexContent`, never assume file path.
- Не fallback на default serial port у upload.
- Native `SerialPort` — не wrap у Proxy/spread.
- STK500 transport: map `dtr` → `dataTerminalReady`.

## UI / i18n

- User-facing strings — i18n keys (`ui.*`), не hardcoded у сервісах де можливо.
- Upload progress messages — keys з `mapBootloadStatusToI18n`.

## Blockly

- Читати `.cursor/skills/bybyte-blockly/SKILL.md` перед змінами blocks.
- Category colours: `CATEGORY_PALETTE` hue, not `#hex`.

## Git

- Commit лише за явним запитом користувача.

## Tests

- Vitest: `npm test`
- Нові utils (profile, stk500, registry) — unit tests поруч у `__tests__/`

## Docs

- Canonical docs: `docs/`
- Оновлювати harness file-map при нових ключових файлах
