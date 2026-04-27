const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  rssFeedUrl: String,
  apiEndpoint: String,
  reliabilityScore: { type: Number, min: 0, max: 100, default: 50 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Source', sourceSchema);
