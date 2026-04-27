const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

// Pre-register models to ensure they are available for population
require('./models/Source');
require('./models/Article');
require('./models/User');

const articleRoutes = require('./routes/articles');
const topicRoutes = require('./routes/topics');
const sourceRoutes = require('./routes/sources');
const { ingestFeeds } = require('./ingest');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news_aggregator', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    
    // Schedule a job to run every 24 hours at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log(`[${new Date().toISOString()}] Starting scheduled daily news ingestion...`);
        // Note: Make sure the ingest.js exports ingestFeeds.
        if (typeof ingestFeeds === 'function') {
           await ingestFeeds();
           console.log(`[${new Date().toISOString()}] Scheduled news ingestion completed.`);
        } else {
           console.log('Error: ingestFeeds function not properly exported from ingest.js');
        }
    });
    console.log('Daily ingestion cron job scheduled (runs at midnight)');
}).catch(err => console.log('MongoDB connection error:', err));

app.use('/api/articles', articleRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/sources', sourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
