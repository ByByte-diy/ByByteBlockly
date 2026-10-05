# Web Serial — інструкція користувача

## Підтримка браузерів

| Браузер | Підтримка |
|---------|-----------|
| Chrome 89+ | ✅ |
| Edge 89+ | ✅ |
| Opera 75+ | ✅ |
| Firefox | ❌ |
| Safari | ❌ |
| Cursor embedded browser | ❌ — використовуйте Chrome/Edge на localhost |

## Безпека

Web Serial API потребує:

1. **HTTPS** або **`localhost`**
2. **Дозвіл користувача** на кожен новий пристрій
3. **Клік** (user gesture) для першого підключення

## Підключення Arduino

1. Підключіть плату USB-каbleм (data, не лише зарядка).
2. Header → **Плата та порт** → оберіть плату (Uno / Nano New / Nano Old).
3. Натисніть **Підключити пристрій**.
4. У діалозі Chrome оберіть COM-порт → **Connect**.
5. Статус → **Connected**.

> Список може бути порожнім до першого Connect — це нормально для Web Serial.

## Завантаження прошивки

1. Плата та порт обрані й підключені.
2. Upload panel → **Завантажити** (compile + upload).

Деталі pipeline: [compile-upload/README.md](../compile-upload/README.md).

### Nano: old vs new bootloader

| Профіль | Baud | Коли |
|---------|------|------|
| Nano (Old Bootloader) | 57600 | Старі Nano |
| Nano (New Bootloader) | 115200 | Більшість сучасних Nano / CH340 |

### Serial Monitor

Закрийте Serial Monitor (Arduino IDE тощо) на тому ж порту перед upload.

## Типові помилки

| Помилка | Рішення |
|---------|---------|
| Web Serial not supported | Chrome/Edge або Electron |
| No serial port selected | Connect → оберіть порт |
| Port already open | Закрийте інші вкладки / IDE |
| Device disconnected | Перевірте USB, Connect знову |
| Sync failed | Інший профіль Nano; закрити Serial Monitor |

Повний список: [compile-upload/troubleshooting.md](../compile-upload/troubleshooting.md).

## Web vs Electron

| | Web | Electron |
|---|-----|----------|
| Список COM без діалогу | ❌ | ✅ |
| Дозвіл браузера | ✅ | ❌ |
| Без установки | ✅ | ❌ |

## Ресурси

- [MDN Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [Can I Use](https://caniuse.com/web-serial)
