# Testing

## Unit tests (Vitest)

```bash
npm test
```

### Compile / Upload coverage

| Spec | Область |
|------|---------|
| `upload-manager.service.spec.ts` | Orchestration |
| `web-avr-stk500.util.spec.ts` | STK500, Nano fallback |
| `web-avr-wasm.util.spec.ts` | WASM helpers |
| `web-serial-port-registry.service.spec.ts` | Port registry |
| `web-serial-port-adapter.util.spec.ts` | Transport adapter |
| `avr-upload-profile.util.spec.ts` | Board profiles |

## Manual QA — Web upload

- [ ] Chrome localhost:4200
- [ ] Connect device (user gesture)
- [ ] Uno: compile + upload
- [ ] Nano New: compile + upload
- [ ] Upload-only after compile
- [ ] Error without port selected
- [ ] Serial Monitor closed during upload

Деталі: [compile-upload/troubleshooting.md](../compile-upload/troubleshooting.md).

## Manual QA — Electron & UI

Повний чеклист UI, Blockly, DevTools: [manual-checklist.md](./manual-checklist.md).

```bash
npm run start:electron
```

## CI note

Якщо `npm test` падає локально — перевірте версію Node (22+) та Vitest config.
