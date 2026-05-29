# Quick Start Guide - Auth0 Integration

## Prerequisites
- Node.js 14+ installed from https://nodejs.org/
- Auth0 account (free at https://auth0.com/)

## Setup in 5 Steps

### Step 1: Auth0 Account Setup (5-10 minutes)
Follow [AUTH0_SETUP_GUIDE.md](AUTH0_SETUP_GUIDE.md) to:
1. Create Auth0 account
2. Create SPA Application
3. Configure URLs (Callback, Logout, CORS)
4. Create Database Connection
5. Save: Domain, Client ID, Client Secret

### Step 2: Configure Frontend
Edit `src/environments/environment.ts`:
```typescript
domain: 'YOUR_AUTH0_DOMAIN.auth0.com',
clientId: 'YOUR_CLIENT_ID',
```

### Step 3: Configure Backend
Create `backend/.env`:
```
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_AUDIENCE=https://albanian-car-rental-api
PORT=3000
```

### Step 4: Install Dependencies
```bash
# From your current folder:
# C:\Users\KM\Downloads\albanian-car-rental-main
cd .\albanian-car-rental-main\Downloads\klerti
npm install

# Backend
cd .\backend
npm install
```

Important: do not run `npm install` in `C:\Users\KM\Downloads\albanian-car-rental-main`.
That folder has no `package.json`, so npm will show "package.json missing".

If PowerShell says "npm is not recognized", use this one-time fix:

```powershell
# Temporary fix for current terminal
$env:Path += ';C:\Program Files\nodejs'

# Permanent fix for future terminals
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($userPath -notlike '*C:\Program Files\nodejs*') {
	[Environment]::SetEnvironmentVariable('Path', $userPath + ';C:\Program Files\nodejs', 'User')
}
```

Close and reopen VS Code terminal after the permanent fix.

### Step 5: Run Application
**Terminal 1 - Backend:**
```bash
cd C:\Users\KM\Downloads\albanian-car-rental-main\albanian-car-rental-main\Downloads\klerti\backend
npm start
# Should show: ✅ Backend API is running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\KM\Downloads\albanian-car-rental-main\albanian-car-rental-main\Downloads\klerti
npm start
# Opens http://localhost:4200
```

## Try It Out

### Local Login
- Email: `klerti@klerti`
- Password: `klerti2009`

### Auth0 Login
- Click "🔐 Sign in with Auth0" button on login page

## Verification

✅ Frontend at http://localhost:4200
✅ Backend at http://localhost:3000/health
✅ Login works (local or Auth0)
✅ Protected routes redirect to login when not authenticated
✅ Can create cars and bookings when logged in

## File Changes Summary

| File | Status | Changes |
|------|--------|---------|
| `app.module.ts` | ✅ Updated | Added HttpClientModule, AuthModule, AuthInterceptor |
| `auth.service.ts` | ✅ Updated | Added Auth0 support (both local and Auth0 login) |
| `login.component.*` | ✅ Updated | Added Auth0 button, improved UI |
| `auth.guard.ts` | ✅ NEW | Protects routes |
| `auth.interceptor.ts` | ✅ NEW | Attaches JWT to requests |
| `callback/callback.component.*` | ✅ NEW | Handles Auth0 redirect |
| `cars.service.ts` | ✅ Updated | Uses backend API instead of localStorage |
| `booking.service.ts` | ✅ Updated | Uses backend API instead of localStorage |
| `app-routing.module.ts` | ✅ Updated | Added guards and callback route |
| `environments/environment.ts` | ✅ NEW | Auth0 configuration |
| `package.json` | ✅ Updated | Added @auth0/auth0-angular |
| `backend/server.js` | ✅ NEW | Express server with JWT validation |

## Testing Checklist

- [ ] Local login with klerti@klerti / klerti2009
- [ ] Auth0 login with your test user
- [ ] Access `/create` when logged in
- [ ] Cannot access `/create` when logged out (redirects to login)
- [ ] Create a car - appears in list
- [ ] Create a booking - appears in bookings list
- [ ] Backend `/api/cars` returns data
- [ ] Token appears in HTTP requests (DevTools Network tab)
- [ ] Logout clears session

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module @auth0/auth0-angular" | Run `npm install` in frontend folder |
| Backend won't start | Check Node.js installed: `node --version` |
| "Invalid token" from API | Verify Auth0 Domain in `backend/.env` |
| CORS error | Ensure backend runs on port 3000 |
| Callback gives 404 | Ensure CallbackComponent is declared in app.module.ts |

## Full Documentation

- **Setup Details**: See [AUTH0_SETUP_GUIDE.md](AUTH0_SETUP_GUIDE.md)
- **Backend API**: See [backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md)
- **Testing Guide**: See [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)

## What Was Implemented

✅ **Frontend**: Auth0 SDK, JWT interceptor, route guards, dual auth UI, callback handling
✅ **Backend**: Express API, JWT validation, protected endpoints, CORS
✅ **Both**: Local auth still works, both methods independent
✅ **API**: All cars/bookings now use backend instead of localStorage

## Next Steps

1. ✅ Start backend (`npm start` in backend/)
2. ✅ Start frontend (`npm start` in klerti/)
3. ✅ Test local login
4. ✅ Test Auth0 login
5. ✅ Create cars and bookings
6. ✅ Verify data persists via API

---

**Status**: ✅ Implementation Complete - Ready for testing!
