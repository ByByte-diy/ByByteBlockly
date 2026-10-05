# Internationalization (i18n)

## Structure

```
src/app/modules/language/
  i18n.service.ts           # Main coordinator
  blockly-i18n.service.ts   # Blockly-specific
  i18n.module.ts            # ngx-translate config
  i18n.const.ts             # Language definitions
  components/language-selector/

src/assets/i18n/
  en.json, uk.json          # Angular UI
  blockly/en.ts, blockly/uk.ts  # Blockly.Msg
```

## Separation of concerns

### Angular (ngx-translate)

UI: buttons, menus, upload errors, theme labels.

Files: `assets/i18n/*.json`

```html
<button>{{ 'ui.btn_save' | translate }}</button>
```

### Blockly (Blockly.Msg)

Block texts, categories, tooltips.

Files: `assets/i18n/blockly/*.ts`

## Language change flow

```
User selects language
  → I18nService.setLanguage(lang)
  → translate.use(lang) + blocklyI18n.load(lang)
  → 'language-changed' event
  → BlocklyEditor reloads toolbox/workspace
```

## Adding a new language

1. `src/assets/i18n/<code>.json` — Angular UI
2. `src/assets/i18n/blockly/<code>.ts` — Blockly.Msg
3. Register in `src/app/modules/language/i18n.const.ts`

## Rules

- Do not mix Angular JSON and Blockly TS in one file
- Upload/Web Serial errors use `ui.*` keys in JSON
- After language switch, workspace must reload for block labels

## References

- [ngx-translate](https://github.com/ngx-translate/core)
- [Blockly translations](https://developers.google.com/blockly/guides/configure/web/translations)
