/** Synthetic path for the port chosen via `requestPort()`. */
export const WEB_SERIAL_SELECTED_PATH = 'web-serial-selected';

/** Placeholder entry prompting the user to pick a device. */
export const WEB_SERIAL_REQUEST_NEW_PATH = 'request-new-port';

/** Builds a stable path for an authorized port index from `navigator.serial.getPorts()`. */
export function webSerialPathForIndex(index: number): string {
  return `web-serial-${index}`;
}

export function isWebSerialSyntheticPath(path: string): boolean {
  return (
    path === WEB_SERIAL_SELECTED_PATH ||
    path === WEB_SERIAL_REQUEST_NEW_PATH ||
    path.startsWith('web-serial-')
  );
}

/** True when the path refers to an authorized Web Serial device (not the connect placeholder). */
export function isConnectableWebSerialPath(path: string | undefined | null): boolean {
  if (!path || path === WEB_SERIAL_REQUEST_NEW_PATH) {
    return false;
  }
  return path === WEB_SERIAL_SELECTED_PATH || path.startsWith('web-serial-');
}

/** Valid port for compile/upload — Web Serial paths or Electron COM/tty paths. */
export function isValidDevicePortPath(path: string | undefined | null): boolean {
  if (!path || path === WEB_SERIAL_REQUEST_NEW_PATH) {
    return false;
  }
  if (path.startsWith('web-serial') || path === WEB_SERIAL_SELECTED_PATH) {
    return isConnectableWebSerialPath(path);
  }
  return path.trim().length > 0;
}
