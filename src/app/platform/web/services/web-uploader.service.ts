import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUploader } from '@core/interfaces';
import { UploadOptions, UploadResult } from '@core/models';
import { WEB_SERIAL_REQUEST_NEW_PATH } from '../constants/web-serial-paths.const';
import {
  AvrUploadUnsupportedError,
  resolveAvrUploadProfile,
} from '../utils/avr-upload-profile.util';
import {
  flashAvrHex,
  mapBootloadStatusToI18n,
  mapUploadPhasePercent,
} from '../utils/web-avr-stk500.util';
import { getWebSerialSupport } from '../utils/web-serial-support.util';
import { WebSerialRequestError } from '../utils/web-serial-request-error.util';
import { WebSerialPortRegistry } from './web-serial-port-registry.service';
import { WebSerialService } from './web-serial.service';

@Injectable()
export class WebUploaderService implements IUploader {
  constructor(
    private readonly serialService: WebSerialService,
    private readonly portRegistry: WebSerialPortRegistry,
  ) {}

  upload(options: UploadOptions): Observable<UploadResult> {
    return new Observable((observer) => {
      this.runUpload(options)
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((err: unknown) => {
          observer.next(this.toUploadFailure(err));
          observer.complete();
        });
    });
  }

  checkPort(port: string): Promise<boolean> {
    const support = getWebSerialSupport();
    if (!support.supported) {
      return Promise.resolve(false);
    }

    if (port && port !== WEB_SERIAL_REQUEST_NEW_PATH) {
      if (this.portRegistry.has(port) || this.serialService.getPortHandle(port)) {
        return Promise.resolve(true);
      }
    }

    if (!('serial' in navigator)) {
      return Promise.resolve(false);
    }

    return (navigator as Navigator & { serial: { getPorts(): Promise<unknown[]> } }).serial
      .getPorts()
      .then((ports) => ports.length > 0)
      .catch(() => false);
  }

  async resetDevice(port: string): Promise<boolean> {
    try {
      const portHandle = this.serialService.getPortHandle(port);
      if (!portHandle) {
        return false;
      }

      await this.serialService.releaseForUpload();

      if (portHandle.readable || portHandle.writable) {
        await portHandle.close().catch(() => undefined);
      }

      await portHandle.open({
        baudRate: 1200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      await new Promise((resolve) => setTimeout(resolve, 250));
      await portHandle.close().catch(() => undefined);
      return true;
    } catch {
      return false;
    }
  }

  private async runUpload(options: UploadOptions): Promise<UploadResult> {
    const support = getWebSerialSupport();
    if (!support.supported) {
      return {
        success: false,
        output: '',
        error: support.reason === 'insecure_context'
          ? 'ui.web_serial_insecure_context'
          : 'ui.web_serial_not_supported',
      };
    }

    const hexContent = options.hexContent?.trim();
    if (!hexContent) {
      return {
        success: false,
        output: '',
        error: 'ui.upload_hex_missing',
      };
    }

    let profile;
    try {
      profile = resolveAvrUploadProfile({
        fqbn: options.board,
        boardId: options.boardId,
      });
    } catch (err) {
      if (err instanceof AvrUploadUnsupportedError) {
        return {
          success: false,
          output: '',
          error: err.i18nKey,
        };
      }
      throw err;
    }

    const portPath = options.port?.trim();
    if (!portPath || portPath === WEB_SERIAL_REQUEST_NEW_PATH) {
      return {
        success: false,
        output: '',
        error: 'ui.upload_select_board_port',
      };
    }

    let portHandle = this.serialService.getPortHandle(portPath);
    if (!portHandle) {
      await this.serialService.listPorts();
      portHandle = this.serialService.getPortHandle(portPath);
    }

    if (!portHandle) {
      return {
        success: false,
        output: '',
        error: 'ui.upload_port_not_found',
      };
    }

    await this.serialService.releaseForUpload();

    try {
      const result = await flashAvrHex({
        port: portHandle,
        hexContent,
        profile,
        verbose: options.verbose,
        onProgress: (stkPercent, status) => {
          options.onProgress?.({
            percent: mapUploadPhasePercent(stkPercent),
            message: mapBootloadStatusToI18n(status),
          });
        },
      });

      return {
        success: true,
        output: result.output,
      };
    } catch (err) {
      return this.toUploadFailure(err);
    }
  }

  private toUploadFailure(err: unknown): UploadResult {
    if (err instanceof AvrUploadUnsupportedError) {
      return { success: false, output: '', error: err.i18nKey };
    }

    if (err instanceof WebSerialRequestError) {
      return { success: false, output: '', error: err.i18nKey };
    }

    const message = err instanceof Error ? err.message : String(err);
    return { success: false, output: message, error: 'ui.upload_error_short' };
  }
}
