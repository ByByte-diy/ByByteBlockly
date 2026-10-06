import { describe, expect, it } from 'vitest';
import { NgZone } from '@angular/core';
import { UploadManagerService, UploadStatus } from '../services/upload-manager.service';

function createService(): UploadManagerService {
  const ngZone = { run: (fn: () => void) => fn() } as NgZone;
  return new UploadManagerService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    ngZone,
  );
}

describe('UploadManagerService prefetch progress', () => {
  it('reports prefetch status with MB message key', () => {
    const service = createService();
    let lastMessage = '';

    service.progress$.subscribe((progress) => {
      lastMessage = progress.message;
    });

    service.reportPrefetchProgress({
      completed: 2,
      total: 10,
      downloadedMb: 1.2,
      totalMb: 6.5,
    });

    expect(service.getStatus()).toBe(UploadStatus.PREFETCHING);
    expect(lastMessage).toBe('ui.compile_progress_prefetch_mb');
  });

  it('finishPrefetch returns to idle', () => {
    const service = createService();
    service.reportPrefetchProgress({ completed: 1, total: 2, downloadedMb: 0.5, totalMb: 2 });
    service.finishPrefetch();
    expect(service.getStatus()).toBe(UploadStatus.IDLE);
  });
});
