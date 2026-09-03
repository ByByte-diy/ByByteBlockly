import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ICompiler, IUploader } from '@core/interfaces';
import { CompileResult, UploadResult } from '@core/models';
import { DeviceManagerService } from '../../device/services/device-manager.service';
import { BlocklyService } from '../../blockly/services/blockly.service';

/**
 * Status of the upload process
 */
export enum UploadStatus {
  IDLE = 'idle',
  COMPILING = 'compiling',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Message about progress
 */
export interface UploadProgress {
  status: UploadStatus;
  message: string;
  progress?: number;
}

/**
 * Service for managing the compilation and upload process
 */
@Injectable({
  providedIn: 'root'
})
export class UploadManagerService {
  private statusSubject = new BehaviorSubject<UploadStatus>(UploadStatus.IDLE);
  private progressSubject = new Subject<UploadProgress>();
  private lastCompileResult: CompileResult | null = null;

  /**
   * Observable of the upload status
   */
  public status$ = this.statusSubject.asObservable();

  /**
   * Observable of the upload progress
   */
  public progress$ = this.progressSubject.asObservable();

  constructor(
    private compiler: ICompiler,
    private uploader: IUploader,
    private deviceManager: DeviceManagerService,
    private blocklyService: BlocklyService
  ) {}

  /**
   * Compiles and uploads code to the device
   */
  compileAndUpload(): Observable<boolean> {
    return new Observable(observer => {
      this.executeCompileAndUpload()
        .then(success => {
          observer.next(success);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Compile only without upload
   */
  compileOnly(): Observable<CompileResult> {
    return new Observable(observer => {
      this.executeCompile()
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Uploads the last compiled firmware
   */
  uploadOnly(): Observable<UploadResult> {
    return new Observable(observer => {
      if (!this.lastCompileResult || !this.lastCompileResult.success) {
        const error = 'First you need to compile the code';
        this.updateProgress(UploadStatus.ERROR, error);
        observer.error(new Error(error));
        return;
      }

      this.executeUpload(this.lastCompileResult)
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  /**
   * Gets the last compilation result
   */
  getLastCompileResult(): CompileResult | null {
    return this.lastCompileResult;
  }

  /**
   * Gets the current status
   */
  getStatus(): UploadStatus {
    return this.statusSubject.value;
  }

  /**
   * Executes the compilation and upload
   */
  private async executeCompileAndUpload(): Promise<boolean> {
    try {
      // Step 1: Compilation
      const compileResult = await this.executeCompile();
      
      if (!compileResult.success) {
        return false;
      }

      // Step 2: Upload
      const uploadResult = await this.executeUpload(compileResult);
      
      return uploadResult.success;
    } catch (err: any) {
      this.updateProgress(UploadStatus.ERROR, `Error: ${err.message}`);
      return false;
    }
  }

  /**
   * Executes the compilation
   */
  private async executeCompile(): Promise<CompileResult> {
    // Get the selected board (always available, defaults to Arduino Uno)
    const board = this.deviceManager.getSelectedBoard();

    this.updateProgress(UploadStatus.COMPILING, 'Генерація Arduino коду...');
    
    // Small delay for update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Phase 2: replace with this.codeEditorService.getEffectiveCode() for manual edits.
    const code = this.blocklyService.getCurrentCode();
    if (!code) {
      throw new Error('Code is empty or not generated');
    }

    this.updateProgress(UploadStatus.COMPILING, 'Compilation of code...');

    // Compile
    return new Promise((resolve, reject) => {
      this.compiler.compile({
        board: board.fqbn,
        code: code,
        verbose: true
      }).subscribe({
        next: (result) => {
          this.lastCompileResult = result;
          
          if (result.success) {
            this.updateProgress(UploadStatus.SUCCESS, 'Compilation successful!');
          } else {
            this.updateProgress(UploadStatus.ERROR, `Compilation error:\n${result.error || result.output}`);
          }
          
          resolve(result);
        },
        error: (err) => {
          this.updateProgress(UploadStatus.ERROR, `Compilation error: ${err.message}`);
          reject(err);
        }
      });
    });
  }

  /**
   * Executes the upload
   */
  private async executeUpload(compileResult: CompileResult): Promise<UploadResult> {
    // Get the selected board (always available, defaults to Arduino Uno)
    const board = this.deviceManager.getSelectedBoard();
    const port = this.deviceManager.getSelectedPort();

    if (!port) {
      throw new Error('Port not selected');
    }

    this.updateProgress(UploadStatus.UPLOADING, 'Uploading to the device...');

    return new Promise((resolve, reject) => {
      this.uploader.upload({
        board: board.fqbn,
        port: port.path,
        hexPath: compileResult.hexPath,
        verbose: true
      }).subscribe({
        next: (result) => {
          if (result.success) {
            this.updateProgress(UploadStatus.SUCCESS, 'Upload successful!');
          } else {
            this.updateProgress(UploadStatus.ERROR, `Upload error:\n${result.error || result.output}`);
          }
          
          resolve(result);
        },
        error: (err) => {
          this.updateProgress(UploadStatus.ERROR, `Upload error: ${err.message}`);
          reject(err);
        }
      });
    });
  }

  /**
   * Updates the status and progress
   */
  private updateProgress(status: UploadStatus, message: string, progress?: number): void {
    this.statusSubject.next(status);
    this.progressSubject.next({
      status,
      message,
      progress
    });
  }
}
