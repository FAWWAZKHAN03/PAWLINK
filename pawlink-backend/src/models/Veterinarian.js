const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const veterinarianSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    specialty: { type: String, trim: true, default: 'General Practice' },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' },
    phone: { type: String, trim: true, default: '' },
    licenseId: { type: String, trim: true, default: '' },
    availability: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

toJSONPlugin(veterinarianSchema);

module.exports = mongoose.model('Veterinarian', veterinarianSchema);
