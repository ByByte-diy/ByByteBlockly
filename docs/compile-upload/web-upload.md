# Web upload (STK500v1 + Web Serial)

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
4. Плата з `webSupported: true` (Uno/Nano phase 1)
5. Наявний `hexContent` у `UploadOptions`

## Потік upload

```
WebUploaderService.upload()
  → resolveAvrUploadProfile(boardId, fqbn)
  → resolve port handle (NO silent default fallback)
  → serialService.releaseForUpload()
  → flashAvrHex({ port, hexContent, profile, onProgress })
       → bootloader reset @ 1200 baud (DTR toggle)
       → createFlasherWebSerialTransport(port)
       → STK500 sync + program + verify
       → on STK500SyncError: retry alternate Nano baud
  → UploadResult { success, output, error? }
```

## Transport adapter (критично)

`createFlasherWebSerialTransport()` у `web-serial-port-adapter.util.ts`:

- **Не** обгортати native `SerialPort` у Proxy/spread — ламає `.open()` (`Illegal invocation`)
- Патчити лише об'єкт transport для flasher
- Мапінг `setSignals({ dtr, rts })` → `{ dataTerminalReady, requestToSend }`
- Native `port.setSignals.call(port, …)` для bootloader reset

## Bootloader reset

Перед sync: порт відкривається на **1200 baud**, коротка пауза, close — класичний AVR auto-reset через DTR.

Timeout sync: `WEB_AVR_COMMAND_TIMEOUT_MS` (2500 ms), до 4 спроб.

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
| `ui.upload_board_not_supported_web` | Mega/ESP на web |
| `ui.upload_stk500_sync_failed` | sync після retries |

## Файли

```
src/app/platform/web/services/web-uploader.service.ts
src/app/platform/web/utils/web-avr-stk500.util.ts
src/app/platform/web/utils/web-serial-port-adapter.util.ts
src/app/platform/web/utils/avr-upload-profile.util.ts
src/app/platform/web/constants/avr-upload-profiles.const.ts
```

## Тести

- `web-avr-stk500.util.spec.ts`
- `web-serial-port-adapter.util.spec.ts`
- `avr-upload-profile.util.spec.ts`
