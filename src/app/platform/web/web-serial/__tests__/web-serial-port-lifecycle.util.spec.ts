import { describe, expect, it, vi } from 'vitest';
import {
  ensureWebSerialPortClosed,
  isWebSerialPortLocked,
  prepareWebSerialPortForUpload,
  waitForWebSerialPortUnlock,
} from '../utils/web-serial-port-lifecycle.util';
import { WebSerialPortHandle } from '../services/web-serial-port-registry.service';

function mockPort(overrides: Partial<WebSerialPortHandle> = {}): WebSerialPortHandle {
  return {
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    readable: null,
    writable: null,
    ...overrides,
  };
}

describe('web-serial-port-lifecycle.util', () => {
  it('detects locked readable/writable streams', () => {
    const port = mockPort({
      readable: { locked: true } as ReadableStream<Uint8Array>,
    });
    expect(isWebSerialPortLocked(port)).toBe(true);
  });

  it('returns immediately when the port is already unlocked', async () => {
    const port = mockPort();
    await waitForWebSerialPortUnlock(port, 500);
    expect(isWebSerialPortLocked(port)).toBe(false);
  });

  it('closes an open port after unlock', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const port = mockPort({
      close,
      readable: {} as ReadableStream<Uint8Array>,
      writable: {} as WritableStream<Uint8Array>,
    });

    await ensureWebSerialPortClosed(port);
    expect(close).toHaveBeenCalledOnce();
  });

  it('prepareWebSerialPortForUpload releases monitor then closes port', async () => {
    const close = vi.fn().mockResolvedValue(undefined);
    const port = mockPort({
      close,
      readable: {} as ReadableStream<Uint8Array>,
      writable: {} as WritableStream<Uint8Array>,
    });
    const releaseMonitor = vi.fn().mockResolvedValue(true);

    await prepareWebSerialPortForUpload(port, releaseMonitor);

    expect(releaseMonitor).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });
});
