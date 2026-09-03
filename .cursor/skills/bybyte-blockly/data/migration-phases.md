# Plans and status

## Completed plans

| Plan | Scope |
|------|-------|
| `general_block_categories_1d26dd3c` | 11 base categories (logic, math, variables…) |
| `variables_category_refactor_264fdd5d` | Variables refactor |
| `level_switcher_53e85834` | Beginner/Middle/Pro UI + `ToolboxLevelService` + minLevel filter |
| `hardware_blocks_migration_b9a1fc14` | Infra + hardware + platform packs (below) |

## Hardware migration — phases

| Phase | Status | Path |
|-------|--------|------|
| 0 Infra | Done | PlatformPackRegistry, ToolboxBuilder boardId/minLevel/prune |
| 1 Boards | Done | PLATFORM_BOARDS/PROFILES, Otto/MRT/ByByte boards |
| 2 Motors | Done | `definitions/motors/` |
| 3 Sensing | Done | `definitions/sensing/` (16 subcats) |
| 4 LED | Done | `definitions/led/` |
| 5 Displays | Done | `definitions/displays/` |
| 6 Audio | Done | `definitions/audio/` |
| 7 IoT | Done | `definitions/iot/` (ESP only) |
| 8 Communication+ | Done | keyboard, muvision |
| 9 Robot packs | Done | `platforms/otto/`, `escornabot/`, `mrt/` under CAT_ROBOT |
| 10 ByByte scaffold | Done | `platforms/bybyte/` — infra, no blocks yet |

## Post-migration fixes (important)

- Robot categories **without** `requiredBoardIds` (legacy CAT_OTTO on all AVR/ESP/MRT).
- ByByte `subOrder: 0`, Otto 1–5, Escornabot 6.
- Dropdown boards: dedup labels in `device-manager.service.ts`.
- Palette refactor: `category-palette.const.ts` (colorblind-friendly hues).

## Next steps

- Legacy ByByte blocks → `platforms/bybyte/*.blocks.ts` + `BYBYTE_BLOCKS`.
- Remaining legacy in `www/` — cross-check plan phase checklist.
