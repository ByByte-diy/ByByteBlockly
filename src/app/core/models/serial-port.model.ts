/**
 * Serial port information
 */
export interface ISerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  vendorId?: string;
  productId?: string;
  friendlyName?: string;
}

/**
 * Serial port settings
 */
export interface ISerialPortOptions {
  baudRate?: number;
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 2;
  parity?: 'none' | 'even' | 'odd' | 'mark' | 'space';
  autoOpen?: boolean;
}

/**
 * Connection status
 */
export enum ISerialConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

