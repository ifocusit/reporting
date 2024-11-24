import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'timbrage-reporting',
        appId: '1:836360158078:web:6608488d5c1bc88b',
        databaseURL: 'https://timbrage-reporting.firebaseio.com',
        storageBucket: 'timbrage-reporting.appspot.com',
        apiKey: 'AIzaSyDVNoovozUiU9W_swTDrxEe-SGVoeD2cf4',
        authDomain: 'timbrage-reporting.firebaseapp.com',
        messagingSenderId: '836360158078'
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
