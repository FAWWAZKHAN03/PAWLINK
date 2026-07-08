const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to specific user roles. Must run after `protect`
 * so that `req.user` is already populated.
 *
 * Usage: router.post('/', protect, allowRoles('Responder', 'NGO'), handler)
 */
module.exports = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError('Not authorized, please log in', 401));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(`This action requires one of these roles: ${roles.join(', ')}`, 403));
  }
  next();
};
