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
        const articles = await Article.find({ source: req.params.sourceId }).sort({ publishedAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
