import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHashtag, faFingerprint, faLock, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Adicione os ícones à biblioteca
library.add(faArrowRight, faArrowLeft, faHashtag, faFingerprint, faLock);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()],
};