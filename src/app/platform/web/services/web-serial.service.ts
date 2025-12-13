import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ISerial } from '@core/interfaces';
import { ISerialPortInfo, ISerialPortOptions, ISerialConnectionStatus } from '@core/models';

/**
 * Web implementation of the serial port service
 * Uses Web Serial API (available in Chrome/Edge)
 */
@Injectable()
export class WebSerialService implements ISerial {
  private port: any = null;
  private reader: any = null;
  private dataSubject = new Subject<string>();
  private statusSubject = new BehaviorSubject<ISerialConnectionStatus>(ISerialConnectionStatus.DISCONNECTED);
  
  /**
   * Get list of available serial ports
   * Web Serial API returns only previously authorized ports
   * @returns Promise with the list of ports
   */
  listPorts(): Promise<ISerialPortInfo[]> {
    return new Promise(async (resolve, reject) => {
      // Check if Web Serial API is supported
      if (!('serial' in navigator)) {
        reject(new Error('Web Serial API not supported in this browser. Use Chrome, Edge, or Opera.'));
        return;
      }

      try {
        // getPorts() returns only previously authorized ports
        const ports = await (navigator as any).serial.getPorts();
        
        const portInfos: ISerialPortInfo[] = ports.map((port: any, index: number) => {
          // Try to get port info if available
          const info = port.getInfo ? port.getInfo() : {};
          return {
            path: `web-serial-${index}`,
            friendlyName: info.usbProductId 
              ? `USB Device (${info.usbVendorId}:${info.usbProductId})`
              : `Web Serial Device ${index + 1}`
          };
        });
        
        // If no ports found, add a prompt to request port
        if (portInfos.length === 0) {
          portInfos.push({
            path: 'request-new-port',
            friendlyName: 'Click "Connect" to select a device...'
          });
        }
        
        resolve(portInfos);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Request user to select a serial port
   * This requires user interaction (button click)
   * @returns Promise with selected port info
   */
  async requestPort(): Promise<ISerialPortInfo> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API not supported');
    }

    try {
      const port = await (navigator as any).serial.requestPort();
      const info = port.getInfo ? port.getInfo() : {};
      
      return {
        path: 'web-serial-selected',
        friendlyName: info.usbProductId 
          ? `USB Device (${info.usbVendorId}:${info.usbProductId})`
          : 'Web Serial Device'
      };
    } catch (err) {
      throw new Error('User cancelled port selection or no port available');
    }
  }

  /**
   * Connect to the serial port
   * For Web Serial API, this will prompt user to select a device
   * @param path Path to the port (ignored in web, user selects device)
   * @param options Connection options
   * @returns Promise with the result of the connection
   */
  connect(path: string, options?: ISerialPortOptions): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!('serial' in navigator)) {
        reject(new Error('Web Serial API not supported. Please use Chrome, Edge, or Opera browser.'));
        return;
      }

      try {
        this.statusSubject.next(ISerialConnectionStatus.CONNECTING);

        // If no port selected or path is 'request-new-port', request port from user
        if (!this.port || path === 'request-new-port') {
          // This requires user interaction (button click)
          this.port = await (navigator as any).serial.requestPort({
            // Optional: filter by vendor/product ID
            // filters: [
            //   { usbVendorId: 0x2341 } // Arduino
            // ]
          });
        } else {
          // Try to use existing port from getPorts()
          const ports = await (navigator as any).serial.getPorts();
          if (ports.length > 0) {
            this.port = ports[0]; // Use first available port
          } else {
            // No authorized ports, request new one
            this.port = await (navigator as any).serial.requestPort();
          }
        }

        // Open the port with specified options
        await this.port.open({
          baudRate: options?.baudRate || 9600,
          dataBits: options?.dataBits || 8,
          stopBits: options?.stopBits || 1,
          parity: options?.parity || 'none'
        });

        this.statusSubject.next(ISerialConnectionStatus.CONNECTED);

        // Start reading data
        this.startReading();

        resolve(true);
      } catch (err: any) {
        this.statusSubject.next(ISerialConnectionStatus.ERROR);
        
        // Provide user-friendly error messages
        if (err.name === 'NotFoundError') {
          reject(new Error('No serial port selected. Please connect a device and try again.'));
        } else if (err.name === 'InvalidStateError') {
          reject(new Error('Port is already open or in use by another application.'));
        } else if (err.name === 'NetworkError') {
          reject(new Error('Failed to open port. Device may be disconnected.'));
        } else {
          reject(err);
        }
      }
    });
  }

  /**
   * Disconnect from the serial port
   * @returns Promise with the result of the disconnection
   */
  disconnect(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        if (this.reader) {
          await this.reader.cancel();
          this.reader = null;
        }

        if (this.port) {
          await this.port.close();
          this.port = null;
        }

        this.statusSubject.next(ISerialConnectionStatus.DISCONNECTED);
        resolve(true);
      } catch (err) {
        console.error('Error disconnecting:', err);
        resolve(false);
      }
    });
  }

  /**
   * Send data to the serial port
   * @param data Data to send
   * @returns Promise with the result of the write operation
   */
  write(data: string | Buffer): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.port) {
        reject(new Error('Port not open'));
        return;
      }

      try {
        const writer = this.port.writable.getWriter();
        const encoder = new TextEncoder();
        const buffer = typeof data === 'string' ? encoder.encode(data) : data;
        
        await writer.write(buffer);
        writer.releaseLock();
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Observable for getting data from the serial port
   * @returns Observable with the data
   */
  onData(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  /**
   * Observable for getting the connection status
   * @returns Observable with the connection status
   */
  onStatusChange(): Observable<ISerialConnectionStatus> {
    return this.statusSubject.asObservable();
  }

  /**
   * Get current connection status
   * @returns Current connection status
   */
  getStatus(): ISerialConnectionStatus {
    return this.statusSubject.value;
  }

  /**
   * Flush the serial port buffer
   * @returns Promise with the result of the flush operation
   */
  flush(): Promise<boolean> {
    // Web Serial API не має методу flush
    return Promise.resolve(true);
  }

  /**
   * Start reading data from the serial port
   * @returns Promise with the result of the reading
   */
  private async startReading(): Promise<void> {
    if (!this.port || !this.port.readable) {
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
          const text = decoder.decode(value);
          this.dataSubject.next(text);
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
}

