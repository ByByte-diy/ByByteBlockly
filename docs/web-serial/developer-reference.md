# Web Serial — developer reference

## Сервіси

| Сервіс | Файл | Роль |
|--------|------|------|
| `WebSerialService` | `web-serial.service.ts` | connect, list, open/close, `beginPortSelection()` |
| `WebSerialPortRegistry` | `web-serial-port-registry.service.ts` | path ↔ `SerialPort` handle |
| `WebUploaderService` | `web-uploader.service.ts` | upload через registry |

Singleton: `WebPlatformModule` — `WebSerialService` через `useExisting`.

## Port paths

`web-serial-paths.const.ts`:

- `web-serial-0`, `web-serial-1`, … — indexed authorized ports
- `web-serial-selected` — alias останнього вибору (не перезаписує indexed path у registry)
- `WEB_SERIAL_REQUEST_NEW_PATH` — trigger `requestPort()`

Helpers: `isValidDevicePortPath()`, `isConnectableWebSerialPath()`.

## User gesture

`requestPort()` **must** викликатися синхронно з click handler:

```typescript
// ✅
buttonClick → serialService.beginPortSelection() → requestPort()

// ❌
setTimeout / onload → requestPort() // SecurityError
```

`DeviceSelectorComponent` — кнопка «Підключити пристрій» без misleading fake dropdown.

## Registry rules

- `register(port, path)` — зберігає handle; alias `web-serial-selected` не замінює indexed entry
- `findPathForPort(port)` — для upload resolution
- `releaseForUpload()` — закриває активні reader/writer перед flash

## Upload port resolution

`WebUploaderService` **не** використовує `getDefault()` fallback — explicit path або error `ui.upload_port_not_found`.

## Error mapping

`web-serial-request-error.util.ts` — DOMException → i18n keys, включно з підказкою для Cursor browser.

## listPorts vs requestPort

| API | Поведінка |
|-----|-----------|
| `navigator.serial.getPorts()` | Лише раніше авторизовані |
| `navigator.serial.requestPort()` | Діалог вибору (user gesture) |

## Тести

`web-serial-port-registry.service.spec.ts` — register, alias, findPathForPort.
