import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUploader } from '@core/interfaces';
import { UploadOptions, UploadResult } from '@core/models';

/**
 * Web реалізація завантажувача
 * Використовує Web Serial API (Chrome) або backend API
 */
@Injectable()
export class WebUploaderService implements IUploader {
  private apiUrl = '/api';

  upload(options: UploadOptions): Observable<UploadResult> {
    // TODO: Реалізувати через Web Serial API або backend
    return new Observable(observer => {
      observer.next({
        success: false,
        output: 'Web upload not implemented yet',
        error: 'Web platform requires Web Serial API or backend server'
      });
      observer.complete();
    });

    // Можлива реалізація через Web Serial API (Chrome):
    // if ('serial' in navigator) {
    //   // Використовувати Web Serial API
    // } else {
    //   // Fallback на backend API
    // }
  }

  checkPort(port: string): Promise<boolean> {
    // TODO: Перевірка через Web Serial API
    return Promise.resolve(false);
  }

  resetDevice(port: string): Promise<boolean> {
    // TODO: Скидання через Web Serial API
    return Promise.resolve(false);
  }
}

