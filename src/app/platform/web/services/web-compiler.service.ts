import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICompiler } from '@core/interfaces';
import { CompileOptions, CompileResult } from '@core/models';

/**
 * Web реалізація компілятора
 * Відправляє запити на backend API для компіляції
 */
@Injectable()
export class WebCompilerService implements ICompiler {
  private apiUrl = '/api'; // URL backend API

  compile(options: CompileOptions): Observable<CompileResult> {
    // TODO: Реалізувати HTTP запит до backend API
    return new Observable(observer => {
      // Тимчасова заглушка
      observer.next({
        success: false,
        output: 'Web compilation not implemented yet',
        error: 'Web platform requires backend API server'
      });
      observer.complete();
    });
    
    // Реальна реалізація буде виглядати так:
    // return this.http.post<CompileResult>(`${this.apiUrl}/compile`, options);
  }

  checkTools(): Promise<boolean> {
    // TODO: Перевірка доступності backend API
    return Promise.resolve(false);
    
    // Реальна реалізація:
    // return this.http.get<{available: boolean}>(`${this.apiUrl}/tools/check`)
    //   .toPromise()
    //   .then(res => res.available)
    //   .catch(() => false);
  }

  installCore(core: string): Observable<string> {
    // TODO: Відправка запиту на встановлення core через backend
    return new Observable(observer => {
      observer.error('Core installation not available in web platform');
      observer.complete();
    });
    
    // Реальна реалізація через WebSocket:
    // return this.websocket.listen(`/install-core/${core}`);
  }
}

