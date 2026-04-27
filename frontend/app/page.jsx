'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await axios
          .get(`${API_BASE_URL}/api/articles/trending`)
          .catch(() => ({ data: [] }));
        setTrending(trendRes.data);

        const artRes = await axios
          .get(`${API_BASE_URL}/api/articles`)
          .catch(() => ({ data: [] }));
        setArticles(artRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [article.title, article.summary, article.sourceId?.name, ...(article.categories || [])]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const positiveCount = articles.filter((article) => article.sentiment?.label === 'positive').length;
  const sourceCount = new Set(articles.map((article) => article.sourceId?.name).filter(Boolean)).size;

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Real-time news dashboard</p>
          <h1>Track the stories moving across your sources.</h1>
          <p className="hero-copy">
            Monitor fresh articles, trending categories, and sentiment shifts from one focused workspace.
          </p>
        </div>
        <div className="hero-metrics" aria-label="News feed summary">
          <div>
            <strong>{articles.length}</strong>
            <span>Articles</span>
          </div>
          <div>
            <strong>{trending.length}</strong>
            <span>Trending</span>
          </div>
          <div>
            <strong>{positiveCount}</strong>
            <span>Positive</span>
          </div>
          <div>
            <strong>{sourceCount}</strong>
            <span>Sources</span>
          </div>
        </div>
      </section>

      <div className="content-layout">
        <section className="main-content" aria-labelledby="latest-news-title">
          <div className="section-toolbar">
            <div>
              <p className="eyebrow">Latest feed</p>
              <h2 id="latest-news-title">News Feed</h2>
            </div>
            <label className="search-field">
              <span>Search articles</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, topic, or source"
              />
            </label>
          </div>

          {loading ? (
            <div className="articles-grid">
              {[1, 2, 3].map((item) => (
                <div key={item} className="article-card skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="articles-grid">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <article key={article._id} className="article-card">
                    <div className="article-topline">
                      <span>{article.sourceId?.name || 'Unknown source'}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.summary || article.content?.slice(0, 180) || 'No summary available yet.'}</p>
                    {article.categories?.length > 0 && (
                      <div className="tag-row">
                        {article.categories.slice(0, 3).map((category) => (
                          <span key={category}>{category}</span>
                        ))}
                      </div>
                    )}
                    <div className="article-meta">
                      <span className={`sentiment ${article.sentiment?.label || 'neutral'}`}>
                        {article.sentiment?.label || 'neutral'}
                      </span>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read article
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No articles found</h3>
                  <p>Try a different search, or make sure the backend is running on port 5000.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="sidebar" aria-labelledby="trending-title">
          <p className="eyebrow">Last 24 hours</p>
          <h2 id="trending-title">Trending Topics</h2>
          {trending.length > 0 ? (
            <ul className="trending-list">
              {trending.map((topic) => (
                <li key={topic._id}>
                  <div className="topic-header">
                    <strong>#{topic._id}</strong>
                    <span className="count">{topic.count} articles</span>
                  </div>
                  <div className="topic-sentiment">
                    Avg score: {topic.avgSentiment?.toFixed(2) || 0}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No trending data available.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
