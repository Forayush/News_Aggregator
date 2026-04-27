const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all unique topics/categories
router.get('/', async (req, res) => {
    try {
        const topics = await Article.distinct('categories');
        res.json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get articles for a specific topic
router.get('/:topicName/articles', async (req, res) => {
    try {
        const articles = await Article.find({ categories: req.params.topicName }).populate('sourceId', 'name url').sort({ publishedAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
