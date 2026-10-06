import { Injectable } from '@angular/core';
import { ISerialPortInfo } from '@core/models';
import { formatWebSerialDeviceLabel } from '@core/utils/serial-port-display.util';
import {
  WEB_SERIAL_SELECTED_PATH,
  webSerialPathForIndex,
} from '../constants/web-serial-paths.const';

/** Minimal Web Serial port handle used by the registry and upload flow. */
export interface WebSerialPortHandle {
  open(options: {
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: string;
  }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  getInfo?: () => { usbVendorId?: number; usbProductId?: number };
  setSignals?: (signals: {
    dataTerminalReady?: boolean;
    requestToSend?: boolean;
    /** STK500 / webserial-flasher alias for dataTerminalReady */
    dtr?: boolean;
    /** STK500 / webserial-flasher alias for requestToSend */
    rts?: boolean;
  }) => Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class WebSerialPortRegistry {
  private readonly portsByPath = new Map<string, WebSerialPortHandle>();
  private readonly pathByPort = new WeakMap<WebSerialPortHandle, string>();
  private lastSelectedPath: string | null = null;

  /** Registers or updates a path → port mapping. */
  register(path: string, port: WebSerialPortHandle): void {
    this.portsByPath.set(path, port);

    if (path === WEB_SERIAL_SELECTED_PATH) {
      this.lastSelectedPath = path;
      // Alias only — keep canonical indexed path in pathByPort when present.
      if (!this.pathByPort.has(port)) {
        this.pathByPort.set(port, path);
      }
      return;
    }

    this.pathByPort.set(port, path);
  }

  get(path: string): WebSerialPortHandle | undefined {
    return this.portsByPath.get(path);
  }

  has(path: string): boolean {
    return this.portsByPath.has(path);
  }

  /** Last explicitly selected port, or the first authorized indexed port. */
  getDefault(): WebSerialPortHandle | undefined {
    if (this.lastSelectedPath) {
      const selected = this.portsByPath.get(this.lastSelectedPath);
      if (selected) {
        return selected;
      }
    }

    return this.portsByPath.get(webSerialPathForIndex(0));
  }

  getDefaultPath(): string | undefined {
    if (this.lastSelectedPath && this.portsByPath.has(this.lastSelectedPath)) {
      return this.lastSelectedPath;
    }

    if (this.portsByPath.has(webSerialPathForIndex(0))) {
      return webSerialPathForIndex(0);
    }

    return undefined;
  }

  resolve(path: string): WebSerialPortHandle | undefined {
    const direct = this.portsByPath.get(path);
    if (direct) {
      return direct;
    }

    if (path === WEB_SERIAL_SELECTED_PATH) {
      return this.getDefault();
    }

    return undefined;
  }

  /**
   * Rebuilds index-based paths from `navigator.serial.getPorts()`.
   * Preserves `web-serial-selected` when it points at the same handle.
   */
  syncAuthorizedPorts(ports: WebSerialPortHandle[]): ISerialPortInfo[] {
    const selectedPort = this.portsByPath.get(WEB_SERIAL_SELECTED_PATH);

    for (const [path, handle] of [...this.portsByPath.entries()]) {
      if (path.startsWith('web-serial-') && path !== WEB_SERIAL_SELECTED_PATH) {
        this.portsByPath.delete(path);
        this.pathByPort.delete(handle);
      }
    }

    const infos: ISerialPortInfo[] = ports.map((port, index) => {
      const path = webSerialPathForIndex(index);
      this.register(path, port);

      if (selectedPort && port === selectedPort) {
        this.register(WEB_SERIAL_SELECTED_PATH, port);
      }

      return this.toPortInfo(path, port, index);
    });

    if (selectedPort && !ports.includes(selectedPort)) {
      this.register(WEB_SERIAL_SELECTED_PATH, selectedPort);
    }

    return infos;
  }

  findPathForPort(port: WebSerialPortHandle): string | undefined {
    return this.pathByPort.get(port);
  }

  clear(): void {
    this.portsByPath.clear();
    this.lastSelectedPath = null;
  }

  private toPortInfo(path: string, port: WebSerialPortHandle, index: number): ISerialPortInfo {
    const info = port.getInfo?.() ?? {};
    const vendorId = info.usbVendorId;
    const productId = info.usbProductId;

    return {
      path,
      friendlyName: formatWebSerialDeviceLabel(index, vendorId, productId),
      vendorId: vendorId != null ? String(vendorId) : undefined,
      productId: productId != null ? String(productId) : undefined,
    };
  }
}
