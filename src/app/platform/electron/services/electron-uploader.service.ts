import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUploader } from '@core/interfaces';
import { UploadOptions, UploadResult } from '@core/models';

/**
 * Electron implementation of the firmware uploader
 * Uses arduino-cli for uploading through serial port
 */
@Injectable()
export class ElectronUploaderService implements IUploader {
  private arduinoCliPath: string = '';

  /**
   * Upload compiled firmware to a device
   * @param options Upload options
   * @returns Observable with the upload result
   */
  upload(options: UploadOptions): Observable<UploadResult> {
    return new Observable(observer => {
      const { exec } = (window as any).require('child_process');
      this.initializePaths();

      // Form upload command
      let command = `"${this.arduinoCliPath}" upload --fqbn ${options.board} --port ${options.port}`;
      
      if (options.hexPath) {
        command += ` --input-file "${options.hexPath}"`;
      }
      
      if (options.verbose) {
        command += ' --verbose';
      }

      if (options.programmer) {
        command += ` --programmer ${options.programmer}`;
      }

      // Execute upload
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error: any, stdout: string, stderr: string) => {
        const output = stdout + stderr;

        if (error) {
          observer.next({
            success: false,
            output: output,
            error: error.message
          });
        } else {
          observer.next({
            success: true,
            output: output
          });
        }

        observer.complete();
      });
    });
  }

  /**
   * Check if the specified port is available for upload
   * @param port Path to the port
   * @returns Promise with the result of the check
   */
  checkPort(port: string): Promise<boolean> {
    return new Promise(async resolve => {
      try {
        const { SerialPort } = (window as any).require('serialport');
        const ports = await SerialPort.list();
        const exists = ports.some((p: any) => p.path === port || p.comName === port);
        resolve(exists);
      } catch (err) {
        resolve(false);
      }
    });
  }

  /**
   * Reset the device
   * @param port Path to the port
   * @returns Promise with the result
   */
  resetDevice(port: string): Promise<boolean> {
    return new Promise(async resolve => {
      try {
        const { SerialPort } = (window as any).require('serialport');
        
        // Open port with low speed for reset
        const serialPort = new SerialPort({
          path: port,
          baudRate: 1200,
          autoOpen: false
        });

        serialPort.open((err: any) => {
          if (err) {
            resolve(false);
            return;
          }

          // Close port after 250ms for reset trigger
          setTimeout(() => {
            serialPort.close(() => {
              resolve(true);
            });
          }, 250);
        });
      } catch (err) {
        resolve(false);
      }
    });
  }

  /**
   * Initialize paths for the uploader
   */
  private initializePaths(): void {
    const path = (window as any).require('path');
    const fs = (window as any).require('fs');

    let resourceRoot = __dirname;
    const candidate = path.join(__dirname, 'compilation');
    
    if (fs.existsSync(candidate)) {
      resourceRoot = __dirname;
    } else if ((process as any).resourcesPath) {
      resourceRoot = (process as any).resourcesPath;
    }

    const isWin = process.platform === 'win32';
    const arduinoCliCmd = isWin ? 'arduino-cli.exe' : 'arduino-cli';
    this.arduinoCliPath = path.join(resourceRoot, 'compilation', 'arduino', arduinoCliCmd);
  }
}

