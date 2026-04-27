const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const articleRoutes = require('./routes/articles');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news_aggregator');

app.use('/api/articles', articleRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/sources', sourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
