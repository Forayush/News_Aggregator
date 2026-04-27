const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Pre-register models to ensure they are available for population
require('./models/Source');
require('./models/Article');
require('./models/User');

const articleRoutes = require('./routes/articles');
const topicRoutes = require('./routes/topics');
const sourceRoutes = require('./routes/sources');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news_aggregator');

app.use('/api/articles', articleRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/sources', sourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
