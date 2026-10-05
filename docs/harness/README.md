# Harness (AI & maintainability)

Структура для швидкого онбордингу розробників і AI-агентів.

## Entry points

| Файл | Призначення |
|------|-------------|
| [../AGENTS.md](../AGENTS.md) | Короткий контекст для AI |
| [glossary.md](./glossary.md) | Терміни проєкту |
| [file-map.md](./file-map.md) | Карта файлів за доменами |
| [conventions.md](./conventions.md) | Правила коду та PR |

## Cursor integration

| Asset | Path |
|-------|------|
| Blockly skill | `.cursor/skills/bybyte-blockly/SKILL.md` |
| Blockly rule | `.cursor/rules/bybyte-blockly.mdc` |

## Рекомендований порядок читання (AI)

1. `docs/AGENTS.md`
2. `docs/compile-upload/README.md` — compile/upload tasks
3. `docs/harness/file-map.md` — знайти файли
4. Skill — Blockly blocks

## Оновлення документації

Canonical location: **`docs/`** only (+ root `README.md`).

При зміні compile/upload pipeline оновлюйте `docs/compile-upload/` та `docs/harness/file-map.md`.
