const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json());

// ============================================
// JWT VERIFICATION MIDDLEWARE
// ============================================

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Error handling middleware for JWT errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
  next(err);
});

// ============================================
// IN-MEMORY DATA STORAGE
// ============================================

let cars = [
  {
    id: '1',
    model: 'Altima',
    brand: 'Nissan',
    image: '/img/nissan-altima.jpg',
    price: 50,
    year: 2021,
    cc: 2000,
    available: true,
    color: 'Blue',
    fuelType: 'Benzin'
  },
  {
    id: '2',
    model: 'Civic',
    brand: 'Honda',
    image: '/img/honda-civic.jpg',
    price: 45,
    year: 2020,
    cc: 1800,
    available: true,
    color: 'Red',
    fuelType: 'Benzin'
  }
];

let bookings = [];

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend API is running' });
});

// Get all cars (public)
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Create a new car
app.post('/api/cars', checkJwt, (req, res) => {
  try {
    const { model, brand, image, price, year, cc, color, fuelType } = req.body;
    
    // Validation
    if (!model || !brand || !price) {
      return res.status(400).json({ error: 'Missing required fields: model, brand, price' });
    }

    const newCar = {
      id: Date.now().toString(),
      model,
      brand,
      image: image || '/img/default.jpg',
      price: parseFloat(price),
      year: parseInt(year) || new Date().getFullYear(),
      cc: parseInt(cc) || 0,
      available: true,
      color: color || 'Unknown',
      fuelType: fuelType || 'Benzin'
    };

    cars.push(newCar);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car' });
  }
});

// Update a car
app.put('/api/cars/:id', checkJwt, (req, res) => {
  try {
    const carId = req.params.id;
    const carIndex = cars.findIndex(c => c.id === carId);

    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const updatedCar = { ...cars[carIndex], ...req.body, id: carId };
    cars[carIndex] = updatedCar;
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete a car
app.delete('/api/cars/:id', checkJwt, (req, res) => {
  try {
    const carId = req.params.id;
    const carIndex = cars.findIndex(c => c.id === carId);

    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const deletedCar = cars.splice(carIndex, 1);
    res.json(deletedCar[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Get all bookings for authenticated user
app.get('/api/bookings', checkJwt, (req, res) => {
  try {
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// Create a new booking
app.post('/api/bookings', checkJwt, (req, res) => {
  try {
    const { startDate, endDate, carId, customerName } = req.body;

    // Validation
    if (!startDate || !endDate || !carId) {
      return res.status(400).json({ error: 'Missing required fields: startDate, endDate, carId' });
    }

    // Find the car to get pricing
    const car = cars.find(c => c.id === carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Calculate days and price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = days * car.price;

    const newBooking = {
      id: Date.now().toString(),
      startDate,
      endDate,
      price: totalPrice,
      carId,
      customerName: customerName || 'Unknown',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Delete a booking
app.delete('/api/bookings/:id', checkJwt, (req, res) => {
  try {
    const bookingId = req.params.id;
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const deletedBooking = bookings.splice(bookingIndex, 1);
    res.json(deletedBooking[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`✅ Backend API is running on http://localhost:${PORT}`);
  console.log(`📋 Documentation:`);
  console.log(`   GET    /api/cars         - Get all cars (public)`);
  console.log(`   POST   /api/cars         - Create car (protected)`);
  console.log(`   PUT    /api/cars/:id     - Update car (protected)`);
  console.log(`   DELETE /api/cars/:id     - Delete car (protected)`);
  console.log(`   GET    /api/bookings     - Get bookings (protected)`);
  console.log(`   POST   /api/bookings     - Create booking (protected)`);
  console.log(`   DELETE /api/bookings/:id - Delete booking (protected)`);
});
