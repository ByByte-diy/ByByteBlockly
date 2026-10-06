# Board profiles (web AVR upload)

Конфігурація: `src/app/platform/web/constants/avr-upload-profiles.const.ts`.

## Підтримувані board IDs (web upload)

`WEB_AVR_UPLOAD_BOARD_IDS`:

- `uno`
- `nano` (Old Bootloader, 57600)
- `nano_new` (New Bootloader, 115200)
- `nanooptiboot`
- `bybyte_nano`
- `mega`
- `bybyte_mega`

## Таблиця профілів

| boardId | FQBN | flasherBoardKey | Baud | Protocol |
|---------|------|-----------------|------|----------|
| uno | arduino:avr:uno | arduino-uno | 115200 | stk500v1 |
| nano | arduino:avr:nano:cpu=atmega328old | arduino-nano-old | 57600 | stk500v1 |
| nano_new | arduino:avr:nano:cpu=atmega328 | arduino-nano | 115200 | stk500v1 |
| nanooptiboot | arduino:avr:nano | arduino-nano | 115200 | stk500v1 |
| bybyte_nano | arduino:avr:nano | arduino-nano | 115200 | stk500v1 |
| mega | arduino:avr:mega | arduino-mega2560 | 115200 | stk500v2 |
| bybyte_mega | arduino:avr:mega | arduino-mega2560 | 115200 | stk500v2 |

## Resolve logic

`resolveAvrUploadProfile(boardId, fqbn)` у `avr-upload-profile.util.ts`:

1. Lookup by `boardId` in `AVR_UPLOAD_PROFILES_BY_BOARD_ID`
2. Fallback: FQBN suffix in `AVR_UPLOAD_PROFILES_BY_FQBN`
3. Default Uno-like profile or `AvrUploadUnsupportedError`

`getFlasherBoardConfig(profile)` → config для `webserial-flasher` `BOARDS` database.

## Compile vs upload scope

| Board | Web compile (WASM) | Web upload |
|-------|-------------------|------------|
| Uno | ✅ | ✅ |
| Nano (old/new) | ✅ | ✅ |
| Mega / ByByte Mega | ✅ (WASM) | ✅ STK500v2 @ 115200 |
| ESP32 | ✅ WASM | ✅ esptool-js |
| ESP8266 | ❌ (`compile_wasm_esp8266_desktop_only`) | ❌ |

## Користувачеві: який Nano обрати?

- **Nano (New Bootloader)** — більшість сучасних Nano та CH340-клонів
- **Nano (Old Bootloader)** — старі плати з Optiboot @ 57600

При невдачі sync — спробуйте інший профіль; код також автоматично перемикає baud.
