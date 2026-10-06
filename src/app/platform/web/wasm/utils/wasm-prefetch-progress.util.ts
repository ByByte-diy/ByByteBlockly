import { AssetPrefetchProgress } from '@modules/asset-cache';
import { BundleCatalog } from '@modules/asset-cache';

export interface WasmPrefetchProgressReport {
  completed: number;
  total: number;
  downloadedMb: number;
  totalMb: number;
}

/** Map catalog file prefetch progress to upload-panel MB / file counts. */
export function buildWasmPrefetchProgressReport(
  catalog: BundleCatalog,
  paths: string[],
  progress: AssetPrefetchProgress,
): WasmPrefetchProgressReport {
  const totalBytes = paths.reduce((sum, path) => sum + (catalog.files[path]?.size ?? 0), 0);
  const completedPaths = paths.slice(0, progress.completed);
  const downloadedBytes = completedPaths.reduce(
    (sum, path) => sum + (catalog.files[path]?.size ?? 0),
    0,
  );

  return {
    completed: progress.completed,
    total: progress.total,
    downloadedMb: roundMb(downloadedBytes),
    totalMb: roundMb(totalBytes),
  };
}

function roundMb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}
