import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { ISerial } from "@core/interfaces";
import {
  ISerialPortInfo,
  ISerialPortOptions,
  ISerialConnectionStatus,
} from "@core/models";

/**
 * Electron implementation of the serial port service
 * Uses node-serialport
 */
@Injectable()
export class ElectronSerialService implements ISerial {
  private serialPort: any = null;
  private dataSubject = new Subject<string>();
  private statusSubject = new BehaviorSubject<ISerialConnectionStatus>(
    ISerialConnectionStatus.DISCONNECTED
  );

  /**
   * Get list of available serial ports
   * @returns Promise with the list of ports
   */
  listPorts(): Promise<ISerialPortInfo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { SerialPort } = (window as any).require("serialport");
        const ports = await SerialPort.list();

        const serialPorts: ISerialPortInfo[] = ports
          .filter((p: any) => p.vendorId) // Filter only with vendorId
          .map((p: any) => ({
            path: p.path || p.comName,
            manufacturer: p.manufacturer,
            serialNumber: p.serialNumber,
            pnpId: p.pnpId,
            locationId: p.locationId,
            vendorId: p.vendorId,
            productId: p.productId,
            friendlyName: p.friendlyName,
          }));

        resolve(serialPorts);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Connect to the serial port
   * @param path Path to the port
   * @param options Connection options
   * @returns Promise with the result of the connection
   */
  connect(path: string, options?: ISerialPortOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const { SerialPort } = (window as any).require("serialport");

        this.statusSubject.next(ISerialConnectionStatus.CONNECTING);

        const portOptions: any = {
          path: path,
          baudRate: options?.baudRate || 9600,
          autoOpen: false,
        };

        if (options?.dataBits) portOptions.dataBits = options.dataBits;
        if (options?.stopBits) portOptions.stopBits = options.stopBits;
        if (options?.parity) portOptions.parity = options.parity;

        this.serialPort = new SerialPort(portOptions);

        // Handler for receiving data
        this.serialPort.on("data", (data: Buffer) => {
          this.dataSubject.next(data.toString());
        });

        // Handler for errors
        this.serialPort.on("error", (err: Error) => {
          console.error("Serial port error:", err);
          this.statusSubject.next(ISerialConnectionStatus.ERROR);
        });

        // Handler for closing
        this.serialPort.on("close", () => {
          this.statusSubject.next(ISerialConnectionStatus.DISCONNECTED);
        });

        // Open port
        this.serialPort.open((err: any) => {
          if (err) {
            this.statusSubject.next(ISerialConnectionStatus.ERROR);
            reject(err);
          } else {
            this.statusSubject.next(ISerialConnectionStatus.CONNECTED);
            resolve(true);
          }
        });
      } catch (err) {
        this.statusSubject.next(ISerialConnectionStatus.ERROR);
        reject(err);
      }
    });
  }

  /**
   * Disconnect from the serial port
   * @returns Promise with the result of the disconnection
   */
  disconnect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.serialPort || !this.serialPort.isOpen) {
        this.statusSubject.next(ISerialConnectionStatus.DISCONNECTED);
        resolve(true);
        return;
      }

      this.serialPort.close((err: any) => {
        if (err) {
          console.error("Error closing port:", err);
          resolve(false);
        } else {
          this.serialPort = null;
          this.statusSubject.next(ISerialConnectionStatus.DISCONNECTED);
          resolve(true);
        }
      });
    });
  }

  /**
   * Send data to the serial port
   * @param data Data to send
   * @returns Promise with the result of the write operation
   */
  write(data: string | Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.serialPort || !this.serialPort.isOpen) {
        reject(new Error("Serial port is not open"));
        return;
      }

      const buffer = typeof data === "string" ? Buffer.from(data) : data;

      this.serialPort.write(buffer, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
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
    return new Promise((resolve, reject) => {
      if (!this.serialPort || !this.serialPort.isOpen) {
        reject(new Error("Serial port is not open"));
        return;
      }

      this.serialPort.flush((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
