import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ICompiler } from '@core/interfaces';
import { CompileOptions, CompileResult } from '@core/models';

/**
 * Electron compiler service
 * Uses arduino-cli through Node.js child_process
 */
@Injectable()
export class ElectronCompilerService implements ICompiler {
  private arduinoCliPath: string = '';
  private sketchPath: string = '';

  /**
   * Compile code for a specified board
   * @param options Compile options
   * @returns Observable with the compile result
   */
  compile(options: CompileOptions): Observable<CompileResult> {
    return new Observable(observer => {
      // Here will be the logic to call arduino-cli through exec
      const { exec } = (window as any).require('child_process');
      const path = (window as any).require('path');
      const fs = (window as any).require('fs');

      // Get paths
      this.initializePaths();

      // Create temporary sketch
      const sketchDir = path.join(this.sketchPath, 'temp_sketch');
      const sketchFile = path.join(sketchDir, 'temp_sketch.ino');

      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(sketchDir)) {
          fs.mkdirSync(sketchDir, { recursive: true });
        }

        // Write code to file
        fs.writeFileSync(sketchFile, options.code, 'utf8');

        // Form compile command
        const command = `"${this.arduinoCliPath}" compile --fqbn ${options.board} "${sketchDir}"${options.verbose ? ' --verbose' : ''}`;

        // Execute compilation
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error: any, stdout: string, stderr: string) => {
          const output = stdout + stderr;

          if (error) {
            observer.next({
              success: false,
              output: output,
              error: error.message
            });
          } else {
            // Find hex file path
            const hexPath = this.findHexPath(sketchDir, options.board);
            
            observer.next({
              success: true,
              output: output,
              hexPath: hexPath
            });
          }

          observer.complete();
        });
      } catch (err: any) {
        observer.next({
          success: false,
          output: '',
          error: err.message
        });
        observer.complete();
      }
    });
  }

  /**
   * Check if the necessary compilation tools are installed
   * @returns Promise with the result of the check
   */
  checkTools(): Promise<boolean> {
    return new Promise(resolve => {
      const { exec } = (window as any).require('child_process');
      this.initializePaths();

      exec(`"${this.arduinoCliPath}" version`, (error: any) => {
        resolve(!error);
      });
    });
  }

  /**
   * Install core for a specified board
   * @param core Name of the core (e.g. 'arduino:avr')
   * @returns Observable with the progress of the installation
   */
  installCore(core: string): Observable<string> {
    return new Observable(observer => {
      const { exec } = (window as any).require('child_process');
      this.initializePaths();

      const command = `"${this.arduinoCliPath}" core install ${core}`;
      const child = exec(command);

      child.stdout.on('data', (data: Buffer) => {
        observer.next(data.toString());
      });

      child.stderr.on('data', (data: Buffer) => {
        observer.next(data.toString());
      });

      child.on('close', (code: number) => {
        if (code === 0) {
          observer.next('Installation completed');
        } else {
          observer.error(`Installation failed with code ${code}`);
        }
        observer.complete();
      });
    });
  }

  /**
   * Initialize paths for the compiler
   */
  private initializePaths(): void {
    const path = (window as any).require('path');
    const fs = (window as any).require('fs');

    // Determine the base path to resources
    let resourceRoot = __dirname;
    const candidate = path.join(__dirname, 'compilation');
    
    if (fs.existsSync(candidate)) {
      resourceRoot = __dirname;
    } else if ((process as any).resourcesPath) {
      resourceRoot = (process as any).resourcesPath;
    }

    // Determine the path to arduino-cli
    const isWin = process.platform === 'win32';
    const arduinoCliCmd = isWin ? 'arduino-cli.exe' : 'arduino-cli';
    this.arduinoCliPath = path.join(resourceRoot, 'compilation', 'arduino', arduinoCliCmd);
    this.sketchPath = path.join(resourceRoot, 'compilation', 'arduino', 'sketch');
  }

  private findHexPath(sketchDir: string, fqbn: string): string | undefined {
    const path = (window as any).require('path');
    const fs = (window as any).require('fs');

    const buildDir = path.join(sketchDir, 'build');
    
    if (!fs.existsSync(buildDir)) {
      return undefined;
    }

    // Find .hex file in the build directory
    const files = fs.readdirSync(buildDir, { recursive: true });
    const hexFile = files.find((f: string) => f.endsWith('.hex'));

    return hexFile ? path.join(buildDir, hexFile) : undefined;
  }
}

