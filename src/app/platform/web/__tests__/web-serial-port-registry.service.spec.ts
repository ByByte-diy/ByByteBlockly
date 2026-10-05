import { describe, it, expect, beforeEach } from 'vitest';
import { WebSerialPortRegistry, WebSerialPortHandle } from '@platform/web/services/web-serial-port-registry.service';
import {
  WEB_SERIAL_SELECTED_PATH,
  webSerialPathForIndex,
} from '@platform/web/constants/web-serial-paths.const';

function mockPort(label: string): WebSerialPortHandle {
  const info =
    label === 'arduino'
      ? { usbVendorId: 0x2341, usbProductId: 0x0043 }
      : {};

  return {
    open: async () => undefined,
    close: async () => undefined,
    readable: null,
    writable: null,
    getInfo: () => info,
  };
}

describe('WebSerialPortRegistry', () => {
  let registry: WebSerialPortRegistry;

  beforeEach(() => {
    registry = new WebSerialPortRegistry();
  });

  it('registers and resolves ports by path', () => {
    const port = mockPort('arduino');
    registry.register(WEB_SERIAL_SELECTED_PATH, port);

    expect(registry.get(WEB_SERIAL_SELECTED_PATH)).toBe(port);
    expect(registry.has(WEB_SERIAL_SELECTED_PATH)).toBe(true);
    expect(registry.getDefault()).toBe(port);
    expect(registry.getDefaultPath()).toBe(WEB_SERIAL_SELECTED_PATH);
  });

  it('syncAuthorizedPorts assigns stable index paths', () => {
    const ports = [mockPort('a'), mockPort('b')];
    const infos = registry.syncAuthorizedPorts(ports);

    expect(infos).toHaveLength(2);
    expect(infos[0].path).toBe(webSerialPathForIndex(0));
    expect(infos[1].path).toBe(webSerialPathForIndex(1));
    expect(registry.get(webSerialPathForIndex(1))).toBe(ports[1]);
  });

  it('keeps web-serial-selected alias after sync when port is authorized', () => {
    const ports = [mockPort('a'), mockPort('b')];
    registry.register(WEB_SERIAL_SELECTED_PATH, ports[1]);
    registry.syncAuthorizedPorts(ports);

    expect(registry.resolve(WEB_SERIAL_SELECTED_PATH)).toBe(ports[1]);
    expect(registry.findPathForPort(ports[1])).toBe(webSerialPathForIndex(1));
  });

  it('resolve falls back to default for selected path', () => {
    const port = mockPort('only');
    registry.syncAuthorizedPorts([port]);

    expect(registry.resolve(WEB_SERIAL_SELECTED_PATH)).toBe(port);
  });

  it('builds friendly USB names from port info', () => {
    const infos = registry.syncAuthorizedPorts([mockPort('arduino')]);
    expect(infos[0].friendlyName).toContain('USB Device');
    expect(infos[0].vendorId).toBe(String(0x2341));
  });
});
