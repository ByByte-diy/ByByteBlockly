import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppElectronModule } from './app/app-electron.module';

platformBrowserDynamic().bootstrapModule(AppElectronModule)
  .catch(err => console.error(err));

