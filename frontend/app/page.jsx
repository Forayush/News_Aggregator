'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending topics
        const trendRes = await axios.get('http://localhost:5000/api/articles/trending').catch(() => ({ data: [] }));
        setTrending(trendRes.data);
        
        // Fetch latest articles
        const artRes = await axios.get('http://localhost:5000/api/articles').catch(() => ({ data: [] }));
        setArticles(artRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="main-content">
        <h2>Latest News Feed</h2>
        {loading ? (
          <p>Loading news...</p>
        ) : (
          <div className="articles-grid">
            {articles.length > 0 ? articles.map(article => (
              <div key={article._id} className="article-card">
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <div className="article-meta">
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span className={`sentiment ${article.sentiment?.label || 'neutral'}`}>
                    Sentiment: {article.sentiment?.label || 'Neutral'}
                  </span>
                </div>
              </div>
            )) : <p>No articles found. Ensure the Node.js backend is running on port 5000.</p>}
          </div>
        )}
      </div>

      <aside className="sidebar">
        <h2>🔥 Trending Topics (24h)</h2>
        {trending.length > 0 ? (
          <ul className="trending-list">
            {trending.map(topic => (
              <li key={topic._id}>
                <div className="topic-header">
                  <strong>#{topic._id}</strong>
                  <span className="count">{topic.count} articles</span>
                </div>
                <div className="topic-sentiment">
                  Avg Score: {topic.avgSentiment?.toFixed(2) || 0}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No trending data available.</p>
        )}
      </aside>
    </div>
  );
}
