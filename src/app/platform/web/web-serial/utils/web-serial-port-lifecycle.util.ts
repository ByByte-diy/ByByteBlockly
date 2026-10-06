import { WebSerialPortHandle } from '../services/web-serial-port-registry.service';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** True when readable/writable streams are still locked by an active reader/writer. */
export function isWebSerialPortLocked(port: WebSerialPortHandle): boolean {
  return Boolean(
    (port.readable && port.readable.locked) || (port.writable && port.writable.locked),
  );
}

/** Wait until Web Serial stream locks are released (e.g. after monitor reader cancel). */
export async function waitForWebSerialPortUnlock(
  port: WebSerialPortHandle,
  maxWaitMs = 3000,
): Promise<void> {
  const deadline = Date.now() + maxWaitMs;
  while (isWebSerialPortLocked(port) && Date.now() < deadline) {
    await delay(50);
  }
}

/**
 * Closes an authorized Web Serial port if it is open.
 * Waits for monitor/upload readers to release locks before calling close().
 */
export async function ensureWebSerialPortClosed(
  port: WebSerialPortHandle,
  options?: { maxWaitMs?: number },
): Promise<void> {
  const maxWaitMs = options?.maxWaitMs ?? 3000;
  await waitForWebSerialPortUnlock(port, maxWaitMs);

  if (!port.readable && !port.writable) {
    return;
  }

  try {
    await port.close();
  } catch {
    await waitForWebSerialPortUnlock(port, 1000);
    await port.close().catch(() => undefined);
  }

  await waitForWebSerialPortUnlock(port, 500);
}

/**
 * Release the serial monitor (if any) and ensure the upload port handle is closed.
 * Call once before AVR or ESP32 firmware upload.
 */
export async function prepareWebSerialPortForUpload(
  port: WebSerialPortHandle,
  releaseMonitor: () => Promise<boolean>,
): Promise<void> {
  await releaseMonitor();
  await ensureWebSerialPortClosed(port);
}
