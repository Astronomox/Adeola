import 'https://esm.sh/@angular/compiler@^21.1.3?external=rxjs';
import { bootstrapApplication } from 'https://esm.sh/@angular/platform-browser@^21.1.3?external=rxjs';
import { provideZonelessChangeDetection } from 'https://esm.sh/@angular/core@^21.1.3?external=rxjs';
import { provideHttpClient } from 'https://esm.sh/@angular/common@^21.1.3/http?external=rxjs';

import { AppComponent } from './src/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
  ],
});

// AI Studio always uses an `index.tsx` file for all project types.