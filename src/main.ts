import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from './environments/environment';

// Setup AG Grid before app boots
ModuleRegistry.registerModules([AllCommunityModule]);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    // Enable service worker only in production
    ...(environment.production
      ? [
          provideServiceWorker('ngsw-worker.js', {
            enabled: true,
            registrationStrategy: 'registerWhenStable:30000',
          }),
        ]
      : []),
  ],
}).catch((err) => console.error(err));
