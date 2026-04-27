const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: String,
  url: { type: String, required: true, unique: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
  author: String,
  publishedAt: { type: Date, required: true },
  categories: [{ type: String, index: true }],
  tags: [String],
  sentiment: {
    score: Number, // [-1 to 1]
    magnitude: Number,
    label: { type: String, enum: ['positive', 'neutral', 'negative'] }
  },
  metrics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Text index for full-text search
articleSchema.index({ title: 'text', content: 'text', summary: 'text' });
// Compound index for filtering
articleSchema.index({ categories: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
