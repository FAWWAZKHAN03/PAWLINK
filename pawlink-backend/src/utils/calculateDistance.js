module.exports = (lat1, lon1, lat2, lon2) => { return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)); };
