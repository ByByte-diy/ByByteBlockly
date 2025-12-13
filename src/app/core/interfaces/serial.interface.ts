import { Observable } from 'rxjs';
import { ISerialPortInfo, ISerialPortOptions, ISerialConnectionStatus } from '../models/serial-port.model';

/**
 * Serial interface for working with serial ports
 */
export abstract class ISerial {
  /**
   * Get list of available serial ports
   * @returns Promise with the list of ports
   */
  abstract listPorts(): Promise<ISerialPortInfo[]>;

  /**
   * Open connection with a serial port
   * @param path Path to the port
   * @param options Connection options
   * @returns Promise with the result of the connection
   */
  abstract connect(path: string, options?: ISerialPortOptions): Promise<boolean>;

  /**
   * Close connection
   * @returns Promise with the result of the connection
   */
  abstract disconnect(): Promise<boolean>;

  /**
   * Send data to a serial port
   * @param data Data to send
   * @returns Promise with the result
   */
  abstract write(data: string | Buffer): Promise<boolean>;

  /**
   * Observable for getting data from a serial port
   * @returns Observable with the data
   */
  abstract onData(): Observable<string>;

  /**
   * Observable for getting the connection status
   * @returns Observable with the connection status
   */
  abstract onStatusChange(): Observable<ISerialConnectionStatus>;

  /**
   * Get current connection status
   * @returns Current connection status
   */
  abstract getStatus(): ISerialConnectionStatus;

  /**
   * Flush the serial port buffer
   * @returns Promise with the result
   */
  abstract flush(): Promise<boolean>;
}

