# Internationalization (i18n) Architecture

## 📁 Structure

```
src/
├── app/
│   └── modules/
│       └── i18n/
│           ├── i18n.service.ts              # Main coordinator
│           ├── blockly-i18n.service.ts      # Blockly-specific
│           ├── i18n.module.ts               # ngx-translate config
│           ├── i18n.const.ts                # Language definitions
│           └── components/
│               └── language-selector/       # UI component
│
└── assets/
    └── i18n/
        ├── en.json                          # Angular UI translations
        ├── uk.json                          # Angular UI translations
        └── blockly/
            ├── en.ts                        # Blockly translations
            └── uk.ts                        # Blockly translations
```

## 🎯 Separation of Concerns

### Angular (ngx-translate)
**Purpose**: UI elements (buttons, menus, dialogs, pages)

**Files**: `assets/i18n/*.json`

**Usage**:
```html
<!-- In templates -->
<button>{{ 'ui.btn_save' | translate }}</button>

<!-- In TypeScript -->
this.translate.instant('ui.btn_config');
```

### Blockly (Blockly.Msg)
**Purpose**: Block texts, categories, tooltips

**Files**: `assets/i18n/blockly/*.ts`

**Usage**:
```typescript
// In block definitions
.addStatementInput("DO", "%{BKY_GENERIC_SETUP}")
.setTooltip("%{BKY_GENERIC_SETUP_LOOP_TOOLTIP}")

// In config
export const CATEGORY_NAME = "CAT_GENERIC";
```

## 🔄 Language Change Flow

```
User selects language
  ↓
I18nService.setLanguage(lang)
  ↓
  ├─→ translate.use(lang)           // Angular UI
  ├─→ blocklyI18n.load(lang)        // Blockly blocks
  ├─→ dispatch 'language-changed'   // Event
  ├─→ storage.saveSettings()        // Persist
  └─→ update document.lang          // HTML attribute
  ↓
BlocklyEditorComponent listens to 'language-changed'
  ↓
  ├─→ Save workspace state
  ├─→ Update toolbox (new translations)
  ├─→ Clear workspace
  └─→ Reload workspace (blocks re-created)
```

## 🚀 Services

### I18nService
**Responsibility**: Main coordinator for both Angular and Blockly

**Methods**:
- `initialize()` - Load saved/browser language
- `setLanguage(lang)` - Switch language for both systems
- `getCurrentLanguage()` - Get active language

### BlocklyI18nService
**Responsibility**: Load Blockly.Msg translations

**Methods**:
- `load(lang)` - Dynamically import Blockly translations
- `getCurrentLanguage()` - Get active Blockly language

## 📝 Adding a New Language

### 1. Create Angular translations
**File**: `src/assets/i18n/de.json`
```json
{
  "ui": {
    "btn_save": "Speichern",
    ...
  }
}
```

### 2. Create Blockly translations
**File**: `src/assets/i18n/blockly/de.ts`
```typescript
import * as Blockly from 'blockly';

Blockly.Msg['CAT_GENERIC'] = '⚙️ Allgemein';
Blockly.Msg['GENERIC_SETUP'] = '⚙️ Einrichtung';
...

export default Blockly.Msg;
```

### 3. Register in constants
**File**: `src/app/modules/i18n/i18n.const.ts`
```typescript
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'de', name: 'Deutsch' }, // Add this
];
```

## ⚠️ Important Rules

### ✅ DO
- Separate Angular UI and Blockly translations
- Use ngx-translate for Angular components
- Use Blockly.Msg for block texts
- Keep translation keys consistent
- Test language switching

### ❌ DON'T
- Mix Angular and Blockly translations in one file
- Use Angular pipes in Blockly JSON
- Store Blockly translations in Angular JSON
- Forget to reload workspace after language change
- Hardcode translations in TypeScript

## 🔍 Troubleshooting

### Categories not translating
- Check `CATEGORY_NAME` in config uses key like `"CAT_GENERIC"`
- Verify `Blockly.Msg['CAT_GENERIC']` is set
- Ensure `ToolboxBuilder` reads from `Blockly.Msg[catName]`

### Blocks not updating
- Workspace must be reloaded after language change
- Check `BlocklyEditorComponent` listens to `'language-changed'`
- Verify serialization/deserialization works

### UI not translating
- Check ngx-translate is properly configured
- Verify JSON files are in `assets/i18n/`
- Ensure `TranslateModule` is imported

## 📚 References

- [ngx-translate Documentation](https://github.com/ngx-translate/core)
- [Blockly Localization Guide](https://developers.google.com/blockly/guides/configure/web/translations)
