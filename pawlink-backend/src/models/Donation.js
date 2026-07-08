const mongoose = require('mongoose');
const toJSONPlugin = require('../utils/toJSON.plugin');

const contributionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, trim: true, default: 'Anonymous Backer' },
    amount: { type: Number, required: true, min: [1, 'Donation amount must be greater than 0'] },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
  },
  { timestamps: true }
);

const donationCampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Campaign title is required'], trim: true },
    category: {
      type: String,
      enum: ['Medical', 'Shelter', 'Equipment', 'Food', 'Other'],
      default: 'Other',
    },
    desc: { type: String, trim: true, maxlength: 2000, default: '' },
    goal: { type: Number, required: [true, 'Fundraising goal is required'], min: 1 },
    raised: { type: Number, default: 0, min: 0 },
    deadline: { type: Date },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contributions: [contributionSchema],
  },
  { timestamps: true }
);

donationCampaignSchema.virtual('contributors').get(function contributorsCount() {
  return this.contributions.length;
});

toJSONPlugin(donationCampaignSchema);

module.exports = mongoose.model('Donation', donationCampaignSchema);
