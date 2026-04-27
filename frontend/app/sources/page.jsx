'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/sources`);
        setSources(response.data);
      } catch (error) {
        console.error('Error fetching sources:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSources();
  }, []);

  return (
    <div className="page-shell">
      <section className="page-header">
        <p className="eyebrow">Source registry</p>
        <h1>News Sources</h1>
        <p>Review the feeds powering the aggregator and their current reliability signals.</p>
      </section>

      {loading ? (
        <div className="source-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="source-card skeleton-card" />
          ))}
        </div>
      ) : sources.length > 0 ? (
        <div className="source-grid">
          {sources.map((source) => (
            <article key={source._id} className="source-card">
              <div className="source-card-header">
                <h2>{source.name}</h2>
                <span className={source.isActive ? 'status-badge active' : 'status-badge inactive'}>
                  {source.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.url}
              </a>
              <div className="reliability-meter" aria-label={`Reliability score ${source.reliabilityScore || 0}`}>
                <span style={{ width: `${source.reliabilityScore || 0}%` }} />
              </div>
              <div className="source-meta">
                <span>Reliability {source.reliabilityScore || 0}%</span>
                {source.rssFeedUrl && <span>RSS configured</span>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No sources found</h3>
          <p>Add sources in the backend seed data to populate this page.</p>
        </div>
      )}
    </div>
  );
}
