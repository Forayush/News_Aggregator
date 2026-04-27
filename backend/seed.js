require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const seedData = [
  {
    title: "Global Markets Rally as Tech Stocks Surge",
    summary: "Technology companies led a massive surge in global markets today following promising AI breakthroughs.",
    content: "Full content about the tech stock surge... AI is leading the way forward, boosting investor confidence heavily.",
    url: "https://example.com/news/tech-rally-2026",
    author: "Jane Doe",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    categories: ["technology", "business"],
    tags: ["tech", "stocks", "ai", "markets"],
    sentiment: {
      score: 0.8,
      magnitude: 0.9,
      label: "positive"
    },
    metrics: { views: 1542, shares: 340 }
  },
  {
    title: "Severe Storms Disrupt Travel Across Europe",
    summary: "Hundreds of flights have been canceled due to sudden severe thunderstorms sweeping across Western Europe.",
    content: "Travelers face massive delays as extreme weather patterns cause chaos at major airports...",
    url: "https://example.com/news/europe-storms",
    author: "John Smith",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    categories: ["world", "weather"],
    tags: ["europe", "travel", "storms"],
    sentiment: {
      score: -0.7,
      magnitude: 0.8,
      label: "negative"
    },
    metrics: { views: 8900, shares: 1200 }
  },
  {
    title: "Local Team Wins Championship After Intense Overtime",
    summary: "In a nail-biting finish, the city's basketball team secured the national championship after double overtime.",
    content: "The crowd went wild as the final buzzer-beater shot went in, securing a 112-110 victory...",
    url: "https://example.com/news/sports-championship",
    author: "Alex Johnson",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    categories: ["sports"],
    tags: ["basketball", "championship", "finals"],
    sentiment: {
      score: 0.9,
      magnitude: 1.2,
      label: "positive"
    },
    metrics: { views: 45000, shares: 8900 }
  },
  {
    title: "New Policy Outlined for Urban Development",
    summary: "The city council released a 50-page document detailing plans for zoning and construction over the next decade.",
    content: "The new zoning laws will affect residential and commercial real estate developers...",
    url: "https://example.com/news/urban-policy",
    author: "Emily Chen",
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    categories: ["politics", "local"],
    tags: ["city council", "development", "policy"],
    sentiment: {
      score: 0.05,
      magnitude: 0.2,
      label: "neutral"
    },
    metrics: { views: 320, shares: 15 }
  },
  {
    title: "Breakthrough in Renewable Energy Storage",
    summary: "Scientists have unveiled a new battery technology capable of storing solar energy at unprecedented efficiencies.",
    content: "This new solid-state battery could revolutionize how we power our homes and vehicles...",
    url: "https://example.com/news/renewable-energy",
    author: "Dr. Sarah Miller",
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
    categories: ["science", "technology"],
    tags: ["renewable", "energy", "innovation"],
    sentiment: {
      score: 0.6,
      magnitude: 0.7,
      label: "positive"
    },
    metrics: { views: 12000, shares: 4500 }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news_aggregator');
    console.log('Connected to MongoDB');

    // Clear existing articles to prevent duplicates on multiple runs
    await Article.deleteMany({});
    console.log('Cleared existing articles');

    // Insert seed data
    await Article.insertMany(seedData);
    console.log('Successfully inserted seed data!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
