/** Known USB serial devices for port labels (Web Serial has no COM/tty path). Keys: `vvvv:pppp` lowercase hex. */
export const USB_SERIAL_DEVICE_BY_VID_PID: Readonly<Record<string, string>> = {
  // Arduino LLC / Arduino SA (0x2341)
  '2341:0043': 'Arduino Uno',
  '2341:0001': 'Arduino Uno',
  '2341:0243': 'Arduino Uno',
  '2341:0042': 'Arduino Mega 2560',
  '2341:0010': 'Arduino Mega 2560',
  '2341:0036': 'Arduino Leonardo',
  '2341:8036': 'Arduino Leonardo (bootloader)',
  '2341:0037': 'Arduino Micro',
  '2341:003f': 'Arduino Nano Every',
  '2341:0050': 'Arduino Mega ADK',
  '2341:0078': 'Arduino Zero',
  '2341:804d': 'Arduino Zero (bootloader)',
  '2341:0058': 'Arduino Nano RP2040',
  // WCH CH340 — common on Nano clones
  '1a86:7523': 'CH340 USB-Serial',
  '1a86:5523': 'CH341 USB-Serial',
  // Silicon Labs CP210x
  '10c4:ea60': 'CP2102 USB-Serial',
  '10c4:ea70': 'CP2105 USB-Serial',
  // FTDI
  '0403:6001': 'FT232 USB-Serial',
  '0403:6015': 'FT231X USB-Serial',
};

/** Fallback when PID is unknown but VID matches a known vendor. */
export const USB_SERIAL_VENDOR_NAMES: Readonly<Record<string, string>> = {
  '2341': 'Arduino',
  '1a86': 'CH340',
  '10c4': 'Silicon Labs',
  '0403': 'FTDI',
};
