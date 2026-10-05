# Blockly

Візуальне програмування, blocks, toolbox, code generation.

## Для розробників blocks

**Обов'язково** прочитати перед змінами:

`.cursor/skills/bybyte-blockly/SKILL.md`

### Коротко

- Каталог: `src/app/modules/blockly/`
- Кольори категорій: `CATEGORY_PALETTE` (hue), не hex
- Platform blocks → `platforms/<pack>/`
- Universal hardware → `definitions/<domain>/`
- Не змінювати legacy block type IDs
- Після змін: `npm run build:web`

## Документи

| Документ | Зміст |
|----------|--------|
| [toolbox-architecture.md](./toolbox-architecture.md) | Dynamic toolbox (Builder + Strategy) |
| [mutator-registry.md](./mutator-registry.md) | Централізована реєстрація mutators |
| [logic-math-blocks.md](./logic-math-blocks.md) | Logic/Math blocks migration |
| [auto-module-loader.md](./auto-module-loader.md) | Auto module loader pattern |
| [board-profiles-migration.md](./board-profiles-migration.md) | Board profiles у Blockly |

### Skill data (Cursor)

| Файл | Зміст |
|------|--------|
| `.cursor/skills/bybyte-blockly/data/structure.md` | Directory layout |
| `.cursor/skills/bybyte-blockly/data/palette.md` | Hue table |
| `.cursor/skills/bybyte-blockly/data/migration-phases.md` | Migration status |

## Cursor rule

`.cursor/rules/bybyte-blockly.mdc` — auto-applies для `src/app/modules/blockly/**`.

## Зв'язок з compile

Blockly → generator → `CodeEditorService.getEffectiveCode()` → `UploadManagerService` → compiler.
