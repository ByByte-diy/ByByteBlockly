---
name: bybyte-blockly
description: >-
  Maintain ByByteBlockly block definitions, platform packs, toolbox, boards,
  i18n, and category colours. Use when editing src/app/modules/blockly/,
  migrating blocks from www/, adding hardware/platform blocks, toolbox
  categories, board profiles, or Blockly colours.
---

# ByByte Blockly

Angular + Blockly 13 (Zelos). Legacy source: `www/blocs&generateurs/`, `www/toolbox/`, `www/js/boards.js`.

## Before changes

1. Read [requirements.md](data/requirements.md) — user constraints.
2. Check [structure.md](data/structure.md) — where code belongs.
3. Colours — [palette.md](data/palette.md) only; no `#hex` for categories.
4. Phase status — [migration-phases.md](data/migration-phases.md).

## Architecture

| Layer | Purpose |
|-------|---------|
| `definitions/` | Universal hardware blocks (motors, sensing, led, iot…) |
| `platforms/` | Platform Pack: robots, custom boards (Otto, ByByte, MRT, Escornabot) |
| `lib/` | BlockBuilder, BlockRegistry, ToolboxBuilder |
| `constants/` | Palette, icons, Blockly options |

**Platform Pack** (`IPlatformPack`): `registerBoards` → `registerProfiles` → `initializeCategories` → `initializeBlocks`. Register in `platforms/index.ts` → `initializePlatformPacks()`.

**Toolbox:** `ToolboxBuilder.forBoard({ boardId, userLevel })` filters blocks (`.setBoards()`), categories (`requiredBoardIds`, `requiredBoardTypes`, `minLevel`), prunes empty containers.

**Robot section:** two top-level containers — `CAT_ROBOT_OTTO` and `CAT_ROBOT_BYBYTE`. Use `hiddenBoardIds` (not `requiredBoardIds`) so general boards (nano, uno…) show both; Otto boards hide ByByte; ByByte boards hide Otto. Escornabot stays under Robot Otto.

## Add a block

```
definitions/<domain>/
  config.ts          # CATEGORY_NAME, CATEGORY_COLOR ← CATEGORY_PALETTE
  index.ts           # registerCategory + registerMany
  <sub>/<name>.blocks.ts
```

Or for a platform pack:

```
platforms/<pack>/
  config.ts, *.pack.ts, *.boards.ts, *.profiles.ts
  <group>/*.blocks.ts   # BYBYTE_BLOCKS / BIPED_BLOCKS arrays
```

1. Keep **legacy block type ID** from `www/`.
2. `BlockBuilder`: `.setCategory()`, `.setColor(CATEGORY_PALETTE.*)`, `.setLevel()`, `.setPlatforms()` / `.setBoards()`.
3. i18n keys → `en.ts` + `uk.ts`; icon → `category-icons.const.ts`.
4. `npm run build:web`.

## Add a platform pack (scaffold)

1. `*.boards.ts` + `*.profiles.ts` → `device-catalog.ts` (`PLATFORM_BOARDS` / `PLATFORM_PROFILES`).
2. Remove duplicates from `CORE_BOARDS` in `device-boards.const.ts`.
3. `*.pack.ts`: categories under `CAT_ROBOT` or a separate container.
4. `PlatformPackRegistry.register()` in `platforms/index.ts`.

## Colours

- Hue 0–360, fixed Blockly S/V (`category-colour.const.ts`).
- Single source: `CATEGORY_PALETTE` in `category-palette.const.ts`.
- `BLOCK_COLORS` — aliases only; do not add new hues in `blockly.constants.ts`.
- Toolbox: `IToolboxCategoryConfig.colour: CategoryHue`.

## Verify

```bash
npm run build:web
```

Do not remove `console.log` in `blockly-editor.component.ts` unless explicitly asked.

## References

- [requirements.md](data/requirements.md) — user rules
- [structure.md](data/structure.md) — directory tree
- [palette.md](data/palette.md) — hue table
- [migration-phases.md](data/migration-phases.md) — plans and status
- `.cursor/plans/hardware_blocks_migration_b9a1fc14.plan.md` — full migration plan
