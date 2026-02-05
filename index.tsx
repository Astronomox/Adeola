import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import 'process/browser';

import { AppComponent } from './src/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
  ],
});

// AI Studio always uses an `index.tsx` file for all project types.
