# Getting started

## Вимоги

- Node.js 22+
- Chrome або Edge (для web upload / Web Serial)
- USB-кабель до Arduino Uno/Nano (для upload)

## Запуск

```bash
git clone https://github.com/ByByte-diy/ByByteBlockly.git
cd ByByteBlockly
npm install
npm run start:web
```

Відкрийте **http://localhost:4200** у **Chrome або Edge** (не вбудований браузер IDE).

## Перший upload (web)

1. Створіть програму з блоків.
2. Header → **Плата та порт** → оберіть **Arduino Uno** або **Nano (New Bootloader)** для більшості клонів.
3. **Підключити пристрій** → у діалозі Chrome оберіть COM-порт → Connect.
4. Header → **Upload panel** → **Завантажити** (compile + upload).

Детальніше: [web-serial/user-guide.md](../web-serial/user-guide.md).

## Electron

```bash
npm run start:electron
```

Повний arduino-cli pipeline, COM-порти без діалогу браузера.

## Далі

- [Architecture](../architecture/README.md)
- [Compile & Upload](../compile-upload/README.md)
