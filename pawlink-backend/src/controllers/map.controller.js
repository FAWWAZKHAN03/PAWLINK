const asyncHandler = require('../utils/asyncHandler');
const Shelter = require('../models/Shelter');
const calculateDistance = require('../utils/calculateDistance');

/**
 * @route   GET /api/map
 * @desc    Get shelters/vets/NGOs as map points, sorted by distance if lat/lng given
 * @access  Public
 */
exports.getMapPoints = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const shelters = await Shelter.find();

  let points = shelters.map((s) => s.toJSON());

  if (lat && lng) {
    const originLat = parseFloat(lat);
    const originLng = parseFloat(lng);
    points = points
      .map((s) => ({ ...s, distance: calculateDistance(originLat, originLng, s.coords.lat, s.coords.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }

  res.status(200).json({ success: true, count: points.length, points });
});
