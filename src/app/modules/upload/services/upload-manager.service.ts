import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ICompiler, IUploader } from '@core/interfaces';
import { CompileResult, UploadResult } from '@core/models';
import { DeviceManagerService } from '../../device/services/device-manager.service';
import { CodeEditorService } from '../../code-editor/services/code-editor.service';
import { formatBuildLog } from '../utils/build-log.util';
import { clampProgressPercent } from '@core/utils/compile-progress.util';

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
  private buildLogSubject = new BehaviorSubject<string>('');
  private compileResultSubject = new BehaviorSubject<CompileResult | null>(null);
  private lastCompileResult: CompileResult | null = null;
  private lastProgressPercent = 0;

  /**
   * Observable of the upload status
   */
  public status$ = this.statusSubject.asObservable();

  /**
   * Observable of the upload progress
   */
  public progress$ = this.progressSubject.asObservable();

  /** Full compile log for the build log panel. */
  public buildLog$ = this.buildLogSubject.asObservable();

  /** Last compile result (success or failure). */
  public compileResult$ = this.compileResultSubject.asObservable();

  constructor(
    private compiler: ICompiler,
    private uploader: IUploader,
    private deviceManager: DeviceManagerService,
    private codeEditorService: CodeEditorService,
    private ngZone: NgZone,
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
    try {
      return await this.runCompile();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.publishBuildLog({
        success: false,
        output: '',
        error: message,
      });
      this.updateProgress(UploadStatus.ERROR, 'ui.compile_error_short', this.lastProgressPercent);
      throw err;
    }
  }

  private async runCompile(): Promise<CompileResult> {
    // Get the selected board (always available, defaults to Arduino Uno)
    const board = this.deviceManager.getSelectedBoard();

    this.lastProgressPercent = 0;
    this.updateProgress(UploadStatus.COMPILING, 'ui.compile_progress_generating', 3);

    const code = this.codeEditorService.getEffectiveCode();
    if (!code) {
      throw new Error('Code is empty or not generated');
    }

    // Compile
    return new Promise((resolve, reject) => {
      this.compiler.compile({
        board: board.fqbn,
        code: code,
        verbose: true,
        onProgress: (update) => {
          this.updateProgress(
            UploadStatus.COMPILING,
            update.message ?? 'ui.compile_progress_compiling',
            update.percent,
          );
        },
      }).subscribe({
        next: (result) => {
          this.lastCompileResult = result;
          this.publishBuildLog(result);

          if (result.success) {
            this.updateProgress(UploadStatus.SUCCESS, 'ui.compile_success', 100);
          } else {
            this.updateProgress(UploadStatus.ERROR, 'ui.compile_error_short', this.lastProgressPercent);
          }

          resolve(result);
        },
        error: (err) => {
          reject(err);
        },
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

    this.updateProgress(UploadStatus.UPLOADING, 'ui.upload_progress_uploading', 10);

    return new Promise((resolve, reject) => {
      this.uploader.upload({
        board: board.fqbn,
        port: port.path,
        hexPath: compileResult.hexPath,
        verbose: true
      }).subscribe({
        next: (result) => {
          if (result.success) {
            this.updateProgress(UploadStatus.SUCCESS, 'ui.upload_success', 100);
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
    this.runInAngularZone(() => {
      const clamped = clampProgressPercent(progress);
      if (clamped != null) {
        this.lastProgressPercent = clamped;
      }
      this.statusSubject.next(status);
      this.progressSubject.next({
        status,
        message,
        progress: clamped,
      });
    });
  }

  private publishBuildLog(result: CompileResult): void {
    this.runInAngularZone(() => {
      this.compileResultSubject.next(result);
      this.buildLogSubject.next(formatBuildLog(result));
    });
  }

  private runInAngularZone(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }
}
