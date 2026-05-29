// Auth0 Configuration
// Get these values from your Auth0 Application settings

export const environment = {
  production: false,
  auth0: {
    domain: 'dev-r5cgo0w6vhoq33zf.us.auth0.com',
    clientId: 'lpy3gutzVJtEsLcDf5sI2JrMDHWsJHCo',
    redirectUri: 'http://localhost:4200/callback',
    audience: 'https://albanian-car-rental-api',
    scope: 'openid profile email'
  },
  apiUrl: 'http://localhost:3000/api'
};
