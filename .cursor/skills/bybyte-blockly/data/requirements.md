# User requirements (Blockly)

## Process

- Migrate **by phase** per `.cursor/plans/`; do not mix unrelated changes.
- **Minimal diff** — only what the task needs.
- **Git commit / push** — only when explicitly requested.
- **Agent chat responses** — Ukrainian (user preference); skills/rules/docs — English.

## Blockly / toolbox

- Preserve **legacy block type IDs** when porting from `www/`.
- Robot: two containers `CAT_ROBOT_OTTO` / `CAT_ROBOT_BYBYTE`; `hiddenBoardIds` from `platforms/shared/robot-boards.const.ts` (general boards → both; Otto-only / ByByte-only boards → one family).
- Escornabot nested under Robot Otto.
- Beginner / Middle / Pro via `BlockLevelE` + `minLevel` (see `level_switcher` plan).
- Board dropdown: unique labels; hide alias `mrtx`, keep `uno_mrtx`.

## Colours

- Categories and blocks — **HSV hue** (number), not `#hex`.
- **Colorblind-friendly** palette: clear separation between adjacent categories.
- Hue changes — only in `category-palette.const.ts`.

## Code

- Match neighbouring file style (BlockBuilder, config, pack pattern).
- Comments — only for non-obvious legacy logic.
- Do not touch `console.log` in `blockly-editor.component.ts` without request.

## Build

- After changes: `npm run build:web`.
