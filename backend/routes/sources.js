const express = require('express');
const router = express.Router();
const Source = require('../models/Source');
const Article = require('../models/Article');

// Get all sources
router.get('/', async (req, res) => {
    try {
        const sources = await Source.find();
        res.json(sources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get articles from a specific source
router.get('/:sourceId/articles', async (req, res) => {
    try {
        const source = await Source.findById(req.params.sourceId);
        if (!source) {
            return res.status(404).json({ message: 'Source not found' });
        }
        
        // Filter articles created in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const articles = await Article.find({ 
            sourceId: req.params.sourceId,
            publishedAt: { $gte: twentyFourHoursAgo }
        }).sort({ publishedAt: -1 });
        
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
