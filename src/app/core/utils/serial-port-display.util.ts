import { ISerialPortInfo } from '@core/models';
import {
  USB_SERIAL_DEVICE_BY_VID_PID,
  USB_SERIAL_VENDOR_NAMES,
} from '@core/constants/usb-serial-devices.const';

const COM_PORT_RE = /^COM\d+$/i;
const TTY_PORT_RE = /^\/dev\/(?:tty|cu)[\w.-]+$/i;

/** True when `path` is an OS serial device name (COM*, /dev/tty*, /dev/cu*). */
export function isOsSerialPortPath(path: string | undefined): boolean {
  const value = path?.trim();
  if (!value) {
    return false;
  }
  return COM_PORT_RE.test(value) || TTY_PORT_RE.test(value);
}

function isVidPidUsbLabel(label: string): boolean {
  return /^USB Device \(\d+:/.test(label.trim());
}

function appendManufacturer(label: string, manufacturer?: string): string {
  const name = manufacturer?.trim();
  if (!name || label.toLowerCase().includes(name.toLowerCase())) {
    return label;
  }
  return `${label} (${name})`;
}

/** Extract COM port from Windows PnP id when present. */
export function extractComPortFromPnpId(pnpId: string | undefined): string | undefined {
  const match = pnpId?.match(/COM\d+/i);
  return match ? match[0].toUpperCase() : undefined;
}

function normalizeUsbId(value: number | string | undefined): number | undefined {
  if (value == null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  const trimmed = value.trim().toLowerCase();
  const parsed = trimmed.startsWith('0x') ? Number.parseInt(trimmed, 16) : Number.parseInt(trimmed, 16);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function vidPidKey(vendorId: number, productId: number): string {
  return `${vendorId.toString(16).padStart(4, '0')}:${productId.toString(16).padStart(4, '0')}`;
}

/** Resolve a friendly name from USB VID/PID when OS port path is unavailable (Web Serial). */
export function resolveUsbSerialDeviceName(
  vendorId?: number | string,
  productId?: number | string,
): string | undefined {
  const vid = normalizeUsbId(vendorId);
  const pid = normalizeUsbId(productId);

  if (vid != null && pid != null) {
    const exact = USB_SERIAL_DEVICE_BY_VID_PID[vidPidKey(vid, pid)];
    if (exact) {
      return exact;
    }
  }

  if (vid != null) {
    const vendorHex = vid.toString(16).padStart(4, '0');
    return USB_SERIAL_VENDOR_NAMES[vendorHex];
  }

  return undefined;
}

/** Human-readable label for a browser-authorized Web Serial port (no OS path available). */
export function formatWebSerialDeviceLabel(
  deviceIndex: number,
  vendorId?: number | string,
  productId?: number | string,
): string {
  const resolved = resolveUsbSerialDeviceName(vendorId, productId);
  if (resolved) {
    return `${resolved} #${deviceIndex + 1}`;
  }
  return `Serial Device ${deviceIndex + 1}`;
}

/**
 * Prefer COM/tty path for UI; avoid raw USB VID:PID when several identical devices are connected.
 */
export function formatSerialPortLabel(
  port: Pick<
    ISerialPortInfo,
    'path' | 'friendlyName' | 'manufacturer' | 'pnpId' | 'vendorId' | 'productId'
  >,
): string {
  const path = port.path?.trim();

  if (path && isOsSerialPortPath(path)) {
    return appendManufacturer(path, port.manufacturer);
  }

  const comFromPnp = extractComPortFromPnpId(port.pnpId);
  if (comFromPnp) {
    return appendManufacturer(comFromPnp, port.manufacturer);
  }

  const webSerialIndex = port.path?.match(/^web-serial-(\d+)$/)?.[1];
  const usbName = resolveUsbSerialDeviceName(port.vendorId, port.productId);
  if (usbName) {
    return webSerialIndex != null ? `${usbName} #${Number(webSerialIndex) + 1}` : usbName;
  }

  const friendlyName = port.friendlyName?.trim();
  if (friendlyName && !isVidPidUsbLabel(friendlyName)) {
    return friendlyName;
  }

  if (port.manufacturer?.trim()) {
    return port.manufacturer.trim();
  }

  if (path && !path.startsWith('web-serial') && path !== 'request-new-port') {
    return path;
  }

  return friendlyName || path || 'Serial port';
}
