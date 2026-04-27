const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'reader'], default: 'reader' },
  preferences: {
    followedCategories: [String],
    followedSources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source' }],
    followedAuthors: [String]
  },
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
