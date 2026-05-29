# Backend API Setup Guide

## Overview
This is a Node.js/Express backend API for the Albanian Car Rental application. It:
- Validates Auth0 JWT tokens
- Provides REST API endpoints for cars and bookings
- Stores data in-memory (resets on server restart)

## Prerequisites
- **Node.js 14+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

## Installation & Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin support
- `express-jwt` - JWT verification middleware
- `jwks-rsa` - Auth0 key resolution
- `dotenv` - Environment variable management

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your Auth0 credentials (from AUTH0_SETUP_GUIDE.md):
   ```
   AUTH0_DOMAIN=your-auth0-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=https://albanian-car-rental-api
   PORT=3000
   NODE_ENV=development
   ```

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
✅ Backend API is running on http://localhost:3000
```

### Step 4: Verify It's Working
Test with a simple GET request (public endpoint):
```bash
curl http://localhost:3000/health
```

Response:
```json
{"status":"Backend API is running"}
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /health
Health check endpoint.
```bash
curl http://localhost:3000/health
```

#### GET /api/cars
Get all available cars.
```bash
curl http://localhost:3000/api/cars
```

Response:
```json
[
  {
    "id": "1",
    "model": "Altima",
    "brand": "Nissan",
    "price": 50,
    "year": 2021,
    "cc": 2000,
    "available": true,
    "color": "Blue",
    "fuelType": "Benzin"
  }
]
```

### Protected Endpoints (Require Auth0 JWT Token)

All protected endpoints require an `Authorization` header with a valid Auth0 JWT token:
```
Authorization: Bearer <YOUR_AUTH0_TOKEN>
```

#### POST /api/cars
Create a new car (requires authentication).
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Accord",
    "brand": "Honda",
    "price": 60,
    "year": 2022,
    "cc": 2000,
    "color": "Silver",
    "fuelType": "Benzin"
  }'
```

#### PUT /api/cars/:id
Update a car (requires authentication).
```bash
curl -X PUT http://localhost:3000/api/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 55, "available": false}'
```

#### DELETE /api/cars/:id
Delete a car (requires authentication).
```bash
curl -X DELETE http://localhost:3000/api/cars/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### GET /api/bookings
Get all bookings (requires authentication).
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/bookings
```

#### POST /api/bookings
Create a new booking (requires authentication).
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "carId": "1",
    "customerName": "John Doe"
  }'
```

#### DELETE /api/bookings/:id
Delete a booking (requires authentication).
```bash
curl -X DELETE http://localhost:3000/api/bookings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development

### Auto-Restart on Changes
Install nodemon for auto-restart during development:
```bash
npm install --save-dev nodemon
npm run dev
```

## Important Notes

1. **In-Memory Storage**: Data is stored in memory and resets when the server restarts. For production, integrate a real database (MongoDB, PostgreSQL, etc.).

2. **CORS**: The server only accepts requests from `http://localhost:4200` (your Angular frontend). To add more origins, modify the `cors` configuration in `server.js`.

3. **JWT Validation**: The server validates JWT tokens against your Auth0 tenant's public keys. Tokens must include the correct audience (`https://albanian-car-rental-api`).

4. **Error Handling**: 
   - Invalid or missing tokens return `401 Unauthorized`
   - Missing required fields return `400 Bad Request`
   - Server errors return `500 Internal Server Error`

## Troubleshooting

### "Cannot find module 'express'"
Make sure you've run `npm install` first.

### "Invalid token" Error
- Ensure your frontend is sending the correct Auth0 JWT token
- Check that `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` in `.env` match your Auth0 app settings
- Verify the token hasn't expired

### CORS Errors in Browser
- Ensure your Angular app is running on `http://localhost:4200`
- Modify CORS origin in `server.js` if you're using a different port

### Port Already in Use
If port 3000 is already in use:
```bash
PORT=3001 npm start
```

Then update the API URL in your Angular frontend accordingly.

## Next Steps
Once the backend is running:
1. Update your Angular frontend to use this API
2. Install `@auth0/auth0-angular` in your Angular project
3. Configure the HTTP interceptor to attach JWT tokens
4. Update services to call these API endpoints instead of using localStorage
