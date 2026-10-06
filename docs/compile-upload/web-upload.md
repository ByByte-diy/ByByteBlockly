# Web upload (STK500 + Web Serial)

## Сервіс

`WebUploaderService` — реалізація `IUploader` для Chrome/Edge.

Залежності:

- `WebSerialService` — open/close/release портів
- `WebSerialPortRegistry` — path → native `SerialPort` handle
- `webserial-flasher` — STK500 protocol
- `flashAvrHex()` — core flash logic

## Передумови

1. Secure context (`localhost` або HTTPS)
2. Web Serial API (`navigator.serial`)
3. Користувач обрав порт через **Підключити пристрій** (user gesture)
4. Плата з `webSupported: true` (Uno, Nano, Mega 2560 / ByByte Mega)
5. Наявний `hexContent` у `UploadOptions`

## Потік upload

```
WebUploaderService.upload()
  → resolveAvrUploadProfile(boardId, fqbn)
  → resolve port handle (NO silent default fallback)
  → serialService.releaseForUpload()
  → flashAvrHex({ port, hexContent, profile, onProgress })
       → Nano/328p: triggerBootloaderReset @ 1200 baud
       → Mega: triggerMegaBootloaderReset @ 115200 (DTR toggle + delay)
       → createFlasherWebSerialTransport(port)
       → STK500.bootload() or WiringSTK500v2.bootload() (Mega wiring subclass)
       → on STK500SyncError (v1 Nano): retry alternate baud → ui.upload_nano_baud_exhausted
  → UploadResult { success, output, error? }
```

## Transport adapter (критично)

`createFlasherWebSerialTransport()` у `web-serial-port-adapter.util.ts`:

- **Не** обгортати native `SerialPort` у Proxy/spread — ламає `.open()` (`Illegal invocation`)
- Патчити лише об'єкт transport для flasher
- Мапінг `setSignals({ dtr, rts })` → `{ dataTerminalReady, requestToSend }`
- Native `port.setSignals.call(port, …)` для bootloader reset

## Bootloader reset

| Board | Pre-sync reset |
|-------|----------------|
| Uno / Nano | `triggerBootloaderReset()` — 1200 baud, DTR via port open/close |
| Mega 2560 | `triggerMegaBootloaderReset()` — 115200, explicit DTR toggle, ~750 ms bootloader window |

Після reset: `stk.bootload()` робить ще один DTR reset через transport перед sign-on.

Timeout sync: 328p — `WEB_AVR_COMMAND_TIMEOUT_MS` (2500 ms); Mega — до 10 s. Nano v1: до 4 sync спроб + baud fallback.

## Nano auto-retry

`getUploadProfilesWithFallbacks()`:

- Old profile (57600) → спочатку 115200, потім 57600
- New profile (115200) → спочатку 115200, потім 57600 при sync failure

## Progress

`mapUploadPhasePercent(stkPercent)` → 10–95% upload phase.

`mapBootloadStatusToI18n(status)` → i18n keys для UI.

## Помилки (i18n keys)

| Key | Причина |
|-----|---------|
| `ui.web_serial_not_supported` | Firefox/Safari |
| `ui.web_serial_insecure_context` | не localhost/HTTPS |
| `ui.upload_select_board_port` | порт не обрано |
| `ui.upload_port_not_found` | handle відсутній у registry |
| `ui.upload_unsupported_board` | Leonardo / ESP / unknown board |
| `ui.upload_unsupported_protocol` | AVR109 / UPDI / Pico (not web yet) |
| `ui.upload_nano_baud_exhausted` | Nano: sync failed на 57600 і 115200 |

## Файли

```
src/app/platform/web/services/web-uploader.service.ts
src/app/platform/web/utils/web-avr-stk500.util.ts
src/app/platform/web/utils/stk500v2-wiring.util.ts
src/app/platform/web/utils/web-serial-port-adapter.util.ts
src/app/platform/web/utils/avr-upload-profile.util.ts
src/app/platform/web/constants/avr-upload-profiles.const.ts
```

## Тести

- `web-avr-stk500.util.spec.ts`
- `web-serial-port-adapter.util.spec.ts`
- `avr-upload-profile.util.spec.ts`
