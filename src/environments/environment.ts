// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://10.254.201.28/api/',
  myProtectedResourceMap: 'https://graph.microsoft.com/v1.0/me',
  clientId: 'e8d79061-9649-4707-ba6c-8ee8df9dda60',
    authority:
    'https://login.microsoftonline.com/adbbbd82-76e5-4952-8531-3cc59f3c1fdd',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
