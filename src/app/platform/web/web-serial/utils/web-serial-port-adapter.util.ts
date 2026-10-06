import { WebSerialTransport } from 'webserial-flasher';
import { WebSerialPortHandle } from '../services/web-serial-port-registry.service';

/** STK500 / webserial-flasher aliases and native Web Serial signal names. */
export interface WebSerialControlSignals {
  dataTerminalReady?: boolean;
  requestToSend?: boolean;
  dtr?: boolean;
  rts?: boolean;
}

/**
 * webserial-flasher toggles `{ dtr, rts }`, but Web Serial API expects
 * `{ dataTerminalReady, requestToSend }`.
 *
 * Patches transport.setSignals only — never wrap/bind the native SerialPort
 * (Proxy and spread break open(); bind causes Illegal invocation).
 */
export function createFlasherWebSerialTransport(port: WebSerialPortHandle): WebSerialTransport {
  const transport = new WebSerialTransport(port);

  if (!port.setSignals) {
    return transport;
  }

  const nativeSetSignals = port.setSignals;

  transport.setSignals = async (signals: WebSerialControlSignals) => {
    const mapped = mapControlSignals(signals);
    if (!mapped) {
      return;
    }
    await nativeSetSignals.call(port, mapped);
  };

  return transport;
}

/** @deprecated Use {@link createFlasherWebSerialTransport} — keeps native port untouched. */
export function adaptWebSerialPortForFlasher(port: WebSerialPortHandle): WebSerialPortHandle {
  return port;
}

export function mapControlSignals(
  signals: WebSerialControlSignals,
): { dataTerminalReady?: boolean; requestToSend?: boolean } | null {
  const mapped: { dataTerminalReady?: boolean; requestToSend?: boolean } = {};

  if (signals.dataTerminalReady !== undefined) {
    mapped.dataTerminalReady = signals.dataTerminalReady;
  }
  if (signals.requestToSend !== undefined) {
    mapped.requestToSend = signals.requestToSend;
  }
  if (signals.dtr !== undefined) {
    mapped.dataTerminalReady = signals.dtr;
  }
  if (signals.rts !== undefined) {
    mapped.requestToSend = signals.rts;
  }

  return Object.keys(mapped).length > 0 ? mapped : null;
}
