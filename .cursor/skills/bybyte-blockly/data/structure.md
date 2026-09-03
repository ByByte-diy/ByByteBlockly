# Structure: `src/app/modules/blockly/`

```
blockly/
├── constants/
│   ├── category-palette.const.ts   # ← single hue source
│   ├── category-colour.const.ts    # HSV helpers
│   ├── category-icons.const.ts
│   └── blockly.constants.ts        # DEFAULT_WORKSPACE_OPTIONS, BLOCK_COLORS aliases
├── definitions/                    # hardware + core categories
│   ├── index.ts                    # initializeAll + initializePlatformPacks()
│   ├── <domain>/
│   │   ├── config.ts
│   │   ├── index.ts
│   │   └── <sub>/*.blocks.ts
├── platforms/                      # Platform Packs
│   ├── platform-pack.types.ts
│   ├── platform-pack.registry.ts
│   ├── device-catalog.ts           # PLATFORM_BOARDS, PLATFORM_PROFILES
│   ├── index.ts
│   ├── otto/      biped, arms, quad, wheels, ninja
│   ├── escornabot/
│   ├── bybyte/    scaffold + future blocks
│   ├── mrt/
│   └── arduino-ext/
├── lib/
│   ├── builders/   block-builder.ts, toolbox-builder.ts
│   └── registry/   block-registry.ts
├── services/       blocks-loader, toolbox-level
└── components/     blockly-editor
```

## Device (boards)

```
device/constants/device-boards.const.ts   # CORE_BOARDS + PLATFORM_BOARDS
device/constants/device-profiles.const.ts # CORE + PLATFORM profiles
device/services/device-manager.service.ts # dropdown boards
```

## i18n

```
language/translations/en.ts, uk.ts   # BKY_* keys
```

## Legacy reference

```
www/blocs&generateurs/*.js
www/toolbox/toolbox_arduino_all*.xml
www/lang/Arduino_en.js
www/js/boards.js
```

## config.ts pattern

```typescript
import { CATEGORY_PALETTE } from "../../constants/category-palette.const";

export const CATEGORY_NAME = "%{BKY_CAT_*}";
export const CATEGORY_COLOR = CATEGORY_PALETTE.MOTORS;
export const CATEGORY_ORDER = 12;
export const TOOLBOX_LEVEL = BlockLevelE.INTERMEDIATE;
```

## pack pattern

```typescript
export const ottoPack: IPlatformPack = {
  id: "otto",
  supportedBoardIds: [...],
  registerBoards() { return Object.values(OTTO_BOARDS); },
  registerProfiles() { return Object.values(OTTO_PROFILES); },
  initializeCategories() { BlockRegistry.registerCategory(...); },
  initializeBlocks() { BlockRegistry.registerMany([...]); },
};
```
