require('dotenv').config();
const mongoose = require('mongoose');
const Parser = require('rss-parser');
const axios = require('axios');
const Article = require('./models/Article');
const Source = require('./models/Source');

const parser = new Parser();

// Configure the live RSS feeds we want to scrape
const RSS_FEEDS = [
  {
    name: "BBC News - World",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    defaultCategories: ["world", "politics"]
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    defaultCategories: ["technology", "business"]
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    defaultCategories: ["technology"]
  },
  {
    name: "New York Times - World",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    defaultCategories: ["world", "politics"]
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    defaultCategories: ["technology", "science"]
  },
  {
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    defaultCategories: ["sports"]
  }
];

async function ingestFeeds() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news_aggregator');
    console.log('Connected to MongoDB');

    let articlesAdded = 0;

    for (const feedConfig of RSS_FEEDS) {
      console.log(`\nFetching RSS feed: ${feedConfig.name}...`);
      
      // 1. Ensure the Source exists in the DB
      let source = await Source.findOne({ name: feedConfig.name });
      if (!source) {
        source = await Source.create({
          name: feedConfig.name,
          url: new URL(feedConfig.url).origin,
          rssFeedUrl: feedConfig.url,
          reliabilityScore: 85
        });
      }

      // 2. Parse the RSS Feed (with error handling)
      let feed;
      try {
        feed = await parser.parseURL(feedConfig.url);
      } catch (feedError) {
        console.error(`  [Error] Failed to fetch feed ${feedConfig.name}:`, feedError.message);
        continue; // Skip to the next feed
      }

      for (const item of feed.items) {
        // Skip if article already exists
        const exists = await Article.exists({ url: item.link });
        if (exists) continue;

        const content = item.contentSnippet || item.content || item.title;
        let sentimentData = { score: 0, magnitude: 0, label: 'neutral' };

        // 3. Analyze sentiment via our Python Microservice
        try {
          const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:8000';
          const sentimentReq = await axios.post(`${nlpUrl}/analyze`, {
            text: content
          });
          sentimentData = sentimentReq.data;
        } catch (nlpError) {
          console.log(`  [Warning] NLP Service unreachable or failed for: ${item.title.substring(0, 30)}... Defaulting to neutral.`);
        }

        // 4. Save the Article
        await Article.create({
          title: item.title,
          content: content,
          summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
          url: item.link,
          sourceId: source._id,
          author: item.creator || feedConfig.name,
          categories: feedConfig.defaultCategories,
          publishedAt: item.isoDate || item.pubDate || new Date(),
          sentiment: sentimentData,
          tags: feedConfig.defaultCategories
        });

        console.log(`  + Saved: ${item.title}`);
        articlesAdded++;
      }
    }

    console.log(`\n✅ Ingestion Complete! Added ${articlesAdded} new articles.`);
    process.exit(0);

  } catch (error) {
    console.error('Fatal Error during ingestion:', error);
    process.exit(1);
  }
}

ingestFeeds();
