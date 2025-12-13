import { Injectable } from '@angular/core';
import { IFileSystem, FileDialogOptions } from '@core/interfaces';

/**
 * Web implementation of the file system service
 * Uses File System Access API and LocalStorage
 */
@Injectable()
export class WebFileSystemService implements IFileSystem {
  
  /**
   * Read the content of a file
   * @param path Path to the file
   * @returns Promise with the content of the file
   */
  readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // For web version we use localStorage or IndexedDB
      const content = localStorage.getItem(path);
      if (content !== null) {
        resolve(content);
      } else {
        reject(new Error(`File not found: ${path}`));
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
    return new Promise((resolve) => {
      try {
        localStorage.setItem(path, content);
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  /**
   * Check if a file or directory exists
   * @param path Path to check
   * @returns Promise with the result
   */
  exists(path: string): Promise<boolean> {
    return Promise.resolve(localStorage.getItem(path) !== null);
  }

  /**
   * Create a directory
   * @param path Path to the directory
   * @returns Promise with the result
   */
  createDirectory(path: string): Promise<boolean> {
    // For web version directories are not needed
    return Promise.resolve(true);
  }

  /**
   * Delete a file
   * @param path Path to the file
   * @returns Promise with the result
   */
  deleteFile(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem(path);
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }

  /**
   * Open a file dialog
   * @param options Dialog options
   * @returns Promise with the path to the selected file
   */
  openFileDialog(options?: FileDialogOptions): Promise<string | null> {
    return new Promise((resolve) => {
      // Create input element for file selection
      const input = document.createElement('input');
      input.type = 'file';
      
      if (options?.filters && options.filters.length > 0) {
        const extensions = options.filters
          .flatMap(f => f.extensions.map(ext => `.${ext}`))
          .join(',');
        input.accept = extensions;
      }

      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          try {
            const text = await file.text();
            // Save to localStorage with the file name as the key
            const path = `files/${file.name}`;
            await this.writeFile(path, text);
            resolve(path);
          } catch (err) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      input.click();
    });
  }

  /**
   * Open a save file dialog
   * @param options Dialog options
   * @returns Promise with the path to the saved file
   */
  saveFileDialog(options?: FileDialogOptions): Promise<string | null> {
    return new Promise((resolve) => {
      // For web version we return prompt with the file name
      const fileName = prompt(
        options?.title || 'Enter the file name to save',
        options?.defaultPath || 'sketch.ino'
      );
      
      if (fileName) {
        resolve(`files/${fileName}`);
      } else {
        resolve(null);
      }
    });
  }

  getTempDirectory(): Promise<string> {
    return Promise.resolve('temp');
  }

  getAppDataDirectory(): Promise<string> {
    return Promise.resolve('appdata');
  }

  /**
   * Additional method for downloading a file in the browser
   */
  downloadFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

