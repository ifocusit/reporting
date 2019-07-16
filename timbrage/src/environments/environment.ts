// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyC36dQ0yvYx_gqq0cSdN9D87DuSf5u-TFg',
    authDomain: 'timbrage-reporting.firebaseapp.com',
    databaseURL: 'https://timbrage-reporting.firebaseio.com',
    projectId: 'timbrage-reporting',
    storageBucket: 'timbrage-reporting.appspot.com',
    messagingSenderId: '836360158078',
    appId: '1:836360158078:web:6608488d5c1bc88b'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
