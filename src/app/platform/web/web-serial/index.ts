export { WebSerialModule } from './web-serial.module';
export {
  WebSerialPortRegistry,
  WebSerialPortHandle,
} from './services/web-serial-port-registry.service';
export { WebSerialService } from './services/web-serial.service';
export { WebUploaderService } from './upload/services/web-uploader.service';
export {
  WEB_SERIAL_REQUEST_NEW_PATH,
  WEB_SERIAL_SELECTED_PATH,
  isValidDevicePortPath,
  isConnectableWebSerialPath,
  isWebSerialSyntheticPath,
  webSerialPathForIndex,
} from './constants/web-serial-paths.const';
export {
  getWebSerialSupport,
  isSecureContextForWebSerial,
} from './utils/web-serial-support.util';
export {
  WebSerialRequestError,
  getWebSerialEnvironmentHintKey,
  mapWebSerialRequestError,
} from './utils/web-serial-request-error.util';
export {
  ensureWebSerialPortClosed,
  prepareWebSerialPortForUpload,
} from './utils/web-serial-port-lifecycle.util';
export { createFlasherWebSerialTransport } from './utils/web-serial-port-adapter.util';
export { resolveAvrUploadProfile, AvrUploadUnsupportedError } from './upload/utils/avr-upload-profile.util';
export { isEsp32WebUploadFqbn } from './upload/utils/esp32-upload-profile.util';
