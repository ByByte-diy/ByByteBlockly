import { describe, it, expect, vi } from 'vitest';
import {
  createFlasherWebSerialTransport,
  mapControlSignals,
} from '@platform/web/utils/web-serial-port-adapter.util';
import { WebSerialPortHandle } from '@platform/web/services/web-serial-port-registry.service';

describe('web-serial-port-adapter.util', () => {
  it('maps stk500 dtr/rts to Web Serial signal names', () => {
    expect(mapControlSignals({ dtr: false })).toEqual({ dataTerminalReady: false });
    expect(mapControlSignals({ rts: true })).toEqual({ requestToSend: true });
    expect(mapControlSignals({})).toBeNull();
  });

  it('maps dtr/rts on transport.setSignals without mutating the port', async () => {
    const open = vi.fn().mockResolvedValue(undefined);
    const nativeSetSignals = vi.fn(function (this: WebSerialPortHandle, signals) {
      expect(this).toBe(port);
      expect(signals).toEqual({ dataTerminalReady: false });
      return Promise.resolve();
    });

    const port: WebSerialPortHandle = {
      open,
      close: async () => undefined,
      readable: null,
      writable: null,
      setSignals: nativeSetSignals,
    };

    const transport = createFlasherWebSerialTransport(port);
    await transport.setSignals({ dtr: false });
    await port.open({ baudRate: 115200 });

    expect(nativeSetSignals).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith({ baudRate: 115200 });
    expect(port.setSignals).toBe(nativeSetSignals);
  });
});
