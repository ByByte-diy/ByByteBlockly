import { Observable } from 'rxjs';
import { UploadOptions, UploadResult } from '../models/compilation.model';

/**
 * Uploader interface for uploading compiled firmware to a device
 */
export abstract class IUploader {
  /**
   * Upload compiled firmware to a device
   * @param options Upload options
   * @returns Observable with the upload result
   */
  abstract upload(options: UploadOptions): Observable<UploadResult>;

  /**
   * Check if the specified port is available for upload
   * @param port Path to the port
   * @returns Promise with the result of the check
   */
  abstract checkPort(port: string): Promise<boolean>;

  /**
   * Reset the device
   * @param port Path to the port
   * @returns Promise with the result
   */
  abstract resetDevice(port: string): Promise<boolean>;
}

