// Environment Configuration for Development

export const environment = {
  production: false,
  auth0: {
    domain: 'dev-r5cgo0w6vhoq33zf.us.auth0.com', // Replace with your Auth0 domain (e.g., klerti.auth0.com)
    clientId: 'lpy3gutzVJtEsLcDf5sI2JrMDHWsJHCo',             // Replace with your Auth0 Client ID
    redirectUri: 'http://localhost:4201/callback',
    audience: 'https://albanian-car-rental-api',
    scope: 'openid profile email'
  },
  apiUrl: 'http://localhost:3000/api'
};
