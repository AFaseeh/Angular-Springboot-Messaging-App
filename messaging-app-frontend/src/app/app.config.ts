import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RxStompService } from './service/RxStompService.service';
import { jwtAuthInterceptor } from './basic-auth-interceptor';

import { providePrimeNG } from 'primeng/config';
import customPreset from './theme/custom-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtAuthInterceptor])),
    RxStompService,
    providePrimeNG({
      theme: {
        preset: customPreset
      }
    })
  ]
};
