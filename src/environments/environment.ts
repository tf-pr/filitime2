// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fs_conf:
    {
      apiKey:            'AIzaSyCreHeXAEW4691TMOkKVOwhVPrQvN6yxfc', // check
      authDomain:        'ft2-playground.firebaseapp.com',
      databaseURL:       'https://ft2-playground.firebaseio.com',
      projectId:         'ft2-playground',
      storageBucket:     'ft2-playground.appspot.com',
      messagingSenderId: '364772251942',
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
