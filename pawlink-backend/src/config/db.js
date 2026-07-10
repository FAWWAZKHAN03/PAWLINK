const mongoose = require('mongoose');
require("dotenv").config(); // <-- make sure this is at the top

/**
 * Connects to MongoDB (Atlas or local) using the URI from the environment.
 * Logs connection lifecycle events and exits the process on a fatal
 * initial-connection failure so the app never silently runs without a DB.
 */
const connectDB = async (url) => {
  const uri = url || 'mongodb://127.0.0.1:27017/pawlink';

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.error(`MongoDB initial connection failed: ${err.message}`);
    process.exit(1);
  }
};

// Close the connection cleanly on app shutdown (e.g. nodemon restarts, Ctrl+C)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
