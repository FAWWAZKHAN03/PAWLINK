const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given user id.
 * @param {string} userId
 * @returns {string} signed JWT
 */
module.exports = function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
