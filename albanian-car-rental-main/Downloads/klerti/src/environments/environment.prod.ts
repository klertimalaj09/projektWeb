// Environment Configuration for Production

export const environment = {
  production: true,
  auth0: {
    domain: 'dev-r5cgo0w6vhoq33zf.us.auth0.com',
    clientId: 'lpy3gutzVJtEsLcDf5sI2JrMDHWsJHCo',
    redirectUri: 'http://localhost:4201/callback',
    audience: 'https://albanian-car-rental-api',
    scope: 'openid profile email'
  },
  apiUrl: 'http://localhost:3000/api'
};
