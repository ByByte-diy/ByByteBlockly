import { describe, it, expect } from 'vitest';
import {
  WEB_SERIAL_REQUEST_NEW_PATH,
  isConnectableWebSerialPath,
  isValidDevicePortPath,
  webSerialPathForIndex,
} from '../constants/web-serial-paths.const';

describe('web-serial-paths.const', () => {
  it('rejects the connect placeholder', () => {
    expect(isConnectableWebSerialPath(WEB_SERIAL_REQUEST_NEW_PATH)).toBe(false);
    expect(isValidDevicePortPath(WEB_SERIAL_REQUEST_NEW_PATH)).toBe(false);
  });

  it('accepts authorized web serial paths', () => {
    expect(isConnectableWebSerialPath(webSerialPathForIndex(0))).toBe(true);
    expect(isConnectableWebSerialPath('web-serial-selected')).toBe(true);
  });

  it('accepts electron-style COM paths', () => {
    expect(isValidDevicePortPath('COM3')).toBe(true);
    expect(isConnectableWebSerialPath('COM3')).toBe(false);
  });
});
