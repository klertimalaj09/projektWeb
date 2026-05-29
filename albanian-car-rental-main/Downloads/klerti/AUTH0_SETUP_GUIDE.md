# Auth0 Setup Guide

## Step 1: Create Auth0 Account
1. Go to https://auth0.com/
2. Click "Sign Up" and create a free account
3. Complete the verification email
4. You'll be prompted to create a tenant (organization name)
   - **Tenant Name**: Choose something like "albanian-car-rental" or your name
   - **Region**: Choose your closest region (Europe, US, etc.)

## Step 2: Create Auth0 Application
1. After login, go to **Applications** → **Applications** (left sidebar)
2. Click **"+ Create Application"**
3. Fill in the form:
   - **Name**: `Albanian Car Rental`
   - **Application Type**: Select **"Single Page Application"**
   - Click **"Create"**

## Step 3: Configure Application Settings
1. You're now in your Application settings page
2. Under **Application URIs**, configure:

   **Allowed Callback URLs** (where Auth0 redirects after login):
   ```
   http://localhost:4200/callback
   ```

   **Allowed Logout URLs** (where Auth0 redirects after logout):
   ```
   http://localhost:4200/login
   ```

   **Allowed Web Origins** (allowed CORS origins):
   ```
   http://localhost:4200
   ```

3. Scroll down and find **Grant Types** section
   - Ensure these are checked:
     - ✅ Authorization Code
     - ✅ Refresh Token

4. Click **"Save Changes"** at the bottom

## Step 4: Create Database Connection
1. Go to **Authentication** → **Database** (left sidebar)
2. Click **"+ Create DB Connection"**
3. Fill in:
   - **Name**: `Username-Password-Authentication`
   - Leave other options as default
   - Click **"Create"**

## Step 5: Create Test User (Optional but Recommended)
1. Go to **User Management** → **Users** (left sidebar)
2. Click **"+ Create User"**
3. Fill in:
   - **Email**: `test@example.com`
   - **Password**: `TestPassword123!`
   - **Confirm Password**: `TestPassword123!`
   - **Connection**: Select `Username-Password-Authentication`
   - Click **"Create"**

## Step 6: Gather Credentials for Application Configuration
You now need to copy these values and store them somewhere safe (you'll need them for the frontend and backend code):

1. Go to **Settings** tab of your Application
2. Copy these values:
   - **Domain**: (looks like `yourname.auth0.com`)
   - **Client ID**: (32-character string)

3. For backend configuration, you'll also need:
   - Go to **Settings** → scroll to find **Client Secret**: Click the eye icon to reveal
   - **Copy the Client Secret** and save it safely

**Example values (DO NOT USE - these are examples):**
```
Domain: klerti.auth0.com
Client ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Client Secret: x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9
```

## Step 7: Create Auth0 API (Backend Validation)
1. Go to **Applications** → **APIs** (left sidebar)
2. Click **"+ Create API"**
3. Fill in:
   - **Name**: `Albanian Car Rental API`
   - **Identifier**: `https://albanian-car-rental-api` (or your domain/API identifier)
   - **Signing Algorithm**: `RS256` (default)
   - Click **"Create"**

This API identifier will be used in backend token validation.

---

## Next Steps
Once you have gathered all credentials from Steps 1-6, you'll need to:
1. Add backend `.env` file with Domain, Client ID, and Client Secret
2. Add frontend `auth0-config.ts` file with Domain and Client ID
3. Configure the Auth0 module in Angular

**Keep your Client Secret safe and never commit it to git!**
