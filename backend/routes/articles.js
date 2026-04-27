const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get articles with filtering, search, and pagination
router.get('/', async (req, res) => {
  try {
    const { query, category, source, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    
    // Full-text search
    if (query) {
      filter.$text = { $search: query };
    }
    
    if (category) filter.categories = category;
    if (source) filter.sourceId = source;
    
    if (startDate || endDate) {
      filter.publishedAt = {};
      if (startDate) filter.publishedAt.$gte = new Date(startDate);
      if (endDate) filter.publishedAt.$lte = new Date(endDate);
    }
    
    const articles = await Article.find(filter)
      .sort(query ? { score: { $meta: 'textScore' } } : { publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sourceId', 'name');
      
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trending Topics Aggregation Pipeline (Last 24 hours)
router.get('/trending', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const trending = await Article.aggregate([
      { $match: { publishedAt: { $gte: twentyFourHoursAgo } } },
      { $unwind: "$categories" },
      { $group: {
          _id: "$categories",
          count: { $sum: 1 },
          avgSentiment: { $avg: "$sentiment.score" },
          articles: { $push: { title: "$title", url: "$url" } }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sentiment Distribution mapped by Category
router.get('/sentiment-distribution', async (req, res) => {
  try {
    const distribution = await Article.aggregate([
      { $match: { "sentiment.label": { $exists: true } } },
      { $unwind: "$categories" },
      { $group: {
        _id: { category: "$categories", sentiment: "$sentiment.label" },
        count: { $sum: 1 }
      }},
      { $group: {
        _id: "$_id.category",
        sentiments: { $push: { label: "$_id.sentiment", count: "$count" } }
      }}
    ]);
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
