import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ISerial } from '@core/interfaces';
import { ISerialPortInfo, ISerialPortOptions, ISerialConnectionStatus } from '@core/models';
import {
  WEB_SERIAL_REQUEST_NEW_PATH,
  WEB_SERIAL_SELECTED_PATH,
} from '../constants/web-serial-paths.const';
import { ARDUINO_USB_VENDOR_IDS } from 'webserial-flasher';
import {
  WebSerialPortHandle,
  WebSerialPortRegistry,
} from './web-serial-port-registry.service';
import {
  WebSerialRequestError,
  mapWebSerialRequestError,
} from '../utils/web-serial-request-error.util';
import { isSecureContextForWebSerial } from '../utils/web-serial-support.util';
import { formatWebSerialDeviceLabel } from '@core/utils/serial-port-display.util';
import { ensureWebSerialPortClosed } from '../utils/web-serial-port-lifecycle.util';

/** Subset of `navigator.serial` used by this service (DOM lib may omit Web Serial types). */
interface NavigatorSerialApi {
  getPorts(): Promise<WebSerialPortHandle[]>;
  requestPort(options?: {
    filters?: Array<{ usbVendorId?: number; usbProductId?: number }>;
  }): Promise<WebSerialPortHandle>;
}

/**
 * Web implementation of the serial port service
 * Uses Web Serial API (available in Chrome/Edge)
 */
@Injectable()
export class WebSerialService implements ISerial {
  private port: WebSerialPortHandle | null = null;
  private activePath: string | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private dataSubject = new Subject<string>();
  private statusSubject = new BehaviorSubject<ISerialConnectionStatus>(ISerialConnectionStatus.DISCONNECTED);

  constructor(private readonly portRegistry: WebSerialPortRegistry) {}

  /**
   * Get list of available serial ports
   * Web Serial API returns only previously authorized ports
   */
  listPorts(): Promise<ISerialPortInfo[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasWebSerialApi()) {
        reject(new Error('Web Serial API not supported in this browser. Use Chrome, Edge, or Opera.'));
        return;
      }

      try {
        const ports = await this.getNavigatorSerial().getPorts();
        const portInfos = this.portRegistry.syncAuthorizedPorts(ports);

        if (portInfos.length === 0) {
          resolve([
            {
              path: WEB_SERIAL_REQUEST_NEW_PATH,
              friendlyName: 'Click "Connect" to select a device...',
            },
          ]);
          return;
        }

        resolve(portInfos);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Starts port selection synchronously inside a click handler (preserves user gesture).
   * Do not `await` anything before calling this method.
   */
  beginPortSelection(): Promise<ISerialPortInfo> {
    this.assertWebSerialReady();

    const selectionPromise = this.getNavigatorSerial().requestPort({
      filters: this.buildPortFilters(),
    });

    return this.completePortSelection(selectionPromise);
  }

  /** @deprecated Prefer {@link beginPortSelection} from a direct click handler. */
  async requestPort(): Promise<ISerialPortInfo> {
    return this.beginPortSelection();
  }

  private assertWebSerialReady(): void {
    if (!this.hasWebSerialApi()) {
      throw new WebSerialRequestError(
        'not_supported',
        'ui.web_serial_not_supported',
        'Web Serial API not supported',
      );
    }

    if (!isSecureContextForWebSerial()) {
      throw new WebSerialRequestError(
        'insecure_context',
        'ui.web_serial_insecure_context',
        'Web Serial requires HTTPS or localhost',
      );
    }
  }

  private buildPortFilters(): Array<{ usbVendorId: number }> {
    return ARDUINO_USB_VENDOR_IDS.map((usbVendorId) => ({ usbVendorId }));
  }

  private async completePortSelection(
    selectionPromise: Promise<WebSerialPortHandle>,
  ): Promise<ISerialPortInfo> {
    try {
      const port = await selectionPromise;
      this.portRegistry.register(WEB_SERIAL_SELECTED_PATH, port);

      const authorized = await this.getNavigatorSerial().getPorts();
      this.portRegistry.syncAuthorizedPorts(authorized);

      return this.toPortInfo(port);
    } catch (err) {
      throw mapWebSerialRequestError(err);
    }
  }

  private toPortInfo(port: WebSerialPortHandle): ISerialPortInfo {
    const info = port.getInfo?.() ?? {};
    const canonicalPath = this.portRegistry.findPathForPort(port) ?? WEB_SERIAL_SELECTED_PATH;
    const indexMatch = /^web-serial-(\d+)$/.exec(canonicalPath);
    const deviceIndex = indexMatch ? Number(indexMatch[1]) : 0;

    return {
      path: canonicalPath,
      friendlyName: formatWebSerialDeviceLabel(deviceIndex, info.usbVendorId, info.usbProductId),
      vendorId: info.usbVendorId != null ? String(info.usbVendorId) : undefined,
      productId: info.usbProductId != null ? String(info.usbProductId) : undefined,
    };
  }

  /**
   * Connect to the serial port for the serial monitor.
   */
  connect(path: string, options?: ISerialPortOptions): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.hasWebSerialApi()) {
        reject(new Error('Web Serial API not supported. Please use Chrome, Edge, or Opera browser.'));
        return;
      }

      try {
        this.statusSubject.next(ISerialConnectionStatus.CONNECTING);

        const port = await this.resolvePortForPath(path);
        if (!port) {
          reject(new Error('No serial port selected. Please connect a device and try again.'));
          return;
        }

        await this.openPort(port, options);

        this.port = port;
        this.activePath =
          path === WEB_SERIAL_REQUEST_NEW_PATH ? WEB_SERIAL_SELECTED_PATH : path;
        this.portRegistry.register(this.activePath, port);

        this.statusSubject.next(ISerialConnectionStatus.CONNECTED);
        this.startReading();
        resolve(true);
      } catch (err: unknown) {
        this.statusSubject.next(ISerialConnectionStatus.ERROR);
        reject(this.toConnectError(err));
      }
    });
  }

  disconnect(): Promise<boolean> {
    return this.closeActivePort();
  }

  /**
   * Closes the monitor session but keeps authorized port handles in the registry for upload.
   * When {@link uploadPort} is provided, also ensures that handle is closed (monitor may use another path).
   */
  async releaseForUpload(uploadPort?: WebSerialPortHandle): Promise<boolean> {
    await this.closeActivePort();
    if (uploadPort) {
      await ensureWebSerialPortClosed(uploadPort);
    }
    return true;
  }

  isConnected(): boolean {
    return this.statusSubject.value === ISerialConnectionStatus.CONNECTED;
  }

  /** Returns the registry path currently used by the monitor, if any. */
  getActivePortPath(): string | null {
    return this.activePath;
  }

  /**
   * Resolves a SerialPort handle for firmware upload.
   * Does not require the monitor to be connected.
   */
  getPortHandle(path: string): WebSerialPortHandle | undefined {
    return this.portRegistry.resolve(path);
  }

  write(data: string | Buffer): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.port?.writable) {
        reject(new Error('Port not open'));
        return;
      }

      try {
        const writer = this.port.writable.getWriter();
        const encoder = new TextEncoder();
        const buffer = typeof data === 'string' ? encoder.encode(data) : new Uint8Array(data);

        await writer.write(buffer);
        writer.releaseLock();
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  onData(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  onStatusChange(): Observable<ISerialConnectionStatus> {
    return this.statusSubject.asObservable();
  }

  getStatus(): ISerialConnectionStatus {
    return this.statusSubject.value;
  }

  flush(): Promise<boolean> {
    return Promise.resolve(true);
  }

  private async resolvePortForPath(path: string): Promise<WebSerialPortHandle | null> {
    if (path === WEB_SERIAL_REQUEST_NEW_PATH || !path) {
      const port = await this.getNavigatorSerial().requestPort();
      this.portRegistry.register(WEB_SERIAL_SELECTED_PATH, port);
      const authorized = await this.getNavigatorSerial().getPorts();
      this.portRegistry.syncAuthorizedPorts(authorized);
      return port;
    }

    let port = this.portRegistry.resolve(path);
    if (port) {
      return port;
    }

    const authorized = await this.getNavigatorSerial().getPorts();
    this.portRegistry.syncAuthorizedPorts(authorized);
    port = this.portRegistry.resolve(path);

    if (port) {
      return port;
    }

    if (path === WEB_SERIAL_SELECTED_PATH) {
      const requested = await this.getNavigatorSerial().requestPort();
      this.portRegistry.register(WEB_SERIAL_SELECTED_PATH, requested);
      this.portRegistry.syncAuthorizedPorts(await this.getNavigatorSerial().getPorts());
      return requested;
    }

    return null;
  }

  private async openPort(port: WebSerialPortHandle, options?: ISerialPortOptions): Promise<void> {
    await ensureWebSerialPortClosed(port);

    await port.open({
      baudRate: options?.baudRate || 9600,
      dataBits: options?.dataBits || 8,
      stopBits: options?.stopBits || 1,
      parity: options?.parity || 'none',
    });
  }

  private async closeActivePort(): Promise<boolean> {
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }

      if (this.port) {
        await ensureWebSerialPortClosed(this.port);
        this.port = null;
      }

      this.activePath = null;
      this.statusSubject.next(ISerialConnectionStatus.DISCONNECTED);
      return true;
    } catch (err) {
      console.error('Error disconnecting:', err);
      return false;
    }
  }

  private async startReading(): Promise<void> {
    if (!this.port?.readable) {
      return;
    }

    try {
      this.reader = this.port.readable.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await this.reader.read();

        if (done) {
          break;
        }

        if (value) {
          this.dataSubject.next(decoder.decode(value));
        }
      }
    } catch (err) {
      console.error('Error reading from port:', err);
      this.statusSubject.next(ISerialConnectionStatus.ERROR);
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
        this.reader = null;
      }
    }
  }

  private hasWebSerialApi(): boolean {
    return 'serial' in navigator;
  }

  private getNavigatorSerial(): NavigatorSerialApi {
    return (navigator as Navigator & { serial: NavigatorSerialApi }).serial;
  }

  private toConnectError(err: unknown): Error {
    if (err instanceof Error) {
      if (err.name === 'NotFoundError') {
        return new Error('No serial port selected. Please connect a device and try again.');
      }
      if (err.name === 'InvalidStateError') {
        return new Error('Port is already open or in use by another application.');
      }
      if (err.name === 'NetworkError') {
        return new Error('Failed to open port. Device may be disconnected.');
      }
      return err;
    }

    return new Error(String(err));
  }
}
