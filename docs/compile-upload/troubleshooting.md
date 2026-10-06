# Compile & Upload — troubleshooting

## Web Serial / браузер

| Симптом | Рішення |
|---------|---------|
| Немає діалогу вибору порту | Chrome/Edge, не Cursor embedded browser; клік має бути user gesture |
| `web_serial_not_supported` | Firefox/Safari — використайте Chrome/Edge |
| `web_serial_insecure_context` | Відкрийте через `https://` або `http://localhost:4200` |
| Порт зник після reload | Знову **Підключити пристрій** (дозволи зберігаються, але UI може потребувати reconnect) |

## Upload sync / STK500

| Симптом | Рішення |
|---------|---------|
| Sync failed / timeout | Перевірте USB-кабель (data, не charge-only); закрийте Serial Monitor в Arduino IDE |
| Nano не відповідає | Спробуйте **New** ↔ **Old** bootloader у списку плат |
| Mega `Signature mismatch … got [0x00, 0x00, 0x00]` | Wiring bootloader — fixed in app (skip broken signature parse); оновіть dev server |
| Mega `command 0x4 failed, status=0xc0` | Wiring bootloader не підтримує SET_DEVICE_DESCRIPTOR — fixed in app |
| Upload на wrong device | Переконайтесь, що обрано правильний COM у діалозі Chrome |
| `setSignals` / `port.open is not a function` | Regression — див. transport adapter docs; не wrap native SerialPort |

## Compile (WASM)

| Симптом | Рішення |
|---------|---------|
| stock npm manifest | `npm run prepare:wasm-avr`, restart dev server |
| Unsupported board | Web compile: AVR 328p + Mega; ESP — Electron |
| Out of flash | Спростити sketch; WASM target = Uno/Nano flash size |

## Upload-only без compile

Помилка `ui.upload_compile_first` — спочатку **Компілювати** або **Завантажити** (full pipeline).

## Build log

Upload failures append `--- Upload failed ---` з output STK500. Compile errors — у верхній частині build log panel.

## Manual QA checklist

- [ ] Uno: compile + upload on localhost Chrome
- [ ] Nano New: compile + upload
- [ ] Nano Old (або clone): upload з auto-retry baud
- [ ] Upload-only після successful compile
- [ ] Error when port not selected
- [ ] Device selector: connect → status Connected
