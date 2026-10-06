import { NgModule } from '@angular/core';
import { ISerial, IUploader } from '@core/interfaces';
import { WebSerialPortRegistry } from './services/web-serial-port-registry.service';
import { WebSerialService } from './services/web-serial.service';
import { WebUploaderService } from './upload/services/web-uploader.service';

/** Web Serial API transport and firmware upload over serial. */
@NgModule({
  providers: [
    WebSerialPortRegistry,
    WebSerialService,
    WebUploaderService,
    { provide: ISerial, useExisting: WebSerialService },
    { provide: IUploader, useExisting: WebUploaderService },
  ],
})
export class WebSerialModule {}
