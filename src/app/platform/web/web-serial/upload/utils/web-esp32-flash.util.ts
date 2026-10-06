import { ESPLoader, Transport } from 'esptool-js';
import { WebSerialPortHandle } from '../../services/web-serial-port-registry.service';
import {
  base64ToBinaryString,
  flashSizeBytesFromLabel,
  flashSizeLabelFromKb,
  normalizeFlashAppAddress,
} from './esp32-upload-profile.util';

export interface FlashEsp32BinOptions {
  port: WebSerialPortHandle;
  /** Base64-encoded app .bin from WASM compile. */
  binContent: string;
  appAddress?: unknown;
  verbose?: boolean;
  onProgress?: (percent: number, status: string) => void;
}

export interface FlashEsp32BinResult {
  output: string;
}

export class FlashEsp32UploadError extends Error {
  readonly i18nKey: string;

  constructor(i18nKey: string, detail?: string) {
    super(detail ?? i18nKey);
    this.name = 'FlashEsp32UploadError';
    this.i18nKey = i18nKey;
  }
}

/**
 * Flashes an ESP32 app image over Web Serial using esptool-js.
 * Assumes stock bootloader + partition table already on the board (typical dev kits).
 *
 * Port must be closed before calling — use {@link prepareWebSerialPortForUpload}.
 * Do not call transport.connect() here: ESPLoader.main() opens the port internally.
 */
export async function flashEsp32Bin(options: FlashEsp32BinOptions): Promise<FlashEsp32BinResult> {
  const logs: string[] = [];
  const port = options.port;

  const transport = new Transport(port as unknown as SerialPort);
  const loader = new ESPLoader({
    transport,
    baudrate: 115200,
    romBaudrate: 115200,
    terminal: options.verbose
      ? {
          clean: () => undefined,
          write: (data) => logs.push(data),
          writeLine: (data) => logs.push(data),
        }
      : undefined,
  });

  try {
    options.onProgress?.(5, 'sync');
    const chip = await loader.main('default_reset');
    logs.push(`Chip: ${chip}`);

    const binData = base64ToBinaryString(options.binContent);
    if (!binData.length) {
      throw new FlashEsp32UploadError('ui.upload_firmware_missing', 'Empty ESP32 app image');
    }

    const appAddress = normalizeFlashAppAddress(options.appAddress);
    const flashSizeKb = await loader.getFlashSize().catch(() => 4096);
    const flashSize = flashSizeLabelFromKb(flashSizeKb);
    const flashBytes = flashSizeBytesFromLabel(flashSize);

    logs.push(
      `Flashing app @ 0x${appAddress.toString(16)} (${binData.length} B), flash ${flashSize}`,
    );

    if (appAddress + binData.length > flashBytes) {
      throw new FlashEsp32UploadError(
        'ui.upload_firmware_too_large',
        `Firmware ${binData.length} B @ 0x${appAddress.toString(16)} exceeds ${flashSize} flash`,
      );
    }

    await loader.writeFlash({
      fileArray: [{ data: binData, address: appAddress }],
      flashSize,
      flashMode: 'dio',
      flashFreq: '80m',
      eraseAll: false,
      compress: true,
      reportProgress: (_fileIndex, written, total) => {
        const pct = 10 + Math.round((written / Math.max(total, 1)) * 85);
        options.onProgress?.(pct, 'flash');
      },
    });

    await loader.after('hard_reset');
    logs.push('Upload completed successfully.');
    return { output: logs.join('\n') };
  } catch (err) {
    throw mapEsp32FlashError(err);
  } finally {
    await transport.disconnect().catch(() => undefined);
  }
}

function mapEsp32FlashError(err: unknown): FlashEsp32UploadError {
  if (err instanceof FlashEsp32UploadError) {
    return err;
  }

  const message = err instanceof Error ? err.message : String(err);
  if (
    (err instanceof DOMException && err.name === 'InvalidStateError') ||
    message.includes('already open')
  ) {
    return new FlashEsp32UploadError('ui.upload_port_busy', message);
  }

  if (message.includes("doesn't fit in the available flash")) {
    return new FlashEsp32UploadError('ui.upload_firmware_too_large', message);
  }

  return new FlashEsp32UploadError('ui.upload_error_short', message);
}
