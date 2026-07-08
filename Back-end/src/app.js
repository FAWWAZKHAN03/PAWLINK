const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const adoptionRoutes = require('./routes/adoption.routes');
const rescueRoutes = require('./routes/rescue.routes');
const lostFoundRoutes = require('./routes/lostFound.routes');
const donationRoutes = require('./routes/donation.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const ngoRoutes = require('./routes/ngo.routes');
const mapRoutes = require('./routes/map.routes');
const medicalRoutes = require('./routes/medical.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Static file serving for uploaded profile images ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Health check ---
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
