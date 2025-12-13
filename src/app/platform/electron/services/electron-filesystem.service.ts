import { Injectable } from '@angular/core';
import { IFileSystem, FileDialogOptions } from '@core/interfaces';

/**
 * Electron implementation of the file system service
 * Uses Node.js fs and Electron dialog
 */
@Injectable()
export class ElectronFileSystemService implements IFileSystem {
  
  /**
   * Read the content of a file
   * @param path Path to the file
   * @returns Promise with the content of the file
   */
  readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fs = (window as any).require('fs');
        fs.readFile(path, 'utf8', (err: any, data: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Write data to a file
   * @param path Path to the file
   * @param content Content to write
   * @returns Promise with the result of the write operation
   */
  writeFile(path: string, content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const fs = (window as any).require('fs');
        fs.writeFile(path, content, 'utf8', (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Check if a file or directory exists
   * @param path Path to check
   * @returns Promise with the result
   */
  exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const fs = (window as any).require('fs');
        fs.access(path, fs.constants.F_OK, (err: any) => {
          resolve(!err);
        });
      } catch (err) {
        resolve(false);
      }
    });
  }

  /**
   * Create a directory
   * @param path Path to the directory
   * @returns Promise with the result
   */
  createDirectory(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const fs = (window as any).require('fs');
        fs.mkdir(path, { recursive: true }, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Delete a file
   * @param path Path to the file
   * @returns Promise with the result
   */
  deleteFile(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const fs = (window as any).require('fs');
        fs.unlink(path, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Open a file dialog
   * @param options Dialog options
   * @returns Promise with the path to the selected file
   */
  openFileDialog(options?: FileDialogOptions): Promise<string | null> {
    return new Promise(async (resolve) => {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        
        const dialogOptions: any = {
          title: options?.title || 'Select file',
          defaultPath: options?.defaultPath,
          properties: options?.properties || ['openFile']
        };

        if (options?.filters) {
          dialogOptions.filters = options.filters;
        }

        const result = await ipcRenderer.invoke('dialog:openFile', dialogOptions);
        
        if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
          resolve(null);
        } else {
          resolve(result.filePaths[0]);
        }
      } catch (err) {
        console.error('Error opening file dialog:', err);
        resolve(null);
      }
    });
  }

  /**
   * Open a save file dialog
   * @param options Dialog options
   * @returns Promise with the path to the saved file
   */
  saveFileDialog(options?: FileDialogOptions): Promise<string | null> {
    return new Promise(async (resolve) => {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        
        const dialogOptions: any = {
          title: options?.title || 'Save file',
          defaultPath: options?.defaultPath
        };

        if (options?.filters) {
          dialogOptions.filters = options.filters;
        }

        const result = await ipcRenderer.invoke('dialog:saveFile', dialogOptions);
        
        if (result.canceled || !result.filePath) {
          resolve(null);
        } else {
          resolve(result.filePath);
        }
      } catch (err) {
        console.error('Error opening save dialog:', err);
        resolve(null);
      }
    });
  }

  /**
   * Get the path to the temporary directory
   * @returns Promise with the path to the temporary directory
   */
  getTempDirectory(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const os = (window as any).require('os');
        resolve(os.tmpdir());
      } catch (err) {
        resolve('/tmp');
      }
    });
  }

  /**
   * Get the path to the application data directory
   * @returns Promise with the path to the application data directory
   */
  getAppDataDirectory(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.invoke('app:getPath', 'userData').then((path: string) => {
          resolve(path);
        });
      } catch (err) {
        resolve('');
      }
    });
  }
}

