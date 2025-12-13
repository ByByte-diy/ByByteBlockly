/**
 * File system interface for working with the file system
 */
export abstract class IFileSystem {
  /**
   * Read the content of a file
   * @param path Path to the file
   * @returns Promise with the content of the file
   */
  abstract readFile(path: string): Promise<string>;

  /**
   * Write data to a file
   * @param path Path to the file
   * @param content Content to write
   * @returns Promise with the result
   */
  abstract writeFile(path: string, content: string): Promise<boolean>;

  /**
   * Check if a file or directory exists
   * @param path Path to check
   * @returns Promise with the result
   */
  abstract exists(path: string): Promise<boolean>;

  /**
   * Create a directory
   * @param path Path to the directory
   * @returns Promise with the result
   */
  abstract createDirectory(path: string): Promise<boolean>;

  /**
   * Delete a file
   * @param path Path to the file
   * @returns Promise with the result
   */
  abstract deleteFile(path: string): Promise<boolean>;

  /**
   * Open a file dialog
   * @param options Dialog options
   * @returns Promise with the path to the selected file
   */
  abstract openFileDialog(options?: FileDialogOptions): Promise<string | null>;

  /**
   * Open a save file dialog
   * @param options Dialog options
   * @returns Promise with the path to the saved file
   */
  abstract saveFileDialog(options?: FileDialogOptions): Promise<string | null>;

  /**
   * Get the path to the temporary directory
   * @returns Promise with the path to the temporary directory
   */
  abstract getTempDirectory(): Promise<string>;

  /**
   * Get the path to the application data directory
   * @returns Promise with the path to the application data directory
   */
  abstract getAppDataDirectory(): Promise<string>;
}

/**
 * Options for file dialogs
 */
export interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: FileFilter[];
  properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles')[];
}

/**
 * File filter for file dialogs
 */
export interface FileFilter {
  name: string;
  extensions: string[];
}

