import { describe, it, expect } from 'vitest';
import {
  extractComPortFromPnpId,
  formatSerialPortLabel,
  formatWebSerialDeviceLabel,
  isOsSerialPortPath,
  resolveUsbSerialDeviceName,
} from '@core/utils/serial-port-display.util';

describe('serial-port-display.util', () => {
  it('detects OS serial paths', () => {
    expect(isOsSerialPortPath('COM3')).toBe(true);
    expect(isOsSerialPortPath('/dev/ttyUSB0')).toBe(true);
    expect(isOsSerialPortPath('/dev/cu.usbmodem14101')).toBe(true);
    expect(isOsSerialPortPath('web-serial-0')).toBe(false);
  });

  it('prefers COM path over VID label', () => {
    expect(
      formatSerialPortLabel({
        path: 'COM5',
        friendlyName: 'USB Device (9025:67)',
        manufacturer: 'Arduino LLC',
      }),
    ).toBe('COM5 (Arduino LLC)');
  });

  it('prefers tty device on Linux', () => {
    expect(
      formatSerialPortLabel({
        path: '/dev/ttyACM0',
        friendlyName: 'USB Device (9025:67)',
      }),
    ).toBe('/dev/ttyACM0');
  });

  it('extracts COM from pnpId when path is missing', () => {
    expect(
      formatSerialPortLabel({
        path: '',
        pnpId: 'USB\\VID_2341&PID_0043\\COM7',
        friendlyName: 'USB Serial Device',
      }),
    ).toBe('COM7');
  });

  it('maps known Arduino VID/PID to a friendly name', () => {
    expect(resolveUsbSerialDeviceName(0x2341, 0x0043)).toBe('Arduino Uno');
    expect(formatWebSerialDeviceLabel(0, 0x2341, 0x0043)).toBe('Arduino Uno #1');
    expect(formatWebSerialDeviceLabel(1, 0x1a86, 0x7523)).toBe('CH340 USB-Serial #2');
  });

  it('falls back to Serial Device when VID/PID is unknown', () => {
    expect(formatWebSerialDeviceLabel(0)).toBe('Serial Device 1');
    expect(
      formatSerialPortLabel({
        path: 'web-serial-0',
        friendlyName: 'Serial Device 1',
      }),
    ).toBe('Serial Device 1');
  });

  it('extractComPortFromPnpId is case-insensitive', () => {
    expect(extractComPortFromPnpId('foo\\COM12\\bar')).toBe('COM12');
  });
});
